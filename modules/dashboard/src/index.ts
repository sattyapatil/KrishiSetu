import type { Clock } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';
import type { FarmerSummary } from '@krishisetu/farmer-profile';
import type { LandRecordsSummary } from '@krishisetu/land-records';
import type { CropRegistrySummary } from '@krishisetu/crop-registry';
import type { SchemeOffering } from '@krishisetu/schemes';
import type { CreditOffering } from '@krishisetu/credit';

export interface SourceStatusItem {
  readonly status: 'OK' | 'TIMEOUT' | 'ERROR';
  readonly durationMs: number;
  readonly asOf?: string;
  readonly messageKey?: string;
  readonly retryable?: boolean;
}

export interface CompositeDashboardModel {
  readonly metadata: {
    readonly correlationId: string;
    readonly generatedAt: string;
    readonly overallStatus: 'COMPLETE' | 'PARTIAL';
    readonly consentId: string;
    readonly consentValidUntil: string;
    readonly prototypeData: true;
  };
  readonly farmer: FarmerSummary;
  readonly readiness: {
    readonly land: 'READY' | 'UNKNOWN';
    readonly crop: 'READY' | 'UNKNOWN';
    readonly bank: 'READY' | 'UNKNOWN';
    readonly blockingIssues: readonly string[];
  };
  readonly land: LandRecordsSummary;
  readonly crops: CropRegistrySummary;
  readonly offerings: readonly (SchemeOffering | CreditOffering)[];
  readonly sourceStatus: {
    readonly mahabhumi: SourceStatusItem;
    readonly cropRegistry: SourceStatusItem;
    readonly mahadbt: SourceStatusItem;
    readonly uli: SourceStatusItem;
  };
}

export interface DashboardQueryInput {
  readonly farmerId: string;
  readonly consentId: string;
  readonly consentValidUntil: string;
  readonly correlationId: string;
}

export interface DashboardService {
  getDashboard(input: DashboardQueryInput, refreshDomains?: readonly string[]): Promise<CompositeDashboardModel>;
  purgeByConsent(consentId: string): number;
}

export const dashboardMigrations: readonly ModuleMigration[] = [
  {
    module: 'dashboard',
    version: 1,
    name: 'short lived dashboard cache',
    sql: `
      CREATE TABLE dashboard_cache (
        consent_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      ) STRICT;
    `,
  },
];

async function timed<T>(work: () => Promise<T>, timeoutMs: number): Promise<{
  value?: T;
  status: SourceStatusItem;
}> {
  const start = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const value = await Promise.race([
      work(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
      }),
    ]);
    return {
      value,
      status: { status: 'OK', durationMs: Math.max(0, Math.round(performance.now() - start)) },
    };
  } catch (error) {
    const timeout = error instanceof Error && error.message.includes('TIMEOUT');
    return {
      status: {
        status: timeout ? 'TIMEOUT' : 'ERROR',
        durationMs: Math.max(0, Math.round(performance.now() - start)),
        messageKey: timeout ? 'sources.common.timeout' : 'sources.common.temporarilyUnavailable',
        retryable: true,
      },
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function toAreaUnits(value: string): number {
  const [whole = '0', fraction = ''] = value.split('.');
  return Number(whole) * 10_000 + Number(fraction.padEnd(4, '0').slice(0, 4));
}

export function createDashboardService(input: {
  database: SqliteDatabase;
  clock: Clock;
  timeoutMs?: number;
  farmerProfile: { getSummary(farmerId: string): Promise<FarmerSummary> };
  landRecords: { getSummary(farmerId: string): Promise<LandRecordsSummary> };
  cropRegistry: { getSummary(farmerId: string): Promise<CropRegistrySummary> };
  schemes: {
    evaluate(facts: {
      farmerId: string;
      cultivableAreaUnits: number;
      cropCodes: readonly string[];
      jointOwnership: boolean;
      consentId: string;
      correlationId: string;
    }): Promise<readonly SchemeOffering[]>;
  };
  credit: {
    estimate(facts: {
      farmerId: string;
      cropAreas: Readonly<Record<string, number>>;
      consentId: string;
      correlationId: string;
    }): Promise<CreditOffering>;
  };
}): DashboardService {
  const timeoutMs = input.timeoutMs ?? 750;

  return {
    getDashboard: async (query, refreshDomains = []) => {
      if (refreshDomains.length === 0) {
        const cached = input.database
          .prepare(
            'SELECT payload_json AS payloadJson, expires_at AS expiresAt FROM dashboard_cache WHERE consent_id = ?'
          )
          .get(query.consentId) as { payloadJson: string; expiresAt: string } | undefined;
        if (cached && new Date(cached.expiresAt) > input.clock.now()) {
          return JSON.parse(cached.payloadJson) as CompositeDashboardModel;
        }
      }

      const farmerPromise = timed(() => input.farmerProfile.getSummary(query.farmerId), timeoutMs);
      const landPromise = timed(() => input.landRecords.getSummary(query.farmerId), timeoutMs);
      const cropsPromise = timed(() => input.cropRegistry.getSummary(query.farmerId), timeoutMs);
      const [farmerResult, landResult, cropResult] = await Promise.all([
        farmerPromise,
        landPromise,
        cropsPromise,
      ]);
      if (!farmerResult.value) throw new Error('DASHBOARD_UNAVAILABLE');

      const land = landResult.value ?? { totalCultivableShareHectares: '0.0000', holdings: [] };
      const crops = cropResult.value ?? { season: 'KHARIF' as const, year: 2026, items: [] };
      const areaUnits = toAreaUnits(land.totalCultivableShareHectares);
      const cropAreas = Object.fromEntries(
        crops.items.map((crop) => [crop.code, toAreaUnits(crop.areaHectares)])
      );
      const jointOwnership = land.holdings.some((holding) => !holding.shareLabel.endsWith('/1'));
      const [schemeResult, creditResult] = await Promise.all([
        timed(
          () =>
            input.schemes.evaluate({
              farmerId: query.farmerId,
              cultivableAreaUnits: areaUnits,
              cropCodes: crops.items.map((crop) => crop.code),
              jointOwnership,
              consentId: query.consentId,
              correlationId: query.correlationId,
            }),
          timeoutMs
        ),
        timed(
          () =>
            input.credit.estimate({
              farmerId: query.farmerId,
              cropAreas,
              consentId: query.consentId,
              correlationId: query.correlationId,
            }),
          timeoutMs
        ),
      ]);

      const sourceStatus = {
        mahabhumi: landResult.status,
        cropRegistry: cropResult.status,
        mahadbt: schemeResult.status,
        uli: creditResult.status,
      };
      const partial = Object.values(sourceStatus).some((source) => source.status !== 'OK');
      const offerings: Array<SchemeOffering | CreditOffering> = [...(schemeResult.value ?? [])];
      if (creditResult.value) {
        offerings.push(creditResult.value);
      } else {
        offerings.push({
          offeringId: 'offering_uli_kcc_2026',
          domain: 'ULI',
          schemeCode: 'KCC_CROP_LOAN',
          titleKey: 'credit.kcc.title',
          outcome: 'SOURCE_UNAVAILABLE',
          estimatedLimitPaise: 0,
          reasonKeys: ['credit.temporarilyUnavailable'],
          requiredScopes: ['CREDIT_PREAPPLY'],
          selectable: false,
          prototypeData: true,
        });
      }

      const model: CompositeDashboardModel = {
        metadata: {
          correlationId: query.correlationId,
          generatedAt: input.clock.isoString(),
          overallStatus: partial ? 'PARTIAL' : 'COMPLETE',
          consentId: query.consentId,
          consentValidUntil: query.consentValidUntil,
          prototypeData: true,
        },
        farmer: farmerResult.value,
        readiness: {
          land: landResult.value ? 'READY' : 'UNKNOWN',
          crop: cropResult.value ? 'READY' : 'UNKNOWN',
          bank: creditResult.value ? 'READY' : 'UNKNOWN',
          blockingIssues: creditResult.value ? [] : ['CREDIT_SOURCE_TEMPORARILY_UNAVAILABLE'],
        },
        land,
        crops,
        offerings,
        sourceStatus,
      };
      input.database
        .prepare(
          `INSERT INTO dashboard_cache (consent_id, farmer_id, payload_json, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(consent_id) DO UPDATE SET payload_json = excluded.payload_json,
             expires_at = excluded.expires_at, created_at = excluded.created_at`
        )
        .run(
          query.consentId,
          query.farmerId,
          JSON.stringify(model),
          new Date(input.clock.now().getTime() + 60_000).toISOString(),
          input.clock.isoString()
        );
      return model;
    },
    purgeByConsent: (consentId) =>
      Number(
        input.database.prepare('DELETE FROM dashboard_cache WHERE consent_id = ?').run(consentId)
          .changes
      ),
  };
}

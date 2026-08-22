import type { Clock, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface CreditOffering {
  readonly offeringId: string;
  readonly domain: 'ULI';
  readonly schemeCode: 'KCC_CROP_LOAN';
  readonly titleKey: string;
  readonly outcome: 'PREQUALIFIED_MOCK' | 'SOURCE_UNAVAILABLE' | 'INELIGIBLE';
  readonly estimatedLimitPaise: number;
  readonly reasonKeys: readonly string[];
  readonly requiredScopes: readonly string[];
  readonly selectable: boolean;
  readonly prototypeData: true;
}

export interface CreditFacts {
  readonly farmerId: string;
  readonly cropAreas: Readonly<Record<string, number>>;
  readonly consentId: string;
  readonly correlationId: string;
}

export interface MockCreditReceipt {
  readonly receipt: string;
  readonly acceptedAt: string;
  readonly status: 'ACCEPTED_MOCK';
}

export interface CreditService {
  estimate(facts: CreditFacts): Promise<CreditOffering>;
  submit(input: {
    farmerId: string;
    offeringId: string;
    consentId: string;
    correlationId: string;
  }): Promise<MockCreditReceipt>;
  purgeByConsent(consentId: string): number;
  readonly providerCalls: { estimate: number; submission: number };
}

export const creditRateCard = {
  version: 'kcc-demo-2026.08.1',
  productCode: 'KCC_CROP_LOAN',
  titleKey: 'credit.kcc.title',
  cropCostPaisePerHectare: {
    SOYBEAN: 20_000_000,
    PIGEON_PEA: 12_087_914,
    SUGARCANE: 9_000_000,
  },
  postHarvestBasisPoints: 1_000,
  assetMaintenanceBasisPoints: 2_000,
  illustrativeEffectiveRateBasisPoints: 400,
  requiredScopes: ['CREDIT_PREAPPLY'],
} as const;

export const creditMigrations: readonly ModuleMigration[] = [
  {
    module: 'credit',
    version: 1,
    name: 'credit estimates and mock pre-applications',
    sql: `
      CREATE TABLE credit_estimates (
        estimate_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        consent_id TEXT NOT NULL,
        rate_version TEXT NOT NULL,
        estimated_limit_paise INTEGER NOT NULL CHECK (estimated_limit_paise >= 0),
        created_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX credit_estimates_consent_idx ON credit_estimates(consent_id);
      CREATE TABLE credit_preapplications (
        preapplication_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        consent_id TEXT NOT NULL,
        offering_id TEXT NOT NULL,
        provider_receipt TEXT NOT NULL UNIQUE,
        accepted_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX credit_preapplications_consent_idx ON credit_preapplications(consent_id);
    `,
  },
];

export function calculateKccLimit(cropAreas: Readonly<Record<string, number>>): number {
  let base = 0;
  for (const [cropCode, areaUnits] of Object.entries(cropAreas)) {
    if (!Number.isInteger(areaUnits) || areaUnits < 0) throw new Error('VALIDATION_ERROR');
    const rate = creditRateCard.cropCostPaisePerHectare[
      cropCode as keyof typeof creditRateCard.cropCostPaisePerHectare
    ];
    if (rate) base += Math.round((areaUnits * rate) / 10_000);
  }
  const postHarvest = Math.round((base * creditRateCard.postHarvestBasisPoints) / 10_000);
  const maintenance = Math.round((base * creditRateCard.assetMaintenanceBasisPoints) / 10_000);
  return base + postHarvest + maintenance;
}

export function createCreditService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
}): CreditService {
  const providerCalls = { estimate: 0, submission: 0 };
  const failedOnce = new Set<string>();
  const estimateFailedOnce = new Set<string>();
  return {
    providerCalls,
    estimate: async (facts) => {
      providerCalls.estimate += 1;
      const estimateFailureKey = `${facts.farmerId}:${facts.consentId}`;
      if (facts.farmerId === '27202600000003' && !estimateFailedOnce.has(estimateFailureKey)) {
        estimateFailedOnce.add(estimateFailureKey);
        throw new Error('MOCK_PROVIDER_TIMEOUT');
      }
      const estimatedLimitPaise = calculateKccLimit(facts.cropAreas);
      input.database
        .prepare(
          `INSERT INTO credit_estimates
           (estimate_id, farmer_id, consent_id, rate_version, estimated_limit_paise, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          input.ids.nextUuid(),
          facts.farmerId,
          facts.consentId,
          creditRateCard.version,
          estimatedLimitPaise,
          input.clock.isoString()
        );
      return {
        offeringId: 'offering_uli_kcc_2026',
        domain: 'ULI',
        schemeCode: 'KCC_CROP_LOAN',
        titleKey: creditRateCard.titleKey,
        outcome: estimatedLimitPaise > 0 ? 'PREQUALIFIED_MOCK' : 'INELIGIBLE',
        estimatedLimitPaise,
        reasonKeys: ['credit.verifiedShareUsed', 'credit.currentCropUsed', 'credit.noDuplicate'],
        requiredScopes: creditRateCard.requiredScopes,
        selectable: estimatedLimitPaise > 0,
        prototypeData: true,
      };
    },
    submit: async ({ farmerId, offeringId, consentId }) => {
      providerCalls.submission += 1;
      if (offeringId !== 'offering_uli_kcc_2026') throw new Error('VALIDATION_ERROR');
      if (farmerId === '27202600000003' && !failedOnce.has(farmerId)) {
        failedOnce.add(farmerId);
        throw new Error('MOCK_PROVIDER_TIMEOUT');
      }
      const receipt = `MOCK-ULI-${input.ids.nextPrefixedId('receipt').slice(-8).toUpperCase()}`;
      const acceptedAt = input.clock.isoString();
      input.database
        .prepare(
          `INSERT INTO credit_preapplications
           (preapplication_id, farmer_id, consent_id, offering_id, provider_receipt, accepted_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(input.ids.nextUuid(), farmerId, consentId, offeringId, receipt, acceptedAt);
      return { receipt, acceptedAt, status: 'ACCEPTED_MOCK' };
    },
    purgeByConsent: (consentId) =>
      Number(
        input.database.prepare('DELETE FROM credit_estimates WHERE consent_id = ?').run(consentId)
          .changes
      ),
  };
}

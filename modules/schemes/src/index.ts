import type { Clock, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface SchemeOffering {
  readonly offeringId: string;
  readonly domain: 'MAHADBT';
  readonly schemeCode: string;
  readonly titleKey: string;
  readonly outcome: 'LIKELY_ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  readonly estimatedBenefitPaise: number;
  readonly reasonKeys: readonly string[];
  readonly requiredScopes: readonly string[];
  readonly selectable: boolean;
  readonly prototypeData: true;
}

export interface SchemeFacts {
  readonly farmerId: string;
  readonly cultivableAreaUnits: number;
  readonly cropCodes: readonly string[];
  readonly jointOwnership: boolean;
  readonly consentId: string;
  readonly correlationId: string;
}

export interface MockSubsidyReceipt {
  readonly receipt: string;
  readonly acceptedAt: string;
  readonly status: 'ACCEPTED_MOCK';
}

export interface SchemesService {
  evaluate(facts: SchemeFacts): Promise<readonly SchemeOffering[]>;
  submit(input: {
    farmerId: string;
    offeringId: string;
    consentId: string;
    correlationId: string;
  }): Promise<MockSubsidyReceipt>;
  purgeByConsent(consentId: string): number;
  readonly providerCalls: { eligibility: number; submission: number };
}

export const schemeCatalog = {
  version: 'mahadbt-demo-2026.08.1',
  offerings: {
    drip: {
      offeringId: 'offering_mahadbt_drip_2026',
      schemeCode: 'MAHADBT_DRIP',
      titleKey: 'schemes.drip.title',
      minimumCultivableAreaUnits: 1_000,
      requiredCropCodes: ['SOYBEAN', 'PIGEON_PEA'],
      benefitPaise: 4_800_000,
      requiredScopes: ['SUBSIDY_APPLY'],
    },
    mechanization: {
      offeringId: 'offering_mahadbt_mechanization_2026',
      schemeCode: 'SMAM_ROTAVATOR',
      titleKey: 'schemes.mechanization.title',
      minimumCultivableAreaUnits: 5_000,
      requiredCropCodes: ['SUGARCANE'],
      benefitPaise: 4_500_000,
      requiredScopes: ['SUBSIDY_APPLY'],
    },
  },
} as const;

export const schemesMigrations: readonly ModuleMigration[] = [
  {
    module: 'schemes',
    version: 1,
    name: 'eligibility snapshots and mock subsidy submissions',
    sql: `
      CREATE TABLE schemes_eligibility_snapshots (
        snapshot_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        consent_id TEXT NOT NULL,
        rule_version TEXT NOT NULL,
        offering_id TEXT NOT NULL,
        outcome TEXT NOT NULL,
        facts_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX schemes_snapshots_consent_idx ON schemes_eligibility_snapshots(consent_id);
      CREATE TABLE schemes_submissions (
        submission_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        consent_id TEXT NOT NULL,
        offering_id TEXT NOT NULL,
        provider_receipt TEXT NOT NULL UNIQUE,
        accepted_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX schemes_submissions_consent_idx ON schemes_submissions(consent_id);
    `,
  },
];

export function createSchemesService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
}): SchemesService {
  const providerCalls = { eligibility: 0, submission: 0 };
  return {
    providerCalls,
    evaluate: async (facts) => {
      providerCalls.eligibility += 1;
      const results: SchemeOffering[] = [];
      for (const rule of Object.values(schemeCatalog.offerings)) {
        const cropMatches = rule.requiredCropCodes.some((code) => facts.cropCodes.includes(code));
        const areaMatches = facts.cultivableAreaUnits >= rule.minimumCultivableAreaUnits;
        const outcome = !areaMatches || !cropMatches
          ? 'INELIGIBLE'
          : facts.jointOwnership && rule.schemeCode === 'SMAM_ROTAVATOR'
            ? 'NEEDS_REVIEW'
            : 'LIKELY_ELIGIBLE';
        const offering: SchemeOffering = {
          offeringId: rule.offeringId,
          domain: 'MAHADBT',
          schemeCode: rule.schemeCode,
          titleKey: rule.titleKey,
          outcome,
          estimatedBenefitPaise: outcome === 'INELIGIBLE' ? 0 : rule.benefitPaise,
          reasonKeys:
            outcome === 'INELIGIBLE'
              ? ['eligibility.requirementsNotMet']
              : facts.jointOwnership
                ? ['eligibility.cultivableShare', 'eligibility.activeCrop']
                : ['eligibility.cultivableShare', 'eligibility.activeCrop', 'eligibility.noDuplicate'],
          requiredScopes: rule.requiredScopes,
          selectable: outcome === 'LIKELY_ELIGIBLE',
          prototypeData: true,
        };
        input.database
          .prepare(
            `INSERT INTO schemes_eligibility_snapshots
             (snapshot_id, farmer_id, consent_id, rule_version, offering_id, outcome, facts_json, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .run(
            input.ids.nextUuid(),
            facts.farmerId,
            facts.consentId,
            schemeCatalog.version,
            offering.offeringId,
            offering.outcome,
            JSON.stringify({ areaUnits: facts.cultivableAreaUnits, cropCount: facts.cropCodes.length }),
            input.clock.isoString()
          );
        results.push(offering);
      }
      return results;
    },
    submit: async ({ farmerId, offeringId, consentId }) => {
      providerCalls.submission += 1;
      const known = Object.values(schemeCatalog.offerings).find(
        (offering) => offering.offeringId === offeringId
      );
      if (!known) throw new Error('VALIDATION_ERROR');
      const receipt = `MOCK-MDBT-${input.ids.nextPrefixedId('receipt').slice(-8).toUpperCase()}`;
      const acceptedAt = input.clock.isoString();
      input.database
        .prepare(
          `INSERT INTO schemes_submissions
           (submission_id, farmer_id, consent_id, offering_id, provider_receipt, accepted_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(input.ids.nextUuid(), farmerId, consentId, offeringId, receipt, acceptedAt);
      return { receipt, acceptedAt, status: 'ACCEPTED_MOCK' };
    },
    purgeByConsent: (consentId) =>
      Number(
        input.database
          .prepare('DELETE FROM schemes_eligibility_snapshots WHERE consent_id = ?')
          .run(consentId).changes
      ),
  };
}

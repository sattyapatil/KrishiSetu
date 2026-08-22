import { maskIdentifier } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface LandHoldingSummary {
  readonly ulpinMasked: string;
  readonly surveyNumber: string;
  readonly village: string;
  readonly bucketId: string;
  readonly shareLabel: string;
  readonly allocatedCultivableHectares: string;
  readonly encumbrancePresent: boolean;
}

export interface LandRecordsSummary {
  readonly totalCultivableShareHectares: string;
  readonly holdings: readonly LandHoldingSummary[];
}

export interface LandRecordsService {
  getSummary(farmerId: string): Promise<LandRecordsSummary>;
  getProviderView(farmerId: string): Promise<MockLandProviderResponse>;
  readonly providerCalls: { count: number };
}

export interface MockLandProviderResponse {
  readonly source: 'MOCK_MAHABHUMI';
  readonly asOf: string;
  readonly holdings: readonly {
    readonly ulpin: string;
    readonly surveyNumber: string;
    readonly cultivableAreaHectares: string;
    readonly shareNumerator: number;
    readonly shareDenominator: number;
    readonly allocatedCultivableHectares: string;
  }[];
  readonly prototypeData: true;
}

export const landRecordsMigrations: readonly ModuleMigration[] = [
  {
    module: 'land-records',
    version: 1,
    name: 'land parcels and ownership shares',
    sql: `
      CREATE TABLE land_records_parcels (
        ulpin TEXT PRIMARY KEY CHECK (length(ulpin) = 14),
        survey_number TEXT NOT NULL,
        village TEXT NOT NULL,
        cultivable_area_units INTEGER NOT NULL CHECK (cultivable_area_units > 0),
        as_of TEXT NOT NULL,
        synthetic INTEGER NOT NULL CHECK (synthetic = 1)
      ) STRICT;
      CREATE TABLE land_records_ownership (
        farmer_id TEXT NOT NULL CHECK (length(farmer_id) = 14),
        ulpin TEXT NOT NULL,
        bucket_id TEXT NOT NULL,
        share_numerator INTEGER NOT NULL CHECK (share_numerator > 0),
        share_denominator INTEGER NOT NULL CHECK (share_denominator >= share_numerator),
        encumbrance_present INTEGER NOT NULL CHECK (encumbrance_present IN (0, 1)),
        PRIMARY KEY (farmer_id, ulpin),
        FOREIGN KEY (ulpin) REFERENCES land_records_parcels(ulpin)
      ) STRICT;
      CREATE INDEX land_records_ownership_farmer_idx ON land_records_ownership(farmer_id);
    `,
  },
];

export function allocateCultivableArea(
  cultivableAreaUnits: number,
  numerator: number,
  denominator: number
): number {
  if (
    !Number.isInteger(cultivableAreaUnits) ||
    !Number.isInteger(numerator) ||
    !Number.isInteger(denominator) ||
    cultivableAreaUnits < 0 ||
    numerator <= 0 ||
    denominator < numerator
  ) {
    throw new Error('Invalid ownership share');
  }
  return Math.round((cultivableAreaUnits * numerator) / denominator);
}

function hectares(units: number): string {
  return (units / 10_000).toFixed(4);
}

const SYNTHETIC_LAND = [
  ['27202600000001', '27011003400128', '123/1A', 'Pashan', 13_500, 'BK_MH_560123_00491', 1, 2, 1],
  ['27202600000002', '27011003400129', '45/2', 'Baramati', 20_000, 'BK_MH_560123_00492', 1, 1, 0],
  ['27202600000003', '27011003400130', '88/4B', 'Haveli', 10_000, 'BK_MH_560123_00493', 1, 1, 0],
] as const;

export function createLandRecordsService(database: SqliteDatabase): LandRecordsService {
  const parcelInsert = database.prepare(
    `INSERT OR IGNORE INTO land_records_parcels
     (ulpin, survey_number, village, cultivable_area_units, as_of, synthetic)
     VALUES (?, ?, ?, ?, '2026-08-20', 1)`
  );
  const ownerInsert = database.prepare(
    `INSERT OR IGNORE INTO land_records_ownership
     (farmer_id, ulpin, bucket_id, share_numerator, share_denominator, encumbrance_present)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (const row of SYNTHETIC_LAND) {
    parcelInsert.run(row[1], row[2], row[3], row[4]);
    ownerInsert.run(row[0], row[1], row[5], row[6], row[7], row[8]);
  }
  const providerCalls = { count: 0 };

  const provider = async (farmerId: string): Promise<MockLandProviderResponse> => {
    providerCalls.count += 1;
    const rows = database
      .prepare(
        `SELECT p.ulpin, p.survey_number AS surveyNumber, p.cultivable_area_units AS cultivableUnits,
                p.as_of AS asOf, o.share_numerator AS numerator, o.share_denominator AS denominator
         FROM land_records_ownership o
         JOIN land_records_parcels p ON p.ulpin = o.ulpin
         WHERE o.farmer_id = ? ORDER BY p.ulpin`
      )
      .all(farmerId) as unknown as Array<{
      ulpin: string;
      surveyNumber: string;
      cultivableUnits: number;
      asOf: string;
      numerator: number;
      denominator: number;
    }>;
    return {
      source: 'MOCK_MAHABHUMI',
      asOf: rows[0]?.asOf ?? '2026-08-20',
      holdings: rows.map((row) => ({
        ulpin: row.ulpin,
        surveyNumber: row.surveyNumber,
        cultivableAreaHectares: hectares(row.cultivableUnits),
        shareNumerator: row.numerator,
        shareDenominator: row.denominator,
        allocatedCultivableHectares: hectares(
          allocateCultivableArea(row.cultivableUnits, row.numerator, row.denominator)
        ),
      })),
      prototypeData: true,
    };
  };

  return {
    providerCalls,
    getProviderView: provider,
    getSummary: async (farmerId) => {
      const raw = await provider(farmerId);
      const details = database
        .prepare(
          `SELECT p.ulpin, p.survey_number AS surveyNumber, p.village, p.cultivable_area_units AS cultivableUnits,
                  o.bucket_id AS bucketId, o.share_numerator AS numerator,
                  o.share_denominator AS denominator, o.encumbrance_present AS encumbrancePresent
           FROM land_records_ownership o JOIN land_records_parcels p ON p.ulpin = o.ulpin
           WHERE o.farmer_id = ? ORDER BY p.ulpin`
        )
        .all(farmerId) as unknown as Array<Record<string, string | number>>;
      let total = 0;
      const holdings = details.map((row) => {
        const allocated = allocateCultivableArea(
          Number(row.cultivableUnits),
          Number(row.numerator),
          Number(row.denominator)
        );
        total += allocated;
        return {
          ulpinMasked: maskIdentifier(String(row.ulpin)),
          surveyNumber: String(row.surveyNumber),
          village: String(row.village),
          bucketId: String(row.bucketId),
          shareLabel: `${row.numerator}/${row.denominator}`,
          allocatedCultivableHectares: hectares(allocated),
          encumbrancePresent: Boolean(row.encumbrancePresent),
        };
      });
      void raw;
      return { totalCultivableShareHectares: hectares(total), holdings };
    },
  };
}

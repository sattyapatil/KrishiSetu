import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface CropItem {
  readonly code: string;
  readonly nameKey: string;
  readonly areaHectares: string;
  readonly verification: 'MOCK_VERIFIED';
}

export interface CropRegistrySummary {
  readonly season: 'KHARIF' | 'RABI' | 'SUMMER';
  readonly year: number;
  readonly items: readonly CropItem[];
}

export interface CropRegistryService {
  getSummary(farmerId: string): Promise<CropRegistrySummary>;
  readonly providerCalls: { count: number };
}

export const cropRegistryMigrations: readonly ModuleMigration[] = [
  {
    module: 'crop-registry',
    version: 1,
    name: 'crop sown records',
    sql: `
      CREATE TABLE crop_registry_sown_records (
        survey_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL CHECK (length(farmer_id) = 14),
        ulpin TEXT NOT NULL CHECK (length(ulpin) = 14),
        season TEXT NOT NULL CHECK (season IN ('KHARIF', 'RABI', 'SUMMER')),
        crop_year INTEGER NOT NULL,
        crop_code TEXT NOT NULL,
        name_key TEXT NOT NULL,
        area_units INTEGER NOT NULL CHECK (area_units > 0),
        verification TEXT NOT NULL CHECK (verification = 'MOCK_VERIFIED'),
        synthetic INTEGER NOT NULL CHECK (synthetic = 1),
        UNIQUE (farmer_id, season, crop_year, crop_code)
      ) STRICT;
      CREATE INDEX crop_registry_farmer_idx ON crop_registry_sown_records(farmer_id);
    `,
  },
];

const SYNTHETIC_CROPS = [
  ['crop-0001-soy', '27202600000001', '27011003400128', 'SOYBEAN', 'crops.soybean', 5_000],
  ['crop-0001-tur', '27202600000001', '27011003400128', 'PIGEON_PEA', 'crops.pigeonPea', 1_750],
  ['crop-0002-sugar', '27202600000002', '27011003400129', 'SUGARCANE', 'crops.sugarcane', 20_000],
  ['crop-0003-soy', '27202600000003', '27011003400130', 'SOYBEAN', 'crops.soybean', 10_000],
] as const;

export function createCropRegistryService(database: SqliteDatabase): CropRegistryService {
  const insert = database.prepare(
    `INSERT OR IGNORE INTO crop_registry_sown_records
     (survey_id, farmer_id, ulpin, season, crop_year, crop_code, name_key, area_units, verification, synthetic)
     VALUES (?, ?, ?, 'KHARIF', 2026, ?, ?, ?, 'MOCK_VERIFIED', 1)`
  );
  for (const row of SYNTHETIC_CROPS) insert.run(...row);
  const providerCalls = { count: 0 };
  return {
    providerCalls,
    getSummary: async (farmerId) => {
      providerCalls.count += 1;
      const rows = database
        .prepare(
          `SELECT crop_code AS code, name_key AS nameKey, area_units AS areaUnits,
                  season, crop_year AS cropYear
           FROM crop_registry_sown_records WHERE farmer_id = ? ORDER BY crop_code`
        )
        .all(farmerId) as unknown as Array<{
        code: string;
        nameKey: string;
        areaUnits: number;
        season: CropRegistrySummary['season'];
        cropYear: number;
      }>;
      return {
        season: rows[0]?.season ?? 'KHARIF',
        year: rows[0]?.cropYear ?? 2026,
        items: rows.map((row) => ({
          code: row.code,
          nameKey: row.nameKey,
          areaHectares: (row.areaUnits / 10_000).toFixed(4),
          verification: 'MOCK_VERIFIED',
        })),
      };
    },
  };
}

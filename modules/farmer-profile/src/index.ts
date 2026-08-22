import { maskIdentifier } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface LocalizedText {
  readonly en: string;
  readonly mr: string;
  readonly hi: string;
  readonly kn: string;
}

export interface SyntheticFarmerProfileSeed {
  readonly farmerId: string;
  readonly name: LocalizedText;
  readonly village: LocalizedText;
  readonly district: string;
  readonly synthetic: true;
}

export interface FarmerSummary {
  readonly farmerIdMasked: string;
  readonly displayName: LocalizedText;
  readonly village: LocalizedText;
  readonly district: string;
  readonly identityStatus: 'MOCK_VERIFIED';
}

export interface FarmerProfileService {
  getSummary(farmerId: string): Promise<FarmerSummary>;
}

export const farmerProfileMigrations: readonly ModuleMigration[] = [
  {
    module: 'farmer-profile',
    version: 1,
    name: 'synthetic farmer profiles',
    sql: `
      CREATE TABLE farmer_profile_records (
        farmer_id TEXT PRIMARY KEY CHECK (length(farmer_id) = 14),
        name_json TEXT NOT NULL,
        village_json TEXT NOT NULL,
        district TEXT NOT NULL,
        identity_status TEXT NOT NULL CHECK (identity_status = 'MOCK_VERIFIED'),
        synthetic INTEGER NOT NULL CHECK (synthetic = 1)
      ) STRICT;
    `,
  },
];

export function createFarmerProfileService(input: {
  database: SqliteDatabase;
  seeds: readonly SyntheticFarmerProfileSeed[];
}): FarmerProfileService {
  const insert = input.database.prepare(
    `INSERT OR IGNORE INTO farmer_profile_records
     (farmer_id, name_json, village_json, district, identity_status, synthetic)
     VALUES (?, ?, ?, ?, 'MOCK_VERIFIED', 1)`
  );
  for (const seed of input.seeds) {
    insert.run(seed.farmerId, JSON.stringify(seed.name), JSON.stringify(seed.village), seed.district);
  }

  return {
    getSummary: async (farmerId) => {
      const row = input.database
        .prepare(
          `SELECT name_json AS nameJson, village_json AS villageJson, district
           FROM farmer_profile_records WHERE farmer_id = ?`
        )
        .get(farmerId) as { nameJson: string; villageJson: string; district: string } | undefined;
      if (!row) throw new Error('DEMO_FARMER_NOT_FOUND');
      return {
        farmerIdMasked: maskIdentifier(farmerId),
        displayName: JSON.parse(row.nameJson) as LocalizedText,
        village: JSON.parse(row.villageJson) as LocalizedText,
        district: row.district,
        identityStatus: 'MOCK_VERIFIED',
      };
    },
  };
}

import type { Clock, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface AuditRecord {
  readonly id: string;
  readonly category: 'ACCESS' | 'CONSENT' | 'APPLICATION' | 'PURGE';
  readonly occurredAt: string;
  readonly correlationId: string;
  readonly principalIdMasked?: string;
  readonly action: string;
  readonly facts: Readonly<Record<string, string | number | boolean>>;
}

export interface AuditService {
  append(input: Omit<AuditRecord, 'id' | 'occurredAt'>): AuditRecord;
  exportEvidence(): readonly AuditRecord[];
}

export const auditMigrations: readonly ModuleMigration[] = [
  {
    module: 'audit',
    version: 1,
    name: 'sanitized audit records',
    sql: `
      CREATE TABLE audit_records (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL CHECK (category IN ('ACCESS', 'CONSENT', 'APPLICATION', 'PURGE')),
        occurred_at TEXT NOT NULL,
        correlation_id TEXT NOT NULL,
        principal_id_masked TEXT,
        action TEXT NOT NULL,
        facts_json TEXT NOT NULL
      ) STRICT;
      CREATE INDEX audit_records_correlation_idx ON audit_records(correlation_id);
    `,
  },
];

export function createAuditService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
}): AuditService {
  return {
    append: (record) => {
      const created: AuditRecord = {
        ...record,
        id: input.ids.nextPrefixedId('audit'),
        occurredAt: input.clock.isoString(),
      };
      input.database
        .prepare(
          `INSERT INTO audit_records
           (id, category, occurred_at, correlation_id, principal_id_masked, action, facts_json)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          created.id,
          created.category,
          created.occurredAt,
          created.correlationId,
          created.principalIdMasked ?? null,
          created.action,
          JSON.stringify(created.facts)
        );
      return created;
    },
    exportEvidence: () =>
      input.database
        .prepare(
          `SELECT id, category, occurred_at AS occurredAt, correlation_id AS correlationId,
                  principal_id_masked AS principalIdMasked, action, facts_json AS factsJson
           FROM audit_records ORDER BY occurred_at, id`
        )
        .all()
        .map((raw) => {
          const row = raw as Record<string, unknown>;
          return {
            id: String(row.id),
            category: String(row.category) as AuditRecord['category'],
            occurredAt: String(row.occurredAt),
            correlationId: String(row.correlationId),
            principalIdMasked: row.principalIdMasked ? String(row.principalIdMasked) : undefined,
            action: String(row.action),
            facts: JSON.parse(String(row.factsJson)) as AuditRecord['facts'],
          };
        }),
  };
}

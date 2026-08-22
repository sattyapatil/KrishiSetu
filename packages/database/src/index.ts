import { createHash } from 'node:crypto';
import { DatabaseSync, type StatementSync } from 'node:sqlite';

export interface ModuleMigration {
  readonly module: string;
  readonly version: number;
  readonly name: string;
  readonly sql: string;
}

export interface AppliedMigration {
  readonly module: string;
  readonly version: number;
  readonly name: string;
  readonly checksum: string;
  readonly appliedAt: string;
}

export interface SqliteDatabase {
  readonly native: DatabaseSync;
  prepare(sql: string): StatementSync;
  exec(sql: string): void;
  transaction<T>(work: () => T): T;
  close(): void;
}

function checksum(migration: ModuleMigration): string {
  return createHash('sha256').update(migration.sql.trim()).digest('hex');
}

export function createSqliteDatabase(path = ':memory:'): SqliteDatabase {
  const native = new DatabaseSync(path, {
    enableForeignKeyConstraints: true,
    enableDoubleQuotedStringLiterals: false,
    allowExtension: false,
    timeout: 2_000,
  });
  native.exec('PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;');

  return {
    native,
    prepare: (sql) => native.prepare(sql),
    exec: (sql) => native.exec(sql),
    transaction: <T>(work: () => T): T => {
      if (native.isTransaction) {
        return work();
      }
      native.exec('BEGIN IMMEDIATE');
      try {
        const value = work();
        native.exec('COMMIT');
        return value;
      } catch (error) {
        native.exec('ROLLBACK');
        throw error;
      }
    },
    close: () => native.close(),
  };
}

export function runMigrations(
  database: SqliteDatabase,
  migrations: readonly ModuleMigration[],
  appliedAt = new Date().toISOString()
): readonly AppliedMigration[] {
  database.exec(`
    CREATE TABLE IF NOT EXISTS platform_migrations (
      module TEXT NOT NULL,
      version INTEGER NOT NULL CHECK (version > 0),
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TEXT NOT NULL,
      PRIMARY KEY (module, version)
    ) STRICT;
  `);

  const ordered = [...migrations].sort(
    (left, right) => left.module.localeCompare(right.module) || left.version - right.version
  );
  const seen = new Set<string>();

  database.transaction(() => {
    for (const migration of ordered) {
      const key = `${migration.module}:${migration.version}`;
      if (seen.has(key)) {
        throw new Error(`Duplicate migration ${key}`);
      }
      seen.add(key);

      const expected = checksum(migration);
      const existing = database
        .prepare(
          'SELECT checksum FROM platform_migrations WHERE module = ? AND version = ?'
        )
        .get(migration.module, migration.version) as { checksum: string } | undefined;

      if (existing) {
        if (existing.checksum !== expected) {
          throw new Error(`Migration checksum mismatch for ${key}`);
        }
        continue;
      }

      database.exec(migration.sql);
      database
        .prepare(
          `INSERT INTO platform_migrations (module, version, name, checksum, applied_at)
           VALUES (?, ?, ?, ?, ?)`
        )
        .run(migration.module, migration.version, migration.name, expected, appliedAt);
    }
  });

  return database
    .prepare(
      `SELECT module, version, name, checksum, applied_at AS appliedAt
       FROM platform_migrations ORDER BY module, version`
    )
    .all() as unknown as AppliedMigration[];
}

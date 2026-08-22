import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSqliteDatabase, runMigrations } from './index.js';

describe('packages/database', () => {
  it('runs migrations idempotently and records checksums', () => {
    const database = createSqliteDatabase();
    const migrations = [
      {
        module: 'example',
        version: 1,
        name: 'create records',
        sql: 'CREATE TABLE example_records (id TEXT PRIMARY KEY) STRICT;',
      },
    ] as const;

    assert.equal(runMigrations(database, migrations).length, 1);
    assert.equal(runMigrations(database, migrations).length, 1);
    database.close();
  });

  it('rolls back failed transactions', () => {
    const database = createSqliteDatabase();
    database.exec('CREATE TABLE values_table (value TEXT NOT NULL) STRICT;');
    assert.throws(() =>
      database.transaction(() => {
        database.prepare('INSERT INTO values_table (value) VALUES (?)').run('first');
        throw new Error('stop');
      })
    );
    const row = database.prepare('SELECT COUNT(*) AS count FROM values_table').get() as {
      count: number;
    };
    assert.equal(row.count, 0);
    database.close();
  });
});

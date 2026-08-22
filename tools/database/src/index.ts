import { existsSync, unlinkSync } from 'node:fs';
import { basename, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApplicationRuntime } from '@krishisetu/api';
import { env } from '@krishisetu/config';

export function ensurePrototypeDatabase(path = env.databasePath): number {
  const runtime = createApplicationRuntime({ databasePath: path });
  const row = runtime.database
    .prepare('SELECT COUNT(*) AS count FROM platform_migrations')
    .get() as { count: number };
  runtime.close();
  return row.count;
}

export function resetPrototypeDatabase(path = env.databasePath): number {
  if (!env.prototypeMode) throw new Error('Database reset requires PROTOTYPE_MODE=true.');
  if (path === ':memory:') return ensurePrototypeDatabase(path);
  const resolved = resolve(path);
  const filename = basename(resolved);
  if (!isAbsolute(resolved) || !/^krishisetu(?:[-_.][a-z0-9_-]+)?\.sqlite$/i.test(filename)) {
    throw new Error('Refusing reset: target must be an explicit KrishiSetu .sqlite file.');
  }
  if (existsSync(resolved)) unlinkSync(resolved);
  return ensurePrototypeDatabase(resolved);
}

function main(): void {
  const command = process.argv[2] ?? 'ensure';
  const count = command === 'reset' ? resetPrototypeDatabase() : ensurePrototypeDatabase();
  console.log(`KrishiSetu prototype database ready with ${count} applied migrations.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

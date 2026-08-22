import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../');

function getKeysAndPlaceholders(obj: Record<string, unknown>, prefix = ''): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const nested = getKeysAndPlaceholders(v as Record<string, unknown>, fullKey);
      for (const [nk, nv] of nested.entries()) {
        map.set(nk, nv);
      }
    } else if (typeof v === 'string') {
      const matches = v.match(/\{([^}]+)\}/g) || [];
      map.set(fullKey, matches.sort());
    }
  }
  return map;
}

describe('KrishiSetu Locale Completeness & Interpolation Parity', () => {
  const messagesRoot = path.join(workspaceRoot, 'packages/i18n/messages');
  const locales = ['en', 'mr', 'hi', 'kn'] as const;

  it('all four locales (en, mr, hi, kn) have identical message namespaces and keys', () => {
    const enFiles = fs.readdirSync(path.join(messagesRoot, 'en')).filter((f) => f.endsWith('.json'));

    for (const locale of ['mr', 'hi', 'kn']) {
      const localeDir = path.join(messagesRoot, locale);
      assert.ok(fs.existsSync(localeDir), `Locale directory missing: ${locale}`);

      for (const file of enFiles) {
        const enFilePath = path.join(messagesRoot, 'en', file);
        const targetFilePath = path.join(localeDir, file);

        assert.ok(
          fs.existsSync(targetFilePath),
          `Missing translation file ${file} in locale ${locale}`
        );

        const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
        const targetContent = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));

        const enMap = getKeysAndPlaceholders(enContent);
        const targetMap = getKeysAndPlaceholders(targetContent);

        const enKeys = Array.from(enMap.keys()).sort();
        const targetKeys = Array.from(targetMap.keys()).sort();

        assert.deepEqual(
          targetKeys,
          enKeys,
          `Key mismatch in ${locale}/${file} compared to canonical en/${file}`
        );

        // Assert identical interpolation parameters
        for (const key of enKeys) {
          const enVars = enMap.get(key) || [];
          const targetVars = targetMap.get(key) || [];
          assert.deepEqual(
            targetVars,
            enVars,
            `Interpolation variable mismatch for key "${key}" in ${locale}/${file}`
          );
        }
      }
    }
  });
});

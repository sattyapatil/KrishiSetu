import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../');

function findFiles(dir: string, extensions: string[], excludeDirs: string[] = []): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        !excludeDirs.includes(entry.name) &&
        entry.name !== 'node_modules' &&
        entry.name !== 'dist' &&
        entry.name !== '.next'
      ) {
        results.push(...findFiles(fullPath, extensions, excludeDirs));
      }
    } else if (entry.isFile()) {
      if (extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

describe('KrishiSetu Architecture Boundary Invariants', () => {
  const scanDirs = ['apps', 'modules', 'packages', 'tools'].map((d) =>
    path.join(workspaceRoot, d)
  );

  it('prohibits deep imports into KrishiSetu package/module src internals', () => {
    const tsFiles: string[] = [];
    for (const dir of scanDirs) {
      tsFiles.push(...findFiles(dir, ['.ts', '.tsx', '.js', '.jsx']));
    }

    const deepImportPattern = /from\s+['"]@krishisetu\/[^'"]+\/src\//;
    const violations: string[] = [];

    for (const file of tsFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (deepImportPattern.test(content)) {
        violations.push(path.relative(workspaceRoot, file));
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Deep imports detected in files: ${violations.join(', ')}`
    );
  });

  it('restricts direct process.env access exclusively to packages/config', () => {
    const tsFiles: string[] = [];
    for (const dir of scanDirs) {
      tsFiles.push(...findFiles(dir, ['.ts', '.tsx', '.js', '.jsx']));
    }

    const violations: string[] = [];
    for (const file of tsFiles) {
      const rel = path.relative(workspaceRoot, file);
      if (rel.startsWith('packages/config/') || rel.startsWith('packages/eslint-config/') || rel.startsWith('tools/')) {
        continue;
      }
      const content = fs.readFileSync(file, 'utf8');
      if (/process\.env\b/.test(content)) {
        violations.push(rel);
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Direct process.env access outside packages/config: ${violations.join(', ')}`
    );
  });

  it('restricts raw hex colors outside design-tokens source/generated/tests', () => {
    const sourceFiles: string[] = [];
    for (const dir of scanDirs) {
      sourceFiles.push(...findFiles(dir, ['.ts', '.tsx', '.js', '.jsx', '.css']));
    }

    const violations: string[] = [];
    for (const file of sourceFiles) {
      const rel = path.relative(workspaceRoot, file);
      if (
        rel.includes('/tokens/') ||
        rel.includes('/generated/') ||
        rel.includes('.test.') ||
        rel.includes('/tests/') ||
        rel.includes('/fixtures/')
      ) {
        continue;
      }
      const content = fs.readFileSync(file, 'utf8');
      const noComments = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      const stripped = noComments.replace(/var\(--ks-color-[^,)]+,\s*#[0-9A-Fa-f]{3,8}\)/g, '');
      const hexMatches = stripped.match(/#[0-9A-Fa-f]{3,8}\b/g);
      if (hexMatches && hexMatches.length > 0) {
        violations.push(`${rel}: ${hexMatches.join(', ')}`);
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Raw hex colors found outside token sources: ${violations.join(', ')}`
    );
  });

  it('ensures no prohibited official government emblem files exist in prototype', () => {
    const allFiles: string[] = [];
    for (const dir of ['apps', 'modules', 'packages'].map((d) => path.join(workspaceRoot, d))) {
      allFiles.push(...findFiles(dir, ['']));
    }

    const emblemPattern = /(state.*emblem|ashoka.*chakra|lion.*capital)/i;
    const violations = allFiles.filter((f) => emblemPattern.test(path.basename(f)));

    assert.deepEqual(
      violations,
      [],
      `Prohibited emblem asset filenames found: ${violations.join(', ')}`
    );
  });
});

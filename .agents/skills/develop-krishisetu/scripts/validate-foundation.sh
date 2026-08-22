#!/usr/bin/env bash
set -euo pipefail

skill_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
workspace_root="$(cd "${skill_dir}/../../.." && pwd)"
failures=0
warnings=0

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  failures=$((failures + 1))
}

warn() {
  printf 'WARN: %s\n' "$1" >&2
  warnings=$((warnings + 1))
}

pass() {
  printf 'PASS: %s\n' "$1"
}

required_docs=(
  "docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md"
  "docs/architecture/API-CONTRACT-AND-DATA-FLOWS.md"
  "docs/architecture/SECURITY-PRIVACY-AND-THREAT-MODEL.md"
  "docs/design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md"
  "docs/implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md"
)

for relative_path in "${required_docs[@]}"; do
  if [[ -f "${workspace_root}/${relative_path}" ]]; then
    pass "required source exists: ${relative_path}"
  else
    fail "required source missing: ${relative_path}"
  fi
done

skill_files=(
  "SKILL.md"
  "agents/openai.yaml"
  "references/source-map.md"
  "references/non-negotiables.md"
  "references/module-playbook.md"
  "references/validation-matrix.md"
)

for relative_path in "${skill_files[@]}"; do
  if [[ -s "${skill_dir}/${relative_path}" ]]; then
    pass "skill resource exists: ${relative_path}"
  else
    fail "skill resource missing or empty: ${relative_path}"
  fi
done

scan_roots=()
for directory in apps modules packages tools deployment; do
  if [[ -d "${workspace_root}/${directory}" ]]; then
    scan_roots+=("${workspace_root}/${directory}")
  fi
done

if ((${#scan_roots[@]} == 0)); then
  warn "implementation folders do not exist yet; static source checks skipped"
else
  # Use Node.js engine for cross-platform static code scanning
  node -e "
const fs = require('fs');
const path = require('path');

const workspaceRoot = process.cwd();
const scanRoots = ['apps', 'modules', 'packages', 'tools', 'deployment']
  .map(d => path.join(workspaceRoot, d))
  .filter(d => fs.existsSync(d));

function getFiles(dir, exts = []) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.next' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(full, exts));
    } else if (entry.isFile()) {
      if (exts.length === 0 || exts.some(ext => entry.name.endsWith(ext))) {
        files.push(full);
      }
    }
  }
  return files;
}

let nodeFailures = 0;

// 1. Prohibited live government/NPCI hosts
const allCodeFiles = scanRoots.flatMap(d => getFiles(d, ['.ts', '.tsx', '.js', '.jsx', '.json', '.html']));
const liveHostRegex = /(https?:\/\/[^\s\"']*\.(gov|nic)\.in|aadhaar\.gov\.in|npci\.org\.in)/;
const liveHostHits = allCodeFiles.filter(f => {
  if (f.endsWith('.md') || f.includes('/fixtures/') || f.includes('/generated/') || f.includes('.test.')) return false;
  const content = fs.readFileSync(f, 'utf8');
  return liveHostRegex.test(content);
});

if (liveHostHits.length > 0) {
  console.error('FAIL: runtime implementation contains a prohibited live government/NPCI host:', liveHostHits);
  nodeFailures++;
} else {
  console.log('PASS: no prohibited live government/NPCI runtime host found');
}

// 2. Direct process.env access confined to packages/config
const envFiles = scanRoots.flatMap(d => getFiles(d, ['.ts', '.tsx', '.js', '.mjs', '.cjs']));
const envHits = envFiles.filter(f => {
  const rel = path.relative(workspaceRoot, f);
  if (rel.startsWith('packages/config/') || rel.startsWith('packages/eslint-config/') || rel.startsWith('tools/')) return false;
  const content = fs.readFileSync(f, 'utf8');
  return /\bprocess\.env\b/.test(content);
});

if (envHits.length > 0) {
  console.error('FAIL: direct process.env access exists outside packages/config:', envHits);
  nodeFailures++;
} else {
  console.log('PASS: process.env access is confined to packages/config');
}

// 3. Raw hex colors outside token source/generated/tests
const hexFiles = scanRoots.flatMap(d => getFiles(d, ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss']));
const hexHits = hexFiles.filter(f => {
  const rel = path.relative(workspaceRoot, f);
  if (rel.includes('/packages/design-tokens/') || rel.includes('/generated/') || rel.includes('.test.') || rel.includes('/tests/') || rel.includes('/fixtures/')) return false;
  const content = fs.readFileSync(f, 'utf8');
  const noComments = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  const stripped = noComments.replace(/var\(--ks-color-[^,)]+,\s*#[0-9A-Fa-f]{3,8}\)/g, '');
  return /#[0-9A-Fa-f]{3,8}\b/.test(stripped);
});

if (hexHits.length > 0) {
  console.error('FAIL: raw hex design colours found outside token sources:', hexHits);
  nodeFailures++;
} else {
  console.log('PASS: raw design colours are confined to approved locations');
}

// 4. Deep source imports
const deepHits = envFiles.filter(f => {
  const content = fs.readFileSync(f, 'utf8');
  return /from\s+[\"']@krishisetu\/[^\/\"']+\/src\//.test(content);
});

if (deepHits.length > 0) {
  console.error('FAIL: deep import into a KrishiSetu package/module source detected:', deepHits);
  nodeFailures++;
} else {
  console.log('PASS: no KrishiSetu deep source imports found');
}

// 5. Prohibited emblem assets
const allFiles = scanRoots.flatMap(d => getFiles(d));
const emblemHits = allFiles.filter(f => /(state.*emblem|ashoka.*chakra|lion.*capital)/i.test(path.basename(f)));

if (emblemHits.length > 0) {
  console.error('FAIL: prototype implementation contains a potentially prohibited official emblem asset:', emblemHits);
  nodeFailures++;
} else {
  console.log('PASS: no prohibited emblem-like asset filename found');
}

if (nodeFailures > 0) {
  process.exit(1);
}
" || failures=$((failures + 1))

fi

printf '\nFoundation validation: %d failure(s), %d warning(s).\n' "${failures}" "${warnings}"
if ((failures > 0)); then
  exit 1
fi

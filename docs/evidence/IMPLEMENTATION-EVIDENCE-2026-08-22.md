# KrishiSetu Implementation Evidence — 2026-08-22

## Scope completed

This implementation closes the prototype backend and integration gaps identified in the final plan: persistence, module-owned migrations, trust modules, synthetic agricultural adapters, deterministic rules, composite dashboard, application saga, API composition, generated client, refresh continuity, synchronous withdrawal, local deployment assets, and smoke tooling.

The runtime remains deliberately synthetic. It has no live government, bank, identity, weather, or benefit-system connection.

## Automated evidence

| Command | Result |
| --- | --- |
| `npm ci --ignore-scripts` | Pass; lockfile reproducible; 0 npm vulnerabilities |
| `npm run build` | Pass for every workspace; Next.js generated 51 locale pages |
| `npm run typecheck` | Pass |
| `npm test` | 92 tests passed, 0 failed, 27 suites |
| `npm run test:contract` | API trust boundary, dashboard, partial refresh, idempotent saga, refresh restoration, preference persistence, consent purge passed |
| `npm run codegen:check` | Pass; zero generated drift |
| `npm run validate:foundation` | 0 failures, 0 warnings |
| `npm run validate:fixtures` | Pass; synthetic fixture invariants intact |
| `npm run test:architecture` | 4/4 pass |
| `npm run test:locales` | 1/1 pass; English, Marathi, Hindi, Kannada parity |
| `npm run test:a11y` | 7/7 shared-component semantic tests pass |
| `DATABASE_PATH=:memory: npm run db:migrate` | Pass; 11 migrations applied |
| `npm run smoke:public` | Health, readiness, metadata, personas, and OpenAPI return HTTP 200 |

## Manual browser evidence

The in-app browser exercised the real web/API boundary on local ports 3000/3101:

1. Login with fictional persona `27202600000001` and demo PIN.
2. Grant six required dashboard scopes.
3. Load composed land (`0.675` hectares), crops, drip eligibility (`₹48,000.00`), and integer-paise KCC estimate (`₹1,57,500.01`).
4. Refresh the dashboard and restore the HttpOnly-cookie session plus purpose-specific consent.
5. Select the eligible subsidy and KCC offering; refresh the review page and retain selection.
6. Explicitly accept the two additional dispatch scopes and both declarations.
7. Submit one application bundle with accepted mock MahaDBT and ULI children.
8. Refresh the bundle route and restore it from persisted API state.
9. Withdraw the most recent consent; synchronously purge/pseudonymize derived state, invalidate the session, and display receipt counts.

The pass also corrected misleading legacy copy (certification, real SSO, Aadhaar/bank mapping, provider names), removed a selectable ineligible scheme, and replaced fixture values on review with API-derived values.

## Research applied

- Node's official SQLite guidance informed prepared statements, foreign keys, busy timeout, defensive configuration, WAL, and transaction behavior.
- Fastify's official validation/serialization and CORS guidance informed the API boundary and response/error handling.
- MeitY's DPDP Rules 2025 material informed specific, bounded notice/consent wording without claiming legal certification.
- RBI's ULI and KCC publications informed consent-before-data-access and illustrative credit modeling; all results remain mock and non-financial advice.
- GIGW and UX4G guidance informed persistent identity/disclosure, keyboard semantics, status visibility, and notification presentation.

## Honest limitations

- Node 22 reports `node:sqlite` as experimental. The prototype passes on Node 22.17; a production implementation should qualify a supported Node LTS/database driver and encrypted storage.
- `test:a11y` is semantic component coverage, not automated axe, screen-reader, forced-colors, 320 px, 200% zoom, or visual-regression coverage. The English desktop journey was manually exercised; the remaining manual matrix is not claimed complete.
- Dockerfiles and Compose are checked in, but Docker was unavailable in this environment, so image build/runtime evidence is not claimed.
- No public deployment was performed; `smoke:public` validates an in-process public API surface.
- Notifications and weather remain clearly marked synthetic presentation datasets. They are not live sources.
- Phase 14 alternate PostgreSQL/HTTP/outbox/service-extraction exercises remain future architectural fitness work, not prototype functionality.
- The repository still contains some legacy feature-level English literals. Locale catalogs have full key parity, but a complete literal-to-message-key migration remains a quality backlog item.

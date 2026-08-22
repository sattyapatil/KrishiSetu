# Krishi-Ekatra Hackathon Execution and Demo Plan

> **Historical sequencing notice:** the implementation sequence is now phase-based in [KrishiSetu Final Implementation Plan](../implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md). Retain this document for its demo script, release gates, contingency cuts, and deadline history. Marathi-first/default-language statements here are superseded: English is the configurable default and Marathi, Hindi, and Kannada are supported.

**Working date:** August 22, 2026 (IST)  
**Internal feature/content freeze:** August 27, 2026, 6:00 PM IST  
**Official form deadline:** August 28, 2026, 8:00 PM IST  
**Submission buffer:** at least 24 hours; no core feature work after freeze unless fixing a blocker

## 1. Definition of done

The project is done when a reviewer can open a public browser link and complete this journey without access approval or real personal data:

1. Read the prototype/mock disclosure and switch Marathi/English.
2. Tap a supplied 14-digit synthetic Farmer ID, enter demo PIN `2468`, and sign in.
3. Understand and grant named consent scopes for a 30-minute purpose.
4. See land share, crop, masked bank readiness, MahaDBT eligibility, and ULI/KCC estimate from one composite request.
5. Select one subsidy and one KCC pre-application.
6. Review which prefilled data will be reused and submit once.
7. Receive two mock child receipts under one bundle, with clear status steps.
8. Withdraw consent and receive a purge receipt; reuse of that consent fails before provider access.

The journey must work at 360px, by keyboard, and with a throttled/failed mock provider. Every screen must remain unmistakably non-official and synthetic.

## 2. Delivery strategy

Build one vertical slice before adding breadth:

```text
Identity → consent → one composite API → two cards → one bundled submit → receipt → revoke
```

Only after that slice is deployed and tested may the team add mismatch repair, market/soil cards, sunlight mode, or trace visualization.

## 3. Day-by-day roadmap

### August 22 — Architecture lock and skeleton

**Outcome:** both apps start locally, contracts compile, database seeds, and the main page skeleton exists.

- Accept this architecture pack as the source of truth.
- Initialize npm workspaces: `apps/web`, `apps/api`, `packages/contracts`, `packages/design-system`.
- Pin Node 24 in `.nvmrc` and pin dependencies in `package-lock.json`.
- Create strict TypeScript/ESLint/Prettier configs and CI skeleton.
- Create Fastify `app.ts` factory, health routes, error envelope, request/correlation IDs, security headers, CORS, and Swagger generation.
- Create Next layouts, locale routing, disclosure banner, design tokens, and mobile navigation shell.
- Implement SQL migration runner and the four migration files.
- Seed one happy persona plus one joint-ownership scenario using hand-authored deterministic fixtures first.
- Add `.env.example`, README quick start, and mock-data safety statement.

**Exit checks:**

- `npm ci && npm run typecheck && npm run build` passes.
- `/health/ready` returns 200 after migrations/seed.
- English and Marathi public/login shells render at 360px.
- No network/provider integration is present.

### August 23 — Identity, consent, and registry adapters

**Outcome:** login and consent work end to end; land/crop provider routes return schema-valid data.

- Implement allowlisted Farmer ID login and demo PIN.
- Set Secure/HttpOnly session cookie, CSRF token, logout, rate limiting, and owner context.
- Implement `consents` table/service, ES256 dev signing, grant/read/expiry/revocation state checks.
- Build the consent page with purpose, granular scopes, duration, who/why, Allow, and Not now.
- Implement Mahabhumi and Crop Registry repositories/services/adapters and `/mock` routes.
- Implement joint ownership Bucket ID and allocated cultivable share.
- Add cross-persona and consent-bypass integration tests.
- Add fixture validator for identifier/URL/PII-like patterns.

**Exit checks:**

- Protected mock adapter spy remains untouched for missing/wrong/expired consent.
- A seeded farmer can grant consent and fetch land/crop JSON.
- A second persona cannot access the first persona's consent or holdings.

### August 24 — Composite gateway, MahaDBT, and ULI

**Outcome:** one dashboard request fans out to four simulated domains and renders partial-safe cards.

- Implement deterministic MahaDBT rule engine and reason codes.
- Implement deterministic KCC calculator with integer money and mock rate cards.
- Add MahaDBT and ULI mock routes and typed adapters.
- Build dashboard orchestrator with consent-scoped `Promise.allSettled`, 750ms domain timeouts, normalized response, and source statuses.
- Build dashboard identity/readiness/land/crop/bank cards and two selectable offering cards.
- Add plain-language Marathi/English reason and error mappings.
- Add deterministic mock failure profiles for tests and one controlled demo scenario.
- Add contract tests for each single-domain timeout and total failure.

**Exit checks:**

- Happy dashboard response validates against OpenAPI.
- Each domain can independently time out without hiding successful data.
- UI shows loading, partial, empty, expired-consent, and success states.

### August 25 — Bundled application process and status

**Outcome:** the main process failure is solved: one submit reliably creates two mock applications.

- Implement `application_bundles`, `child_applications`, events, and idempotency records.
- Implement server-side revalidation of offerings and consent scopes.
- Create parent/children transaction, concurrent provider dispatch, and parent aggregation.
- Implement same-key/same-body replay and same-key/different-body conflict.
- Implement partial child failure and retry-only-failed-child behavior.
- Build review page, reused-data summary, sticky submit bar, receipt, and plain-language stepper.
- Add ten-concurrent-request idempotency test.
- Add Playwright happy path from login through two receipts.

**Exit checks:**

- Repeated/double-click submit never duplicates a child.
- Successful child remains successful when the other child fails.
- One retry touches only the failed child.
- A 360px reviewer completes the main journey without horizontal scroll.

### August 26 — Revocation, safety, accessibility, and deployment

**Outcome:** privacy lifecycle is demonstrable and a public deployment is available.

- Implement synchronous purge transaction, pseudonymization, minimal tombstone, receipt digest, session invalidation, and post-revoke denial.
- Build Privacy page and clear browser query cache on logout/revoke.
- Add purge-table integration assertions.
- Add runtime egress guard and repository safety tests.
- Add CSP/security headers and Pino redaction snapshot tests.
- Complete Marathi main-path copy review; fix Devanagari line-height/spacing.
- Run axe, keyboard, focus, zoom, reduced-motion, and 360px tests.
- Deploy API to Render; run migrations/seed at start; deploy web to Vercel.
- Configure exact origins, production secrets, health checks, and public smoke test.

**Exit checks:**

- Public link opens without access request.
- Browser network log shows only web/API hosting origins.
- Revocation blocks the old consent before any adapter call.
- No serious/critical automated accessibility issues on main screens.

### August 27 — Freeze, evidence, video, and submission package

**Outcome:** a stable, honestly documented submission candidate is frozen by 6:00 PM IST.

- Run clean checkout/install/migrate/seed/build/test/deploy rehearsal.
- Test public link on one low-end Android or emulation, one iPhone-sized viewport, and desktop.
- Run normal, ULI-timeout, double-submit, and revoke journeys.
- Capture architecture trace, screenshots, OpenAPI, test output, Lighthouse result, and known limitations under `docs/evidence`.
- Optional only if green: run OpenAI synthetic generator for two additional scenarios, validate, review, and commit manifest.
- Record a video no longer than two minutes:
  - first minute: citizen journey;
  - second minute: gateway fan-out, consent/purge, mock boundary, and meaningful Codex/OpenAI use.
- Draft and verify the under-250-word project summary.
- Check every URL in a signed-out/private browser window.
- Tag the tested commit `demo-final`; record deployment commit SHA and fixture manifest SHA.
- Stop feature work at 6:00 PM. Fix only broken links, failed main journey, critical safety, or critical accessibility issues.

**Exit checks:**

- All release gates in section 6 are green.
- Video duration is ≤2:00 and text summary is <250 words.
- Demo credentials appear next to the live link and work from a fresh session.

### August 28 — Submission buffer

The official brief shows **August 28, 2026 at 8:00 PM IST**. This day is reserved for:

- re-checking production health and cold-start behavior;
- replacing a failed deployment with the frozen build only;
- final video/link permissions check;
- completing the form well before 8:00 PM;
- saving submission confirmation.

Do not depend on this day for unfinished core functionality.

## 4. Workstream board

| Workstream | Must-have artifacts | Main dependencies |
|---|---|---|
| Contracts/data | TypeBox schemas, migrations, fixtures, validator, OpenAPI | Architecture lock |
| Backend gateway | auth, consent guard, four adapters, orchestrator, bundle saga, purge | Contracts/data |
| Frontend | bilingual shells, consent, dashboard, review, receipts, privacy | Contracts; can start with fixture responses |
| Quality/safety | API tests, Playwright, axe, egress scan, log redaction | Incremental across all days |
| Deployment/demo | Vercel/Render, smoke test, evidence, video, summary | Stable vertical slice |

If two people are available, Person A leads gateway/data and Person B leads frontend/design; both pair on contracts, end-to-end tests, copy review, and demo. If solo, follow the date order and do not start secondary features.

## 5. Test matrix

### 5.1 Critical happy path

```text
fresh browser
→ /mr
→ disclosure visible
→ select Farmer ID 27202600000001
→ PIN 2468
→ grant all main-journey scopes
→ dashboard COMPLETE
→ select MAHADBT_DRIP + KCC_CROP_LOAN
→ review prefilled data
→ submit once
→ bundle COMPLETED with exactly two child receipts
→ withdraw consent
→ purge COMPLETED
→ old consent returns CONSENT_REVOKED and zero adapter calls
```

### 5.2 Required failure journeys

- ULI timeout: dashboard partial, subsidy selectable, targeted retry works.
- Bank mapping error: raw code hidden in main message; technical code available; simulated correction is clearly local/mock.
- Joint ownership: UI shows `1/2 share`; calculations use `0.6750 ha`, not `1.3500 ha`.
- Double tap/offline retry: one bundle only.
- Consent denial: limited screen explains what is unavailable and offers a non-coercive review action.
- Consent expiry on review page: submit stops before provider call and returns to consent renewal with selections preserved in memory.

### 5.3 Manual accessibility checklist

- Complete flow using only keyboard and visible focus.
- Screen-reader names include visible bilingual meaning; icons are not the only label.
- Error summary receives focus and links to the invalid field.
- Status changes use a polite live region; submission success uses a heading and moves focus.
- 200% zoom and 360px viewport have no two-dimensional scrolling.
- Touch targets are at least 48×48 CSS px; primary mobile targets are 56px high.
- Devanagari matras are not clipped at font zoom.
- High-contrast/sunlight mode does not erase focus/status distinctions.

## 6. Release gates

| Gate | Command/evidence | Blocking condition |
|---|---|---|
| Install/build | `npm ci && npm run build` | Any failure |
| Static quality | `npm run lint && npm run typecheck` | Any error |
| Unit/integration | `npm test` | Any main-module failure |
| Contract | `npm run test:contract` | Schema mismatch or unsafe raw error |
| E2E | `npm run test:e2e` | Happy path or partial retry failure |
| Accessibility | `npm run test:a11y` + manual checklist | serious/critical issue on main path |
| Fixture safety | `npm run validate:fixtures` | PII-like pattern, unapproved URL, missing synthetic marker |
| Network safety | signed-out browser network capture | any government/bank/analytics/font request |
| Public delivery | fresh private-window smoke test | access request, broken credentials, cold-start failure |
| Honesty | screenshot set | missing mock/non-official label |

## 7. Two-minute demo runbook

### 0:00–0:10 — Problem and disclosure

“A farmer currently repeats the same land and identity process across disconnected portals. This is Krishi-Ekatra, a non-official prototype using only fictional data.”

Show the persistent disclosure and Marathi default.

### 0:10–0:25 — One identity and real consent choice

Tap the supplied 14-digit Farmer ID, enter `2468`, and show the consent purpose, scopes, duration, and withdrawal control. Grant consent.

### 0:25–0:48 — Unified data and explainable outcomes

Show the one-request dashboard, joint land share, crop record, bank readiness, MahaDBT benefit, KCC estimate, and “how calculated” reasons. Keep technical codes collapsed.

### 0:48–1:00 — One bundled submit

Select drip subsidy + KCC, review reused fields, submit once, and show the two mock receipts under one bundle.

### 1:00–1:25 — Backend/infrastructure

Show the sanitized request trace or architecture diagram: one gateway verifies consent, fans out concurrently to four simulated DPI providers, tolerates partial failure, and uses idempotency plus a parent/child saga.

### 1:25–1:40 — Privacy/safety

Withdraw consent. Show the purge receipt, session clear, and that no live government service or real Aadhaar data is involved.

### 1:40–1:55 — OpenAI/Codex contribution

Show fixture manifest, schema validator, and generated failure test: Codex/OpenAI helped create schema-bounded fictional AgriStack scenarios, bilingual error explanations, API scaffolding, and contract tests. Deterministic code makes every mock eligibility and credit calculation.

### 1:55–2:00 — Honest close

“The integrations and approvals are mocked; the working contribution is the consented orchestration and end-to-end process pattern that sanctioned DPI connections could later replace.”

## 8. Submission summary draft (under 250 words)

Krishi-Ekatra is a non-official, mobile-first prototype for farmers trapped between disconnected land, crop, subsidy, banking, and credit portals. Instead of asking a farmer to upload the same 7/12 extract repeatedly or decipher opaque rejection codes, it uses one fictional 14-digit Farmer ID and a clear, time-bound consent step to assemble a reusable farm profile.

The working citizen journey uses only synthetic data. One dashboard request is split by a TypeScript gateway across simulated Mahabhumi, Crop Registry, MahaDBT, and ULI services. It resolves joint ownership through a Bucket ID, explains scheme and KCC outcomes with deterministic rules, and submits a subsidy application and credit pre-application together under one idempotent bundle. Partial provider failures do not erase successful results, and consent withdrawal immediately stops processing and purges consent-derived prototype data.

Krishi-Ekatra is designed Marathi-first for low-cost mobile devices, with large touch targets, plain-language status messages, progressive disclosure, and a persistent notice that it is not a government website. No live government APIs, real Aadhaar data, payments, OTPs, or official logos are used.

Codex and the OpenAI Responses API meaningfully support the build by generating schema-bounded fictional AgriStack fixtures, bilingual failure scenarios, typed API scaffolding, and contract tests. Generated data is validated and reviewed; models do not decide benefits or loans. The prototype demonstrates how sanctioned DPI integrations could later replace mocks without changing the farmer journey.

## 9. Contingency cuts

Cut in this order if the schedule slips:

1. market prices and soil-health secondary cards;
2. sunlight mode;
3. NPCI mismatch repair UI (keep a documented fixture/test);
4. interactive trace screen (use static architecture diagram and logs);
5. extra personas beyond happy, joint-owner, and timeout scenarios;
6. installable PWA behavior.

Never cut consent enforcement, mock disclosure, idempotent bundle semantics, partial failure, revocation, main Marathi/English copy, or public end-to-end testing.

## 10. Known limitations to disclose

- All provider integrations, OTP/PIN behavior, records, decisions, applications, and receipts are mocked.
- The consent artefact is a local ES256 simulation, not an official DEPA/consent-manager certification.
- Credit and benefit values are illustrative rule fixtures, not financial advice or current scheme entitlements.
- SQLite and a single API instance are intentionally selected for the prototype; production would require sanctioned provider contracts, managed relational storage, key management, queues/outbox, monitoring, disaster recovery, and formal legal/security review.
- Marathi copy requires native-speaker review before any real citizen use.

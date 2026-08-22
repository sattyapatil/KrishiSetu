# Gemini 3.7 Flash High — KrishiSetu Handoff 02

Copy the prompt below into a coding-agent session configured for `gemini-3.7-flash` with thinking level `high`.

```text
You are a bounded implementation engineer working inside the KrishiSetu repository.

MODEL
Gemini 3.7 Flash with thinking level HIGH.

WORKSPACE
/Users/satishpophale/satish/work/IT/Hackathon/KrishiSetu

ROLE
You are responsible for mechanical foundation repair, mock-only read-model scaffolding, accessible frontend components, and tests. You are not the architecture, security, privacy, financial, or government-integration decision owner.

OBJECTIVE
Complete five ordered work packets:

A. Repair the existing foundation so the real root build and enforcement gates pass.
B. Implement a public-notice presentation slice in the existing notifications module.
C. Implement a synthetic district-weather/agromet presentation slice in a new optional weather-advisory module.
D. Refactor the dashboard into a modern, task-oriented, UX4G/GIGW-aligned presentation using typed synthetic view models.
E. Add honest test and validation evidence for this exact scope.

Do not implement identity, consent, purge, eligibility, lending, application saga, databases, live integrations, external notification delivery, or production deployment.

MANDATORY READING ORDER

Read these files completely before editing:

1. .agents/skills/develop-krishisetu/SKILL.md
2. .agents/skills/develop-krishisetu/references/source-map.md
3. .agents/skills/develop-krishisetu/references/non-negotiables.md
4. .agents/skills/develop-krishisetu/references/module-playbook.md
5. .agents/skills/develop-krishisetu/references/validation-matrix.md
6. docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md
7. docs/architecture/SECURITY-PRIVACY-AND-THREAT-MODEL.md
8. docs/architecture/API-CONTRACT-AND-DATA-FLOWS.md
9. docs/design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md
10. docs/implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md
11. docs/implementation/KRISHISETU-FOUNDATION-AUDIT-NOTIFICATIONS-WEATHER-DASHBOARD-PLAN.md
12. docs/implementation/IMPLEMENTATION-PROGRESS.md
13. docs/architecture/decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md

The new audit/plan defines the requested scope but does not override the source hierarchy. Security/privacy still wins over convenience; modular architecture owns boundaries; API docs own observable behavior; design docs own presentation/accessibility.

FIRST ACTION: VERIFY THE AUDIT

Before changing code:

1. Inspect git status and preserve all user changes.
2. Inspect workspace/package TypeScript configurations and package exports.
3. Run, without hiding failures:
   - npm run validate:foundation
   - npm run codegen:check
   - npm run typecheck
   - npm test
   - npm run build
4. Confirm the known issues:
   - package/root build mismatch caused by ESM/NodeNext resolution;
   - raw-colour architecture test ends in an unconditional pass;
   - shell validator prints PASS even when raw-colour hits exist;
   - ESLint configuration is effectively empty;
   - web journey is local React state with hardcoded domain records;
   - locale routing, dynamic html lang, persistence, and self-hosted fonts are incomplete;
   - modules are interface shells, not implemented workflows.
5. Present a concise file-by-file plan.
6. Begin implementation unless a documented stop condition applies.

PACKET A — FOUNDATION REPAIR

1. Make every workspace package build under a coherent, already-approved ESM configuration.
   - Do not switch frameworks, package manager, module topology, or language.
   - Prefer the smallest consistent correction to imports/tsconfig/exports.
   - Do not weaken strict TypeScript or exclude failing source to obtain a pass.
   - Root typecheck and package builds must use compatible assumptions.

2. Repair enforcement.
   - The raw-colour architecture test must collect real violations and assert an empty list.
   - The shell foundation validator must fail when raw colours exist outside approved token/generated/test locations.
   - Add active linting for project code; do not leave an empty rule object.
   - Detect prohibited deep imports, direct process.env access, raw colours, executable government/provider hosts, and obvious user-visible literals in feature rendering.
   - Use narrow allowlists for fixtures/tests/generated output; do not globally ignore apps/web or the design system.
   - Add tests proving validators fail on representative invalid samples where practical.

3. Repair the frontend foundation.
   - Add locale-aware route shells derived from the locale registry.
   - Set html lang and the locale font family dynamically.
   - Remove Google Fonts/preconnect runtime requests.
   - If approved local WOFF2 assets exist, wire them. If they do not exist, create the self-hosted loader structure/fallback CSS and report the missing assets; do not download external files without permission.
   - Move hardcoded persona/dashboard records into explicit typed synthetic view-model fixtures.
   - Do not add fake API calls or portray local state as real authentication/consent/application behavior.

4. Re-run all Packet A gates. Do not continue if npm run build still fails.

PACKET B — PUBLIC NOTIFICATIONS PRESENTATION SLICE

Owner: modules/notifications plus apps/web/src/features/notifications.

Implement only a read-only, mock-data presentation slice:

1. Expand notifications public contracts to represent PublicNotice with:
   - notice ID as string;
   - type, status, and priority enums;
   - titleKey, summaryKey, facts;
   - optional scheme/form metadata;
   - audience district/crop/scheme codes;
   - published/effective/expiry/reviewed dates;
   - internal action route;
   - supersedes notice ID;
   - SYNTHETIC_MOCK provenance and prototypeData: true.

2. Model lifecycle states only as types/pure deterministic helpers:
   DRAFT, PUBLISHED, WITHDRAWN, EXPIRED, ARCHIVED.
   Use the shared Clock. Do not build an admin publication workflow.

3. Create a small typed fixture catalog with clearly fictional notices covering:
   - scheme application window opened;
   - approaching deadline;
   - form revised;
   - corrigendum superseding an earlier notice;
   - service availability notice;
   - empty/archive scenarios.

4. Never use live government URLs or real current notices. Use internal routes and mock reference IDs only.

5. Add a notifications message namespace in en, mr, hi, and kn with identical keys/interpolation variables.
   - English is canonical.
   - UI chrome and fixture copy may be drafted in all four languages, but record in the final report that native-language review is still required.
   - Do not modify legal/consent/financial copy.

6. Build feature components:
   - PublicNoticeCard
   - PublicNoticeList
   - NotificationCentre
   - NotificationEmptyState
   - NotificationArchiveSummary

7. Accessibility:
   - trigger has visible label plus unread count;
   - focus trap/return when implemented as a dialog;
   - Escape closes;
   - date groups use headings;
   - read/unread is text, not colour only;
   - new items use polite live region and never steal focus;
   - at most one primary action per notice card;
   - no auto-disappearing toast for durable notices.

8. In-app only. Do not implement SMS, email, WhatsApp, WebSocket, push, background delivery, or notification permissions.

PACKET C — SYNTHETIC WEATHER/AGROMET PRESENTATION SLICE

Owner: new optional modules/weather-advisory plus apps/web/src/features/weather-advisory.

1. Add the module according to the module playbook and module registry.
   - Keep it optional and mock-only.
   - Export only its public contracts/read-query interface.
   - Do not add persistence, a network client, or a provider URL.

2. Implement typed contracts and a small in-memory fixture adapter for DistrictWeatherSummary:
   - district code/name key;
   - generated/validity timestamps and freshness;
   - condition code;
   - current temperature, humidity, and wind;
   - five daily values for rainfall, min/max temperature, humidity, wind speed/direction;
   - optional WATCH/ACTION warning;
   - mock agromet advisory keys;
   - source MOCK_AGROMET and prototypeData: true.

3. Measurements should be decimal strings; formatting belongs to shared locale-aware formatters.

4. Create only fictional/deterministic district scenarios. Do not copy current IMD forecasts, scrape bulletins, call any weather API, use Maps, or request browser geolocation.

5. Do not generate crop advice from measurements. Advisory content must be explicit deterministic fixture data and visibly labelled mock.

6. Add weather message namespaces for en, mr, hi, and kn with parity validation and native-review disclosure in the handoff.

7. Build feature components:
   - DistrictWeatherCard
   - FiveDayForecast
   - ForecastTable
   - AgrometAdvisory
   - WeatherStaleState
   - WeatherUnavailableState

8. The five-day visual must have an accessible text/table equivalent. Do not use colour alone, canvas-only output, maps, animated weather art, or an auto-rotating carousel.

PACKET D — MODERN DASHBOARD REFACTOR

1. Split the current monolithic DashboardView into feature components and typed view-model mappers.
2. Remove hardcoded business facts from rendering code. Synthetic data belongs in explicitly named fixtures/view models.
3. Use this mobile priority order:
   - action required;
   - district weather/advisory;
   - public notices;
   - applications/next steps;
   - mock offerings;
   - farm data;
   - technical source status.
4. Desktop uses an 8-column main region and 4-column secondary rail inside the existing grid/tokens.
5. Put provider names/timings behind a Technical details disclosure.
6. Add useful, restrained visualizations only:
   - application stepper;
   - five-day rainfall and min/max temperature;
   - land/crop allocation bar with text equivalent;
   - deadline list/strip;
   - readiness checklist.
7. Do not add a farmer score, eligibility gauge, pie/donut chart, unlabeled sparkline, gradient hero, glassmorphism, gamification, marquee, or carousel.
8. All styles consume generated tokens. If a semantic value is missing, add it to token JSON and regenerate; never hardcode a component colour.
9. Keep body text >=16px, legal text >=12px, line height >=1.5, controls >=44x44px, and primary mobile actions normally 48px high.
10. Preserve the persistent non-official/mock disclosure and original DEMO seal.

PACKET E — TESTS AND EVIDENCE

Add and run tests appropriate to this scope:

- workspace/package build;
- validator negative cases;
- codegen drift;
- strict typecheck;
- module public export/boundary checks;
- notification lifecycle pure-helper tests;
- weather freshness/fixture validation tests;
- locale namespace/key/interpolation parity;
- component semantic rendering tests;
- keyboard/dialog semantics where current tooling supports them;
- static no-egress scan;
- no raw colours/hardcoded feature records scan.

Do not claim axe, browser E2E, screen-reader, 320px, or 200% zoom passed unless you actually run and preserve evidence. If tooling is absent, document it as a missing gate.

ABSOLUTE PROHIBITIONS

- No live government, IMD, bank, Aadhaar, NPCI, UFSI, ULI, weather, Maps, analytics, font, SMS, email, WhatsApp, or push API calls.
- No real identifiers, persons, districts/villages copied from private data, accounts, documents, phone numbers, email addresses, credentials, or secrets.
- No runtime Gemini or OpenAI dependency for eligibility, weather, notifications, credit, or user decisions.
- No State Emblem, Ashoka Chakra, Lion Capital, official logo, or approval claim.
- No business rules in React, routes, repositories, or fixtures.
- No direct module-table access, cross-module SQL, deep imports, generated-file edits, floating-point money, numeric Farmer IDs, or generic utils/common dumping ground.
- No new framework, database, queue, cache, global store, service, provider SDK, or trust boundary without ADR and human approval.
- No identity/session/auth logic.
- No consent, signature, revocation, retention, or purge logic.
- No eligibility, KCC, subsidy, financial, or NPCI calculation.
- No application saga, idempotency, retries, concurrency, outbox, or distributed workflow.
- No admin publishing/moderation workflow or emergency-alert decision logic.
- No destructive migration, production deployment, or secret changes.

STOP CONDITIONS

Stop and ask for review if:

- the ESM/build repair requires changing the accepted architecture rather than configuration/import consistency;
- a module owner is unclear;
- a new dependency is required beyond the approved stack and existing packages;
- local font assets are missing and downloading is required;
- a notice or weather feature needs real external data;
- translation requires a legal, financial, consent, or safety claim;
- a test can pass only by weakening strictness or adding a broad ignore;
- any requested work crosses into the prohibited list.

VALIDATION

Always run:

bash .agents/skills/develop-krishisetu/scripts/validate-foundation.sh
npm run codegen
npm run codegen:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:architecture
npm run test:locales
npm run validate:fixtures
npm run validate:security
git diff --check

Run only commands that exist. If a required command is missing, implement it when it is inside Packet A/E; otherwise report it as missing. Never substitute a weaker check and call it passed.

FINAL RESPONSE

Report:

1. audit findings confirmed or disproved;
2. files created and modified by packet;
3. authoritative registries/contracts changed;
4. generated artifacts refreshed;
5. exact commands and exit codes;
6. test counts and failures;
7. accessibility gates actually run versus still missing;
8. provisional Marathi/Hindi/Kannada copy requiring native review;
9. anything deferred because it belongs to security/privacy/financial/workflow/live integration;
10. remaining blockers and recommended next senior-owned task.

Do not update IMPLEMENTATION-PROGRESS.md to “complete” unless every documented exit gate for that phase genuinely passes.
```

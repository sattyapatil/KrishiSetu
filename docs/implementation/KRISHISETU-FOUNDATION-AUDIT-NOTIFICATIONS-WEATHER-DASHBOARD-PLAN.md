# KrishiSetu Foundation Audit, Public Notifications, Weather, and Dashboard Plan

**Status:** Approved planning baseline; implementation not yet complete  
**Repository audited:** `/Users/satishpophale/satish/work/IT/Hackathon/KrishiSetu`  
**Audit date:** August 22, 2026  
**Architecture style:** TypeScript modular monolith  
**Safety boundary:** synthetic fixtures and in-process mocks only

## 1. Executive decision

Gemini 3.7 Flash High produced a useful initial scaffold, but the repository is not yet a phase-complete foundation. The Next.js presentation build works, code generation is current, the four locale catalogs have key parity, and 50 narrow tests pass. However, the root workspace build fails, important architecture checks are no-ops, the API and worker do not compile under their package configurations, the citizen journey is local React state rather than an integrated application, and several implementation claims in `IMPLEMENTATION-PROGRESS.md` are inaccurate.

The next implementation must therefore follow this order:

1. repair and prove the foundation gates;
2. add a read-only public-notification vertical slice;
3. add a read-only synthetic district-weather/agromet vertical slice;
4. compose both into a calmer, more useful dashboard;
5. defer identity, consent, purge, eligibility, lending, application saga, live integrations, and production publishing workflows to senior-reviewed work.

This order preserves the modular architecture and gives Gemini 3.7 Flash High a large amount of mechanical and presentation work without delegating high-consequence domain behavior.

## 2. Audit method and verified results

The audit read the KrishiSetu skill, non-negotiables, module playbook, validation matrix, modular architecture, API/data-flow contract, security model, design system, implementation plan, progress report, package configuration, module exports, API shell, web shell, validators, and tests.

The following commands were executed from the KrishiSetu repository root:

| Command | Verified outcome |
|---|---|
| `npm run validate:foundation` | exits successfully, but contains a false-positive raw-colour check |
| `npm run codegen:check` | passes; generated tokens and message keys are current |
| `npm run typecheck` | passes under the root Bundler-resolution configuration |
| `npm test` | 50 tests pass; coverage is foundation-only and includes a no-op architecture test |
| `npm run build` | fails in API, worker, multiple packages, consent/users modules, and tools; only the Next.js web build succeeds |

### 2.1 What is genuinely strong

- The repository is a clean npm-workspace modular monolith with named bounded modules.
- Package exports prevent obvious deep imports.
- `@krishisetu/core` has useful primitives for `Result`, integer-paise `Money`, string identifiers, deterministic clocks/IDs, execution context, and in-process events.
- Product, module, locale, policy, error, and design-token registries exist.
- English is the checked-in default and `en`, `mr`, `hi`, and `kn` catalogs have matching key structure.
- Generated token CSS and typed message keys have a working drift check.
- The web presentation uses recognizable KrishiSetu brand components and a persistent prototype disclosure.
- No government emblem asset or executable live government URL was found.
- The current web package builds successfully with Next.js 16.3.2.

### 2.2 Critical findings

#### Finding A — Phase 1 exit gate fails

The implementation plan requires a clean root build before later phases. `npm run build` currently fails because Node-target packages use `NodeNext` while source imports omit required `.js` extensions, several barrel exports consequently fail to resolve, and package-level builds expose errors hidden by the root Bundler-resolution typecheck.

Therefore Phase 1 cannot be marked complete.

#### Finding B — architecture enforcement reports false passes

`tools/architecture-tests/src/boundary.test.ts` detects raw hexadecimal colours but never appends violations and ends with `assert.ok(true)`. The shell foundation validator also prints `PASS` whether raw-colour hits exist or not. The repository currently contains many raw colours in the design system and feature JSX.

The reported “0 foundation violations” is not reliable until these validators fail correctly.

#### Finding C — the frontend journey is a storyboard, not application integration

`apps/web/app/page.tsx` switches login, consent, dashboard, application, and privacy screens with local `useState`. It hardcodes synthetic personas and does not use locale-aware routes, a generated API client, sessions, server state, consent artefacts, or module queries.

`DashboardView.tsx` contains hardcoded farmer data, provider timings, land and crop values, bank status, scheme amounts, eligibility explanation, KCC amount, and simulated refresh timers. These are useful for a visual prototype but violate the intended separation between presentation and domain/application data.

Phase 11 presentation has started; Phases 7–10 have not been implemented.

#### Finding D — business modules are contract shells only

The 12 module packages mostly export interfaces from one `index.ts`. They do not yet contain domain/application/ports/adapters/delivery structure, module tests, migrations, repositories, mock-provider contract kits, or use cases.

The progress report should describe these as module placeholders, not implemented bounded contexts.

#### Finding E — localization is incomplete at the application boundary

- The app has only `/`, not `app/[locale]/...` routes.
- `<html lang>` is always `en`.
- The chosen locale is not encoded in or restored from the route.
- User preference and signed-cookie persistence are not implemented.
- The app imports Google Fonts over the network instead of using the required self-hosted Noto files.
- Several visible strings and locale-specific names remain hardcoded in JSX.

Catalog parity is real, but end-to-end internationalization is not complete.

#### Finding F — API safety and platform plugins are shells

The Fastify app exposes health/meta/demo-persona routes only. It currently allows `origin: true`, lacks the documented exact-origin policy, and has not implemented the standard security, session, CSRF, consent, idempotency, OpenAPI, error, no-store, and request-context plugins.

This is acceptable for an early shell but must not be described as the implemented gateway.

#### Finding G — phase-required tooling is absent

The expected `tools/database`, `tools/synthetic-data-generator`, `tools/smoke`, `docs/evidence`, formatter configuration, contract/integration/E2E suites, and database scripts are missing. The ESLint package contains an empty rule object rather than an active lint configuration.

#### Finding H — documentation version drift

The progress report says Next.js 15, while the installed package and accepted ADR use Next.js 16. The ADR names Node.js 24 LTS, the README allows Node.js 22, and the audit ran on Node.js 22.17.0. This needs one explicit decision and consistent engine/tooling configuration.

## 3. Corrected implementation status

| Approved phase | Honest status | Reason |
|---|---|---|
| Phase 0 — baseline and inventory | substantially complete | source hierarchy, decision log, README, and skill exist |
| Phase 1 — workspace and basic build | incomplete | root build fails; tooling/folders/scripts are missing |
| Phase 2 — registries and codegen | partial | key registries/token/message generation exist; OpenAPI/client/docs generation and real enforcement do not |
| Phase 3 — core/common platform | partial | useful core/config/observability primitives exist; API security/platform primitives do not |
| Phase 4 — i18n | partial | catalog parity/resolver/formatters exist; route, persistence, HTML language, fonts, and visual checks do not |
| Phase 5 — design system | partial | many primitives exist; token enforcement, Storybook, axe/keyboard/zoom/locale evidence are missing |
| Phase 6 — API/database composition | shell only | health/meta API exists; no database, migration runner, module composition, OpenAPI, or generated client |
| Phase 7 — identity/users/consent/audit | not implemented | interfaces and presentation screens only |
| Phase 8 — agricultural modules | not implemented | DTO-like interfaces only |
| Phase 9 — dashboard composition | not implemented | hardcoded React presentation only |
| Phase 10 — application saga | not implemented | hardcoded application presentation only |
| Phase 11 — frontend journey | visual prototype partial | useful screens exist but are not routed or integrated |
| Phases 12–14 | not started | required gates, deployment evidence, and evolution tests absent |

## 4. Mandatory foundation-repair gate

No new domain workflow should be merged until all items below pass.

### 4.1 Build and package consistency

- Select the already-approved ESM strategy and make Node-target imports/builds consistent.
- Make every workspace package build independently.
- Ensure root `typecheck` and package builds use compatible resolution assumptions.
- Align Node/Next versions across ADR, engines, README, and progress evidence without changing the accepted stack.
- Add missing explicit exports and remove misleading `main`/`types` declarations if they do not match emitted artifacts.

### 4.2 Real enforcement

- Fix raw-colour validators to collect hits and fail.
- Replace the empty ESLint configuration with active project rules.
- Add detection for hardcoded user-visible JSX text, direct provider/network clients, prohibited executable hosts, and direct feature data formulas.
- Keep intentional fixture/prototype strings in explicit allowlisted fixture paths, not as ignored global exceptions.

### 4.3 Frontend baseline

- Add locale-aware route shells derived from the locale registry.
- Set `<html lang>` and font family dynamically.
- Self-host the approved Noto font subsets; remove Google Fonts network requests.
- Move view-specific hardcoded records to typed synthetic view-model fixtures.
- Do not pretend local button transitions are backend authentication, consent, applications, or purge.

### 4.4 Documentation truth

- Update `IMPLEMENTATION-PROGRESS.md` only after rerunning the exact gates.
- Record skipped and missing tests explicitly.
- Never describe “50 tests passing” as complete validation when integration, contract, accessibility, and E2E gates do not exist.

## 5. Research synthesis

### 5.1 Government-notification patterns

The [UX4G notification pattern](https://www.ux4g.gov.in/patterns/notifications) recommends a unified in-app notification centre with unread state, date grouping, action-oriented messages, user preferences, and accessible announcements that do not steal focus. It distinguishes durable service notifications from transient toasts and says marketing broadcasts are outside the pattern.

The [GIGW 3.0 guideline inventory](https://guidelines.india.gov.in/guidelines/) requires circulars, notifications, documents, forms, schemes, and services to expose a complete title, language, purpose/application procedure, and validity where applicable. Time-sensitive content needs an expiry date and an archival mechanism. Important entry pages should show published, reviewed, or modified dates.

The [GIGW policy templates](https://guidelines.india.gov.in/policy-templates-for-stqc-certification/) also establish content review, moderation/approval audit, and archival expectations. KrishiSetu is not an official publisher, so the prototype will model this lifecycle with synthetic fixtures and mock provenance rather than claiming official authorization.

The [myScheme FAQ](https://transactions.myscheme.gov.in/faqs) reinforces that citizens need eligibility, benefits, application steps, and required-document information together. KrishiSetu public notices should therefore link an announcement to the relevant scheme/form facts rather than show a context-free headline.

### 5.2 Weather and agromet patterns

The [IMD Agromet Advisory Services](https://mausam.imd.gov.in/responsive/agromet_adv_ser_block_current_en.php) organize information as district/block forecasts, current and past bulletins, local-language bulletins, warnings, and special agromet advisories. The [GKMS operating procedure](https://mausam.imd.gov.in/imd_latest/contents/pdf/gkms_sop.pdf) describes district-level agro-advisories produced from weather and agricultural information.

Published IMD agromet bulletins commonly expose rainfall, minimum/maximum temperature, cloud cover, relative humidity, wind speed/direction, forecast validity, general advice, and crop/stage-specific advice. KrishiSetu should use that information architecture, but it must not copy current forecasts into fixtures or call IMD at runtime.

### 5.3 Model delegation boundary

[Google documents Gemini 3.7 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash) as a reasoning model with low, medium, and high thinking modes and coding/tool support. It is suitable for repository-wide mechanical fixes, typed scaffolding, presentational components, contract-shaped fixtures, and test generation. Risk boundaries below are governance decisions based on consequence and reviewability, not assertions that the model is technically incapable.

## 6. Notifications bounded context

### 6.1 Ownership decision

Retain `modules/notifications` and expand its responsibility to two related capabilities:

1. **Public notice publication/read model** — synthetic scheme announcements, application windows, form updates, corrigenda, deadlines, service notices, and archive state.
2. **Citizen notification projection** — a user-specific in-app inbox projection, read state, and preference-aware delivery after identity/users are implemented.

The notifications module does not own scheme eligibility, application state, user preferences, or translations. It stores stable references such as `schemeCode`, `applicationId`, and message keys, and calls other modules through public contracts when validation is required.

### 6.2 Notice categories

```text
SCHEME_ANNOUNCEMENT
APPLICATION_WINDOW_OPEN
APPLICATION_DEADLINE
FORM_PUBLISHED
FORM_REVISED
CORRIGENDUM
DOCUMENT_REQUIREMENT_CHANGED
APPLICATION_STATUS
ACTION_REQUIRED
SERVICE_AVAILABILITY
GENERAL_ADVISORY
```

Emergency weather warnings remain owned by `weather-advisory`; the notifications module may project a minimal linked notification from a published weather event.

### 6.3 Public notice contract

```ts
type PublicNotice = {
  noticeId: string;
  noticeType: NoticeType;
  status: 'DRAFT' | 'PUBLISHED' | 'WITHDRAWN' | 'EXPIRED' | 'ARCHIVED';
  priority: 'INFORMATION' | 'IMPORTANT' | 'ACTION_REQUIRED';
  titleKey: MessageKey;
  summaryKey: MessageKey;
  facts: Readonly<Record<string, string | number>>;
  schemeCode?: string;
  form?: {
    formCode: string;
    version: string;
    language: Locale;
    fileFormat: 'PDF' | 'HTML';
    fileSizeBytes?: number;
    downloadRoute?: string;
  };
  audience: {
    districtCodes?: readonly string[];
    cropCodes?: readonly string[];
    schemeCodes?: readonly string[];
    allFarmers: boolean;
  };
  publishedAt: string;
  effectiveFrom: string;
  expiresAt?: string;
  reviewedAt: string;
  source: {
    type: 'SYNTHETIC_MOCK';
    sourceLabelKey: MessageKey;
    mockReference: string;
  };
  action?: {
    labelKey: MessageKey;
    internalRoute: string;
  };
  supersedesNoticeId?: string;
  prototypeData: true;
};
```

Identifiers and routes must use shared owners. The schema above describes the data shape; the authoritative implementation belongs in module/contract schemas rather than this Markdown file.

### 6.4 Lifecycle

```text
DRAFT -> PUBLISHED -> EXPIRED -> ARCHIVED
                   -> WITHDRAWN -> ARCHIVED
PUBLISHED -> superseded by a new PUBLISHED corrigendum/revision
```

- The prototype has no citizen-facing admin publishing UI.
- Seeded notices enter as already reviewed synthetic fixtures.
- Queries derive active/expired state from the shared clock; UI code does not calculate it.
- Expired items leave the active feed and remain available in an archive view.
- A correction links to the previous notice and visibly states that it supersedes it.
- The module records content version and fixture manifest hash.

### 6.5 Future-owned persistence

```text
notification_public_notices
notification_notice_audiences
notification_user_notice_state
notification_delivery_attempts
```

No database implementation is required in the first delegated slice. When persistence is added, these tables and migrations remain private to `notifications`; no cross-module foreign key or SQL join is allowed.

### 6.6 Read APIs

First safe read-only slice:

```text
GET /api/v1/public-notices
GET /api/v1/public-notices/{noticeId}
GET /api/v1/public-notices/archive
```

Later, after session/users exist:

```text
GET  /api/v1/notifications/me
POST /api/v1/notifications/{notificationId}/read
POST /api/v1/notifications/read-all
```

Filters use allowlisted enums and cursor pagination. Public APIs return codes, message keys, facts, dates, and mock provenance. They never return raw HTML or executable government links.

### 6.7 Notification UI

- Add a labelled notification-centre trigger with text plus unread count; do not rely on a bell icon alone.
- Mobile opens a full-height dialog/sheet with focus trap, Escape/close behavior, and focus return.
- Group entries as `Action required`, `Today`, `Earlier`, and `Archived`; use semantic headings.
- Show title, one-sentence summary, scheme/form label, published/reviewed date, validity/deadline, mock source, and at most one primary action.
- Read/unread state uses visible text and weight, not colour alone.
- New items use `aria-live="polite"` and never steal focus.
- A deadline notice may be dismissed from the dashboard summary but remains in the notification centre/archive.
- Toasts are reserved for the result of a current action; public notices are durable content, not auto-disappearing toasts.
- In-app is the only prototype channel. SMS, email, WhatsApp, and push require explicit consent, infrastructure, security, and a later review.

## 7. Weather-advisory bounded context

### 7.1 Ownership decision

Add `modules/weather-advisory` as an optional bounded module. It owns district forecast snapshots, warnings, agromet advisory summaries, mock provider normalization, freshness, and read contracts. It does not own farmer location, crop records, notifications, or dashboard layout.

The dashboard obtains a synthetic district code from the farmer-profile public query and passes only that district code to weather-advisory. The weather module never receives Farmer ID, bank, land, or consent payloads.

### 7.2 Prototype source rule

- Runtime source is an in-process `MOCK_AGROMET` adapter only.
- Fixtures must be synthetic, deterministic, and visibly dated for the demo scenario.
- No IMD, government, Maps, geolocation, or third-party weather API is called.
- The UI must say `Synthetic district weather for demonstration — not an official forecast`.
- The browser must not request location permission.
- The module must not generate agronomic recommendations with an AI model.
- Advisory text is fixture-authored, deterministic, localized through reviewed message keys, and labelled mock.

### 7.3 Forecast summary contract

```ts
type DistrictWeatherSummary = {
  districtCode: string;
  districtNameKey: MessageKey;
  generatedAt: string;
  validFrom: string;
  validUntil: string;
  freshness: 'CURRENT' | 'STALE' | 'UNAVAILABLE';
  current: {
    conditionCode: WeatherConditionCode;
    temperatureCelsius: string;
    relativeHumidityPercent: string;
    windSpeedKph: string;
  };
  daily: readonly Array<{
    date: string;
    conditionCode: WeatherConditionCode;
    rainfallMm: string;
    minimumTemperatureCelsius: string;
    maximumTemperatureCelsius: string;
    relativeHumidityMinimumPercent: string;
    relativeHumidityMaximumPercent: string;
    windSpeedKph: string;
    windDirectionCode: string;
  }>;
  warning?: {
    level: 'WATCH' | 'ACTION';
    titleKey: MessageKey;
    summaryKey: MessageKey;
    validUntil: string;
  };
  advisories: readonly Array<{
    advisoryCode: string;
    cropCode?: string;
    cropStageCode?: string;
    titleKey: MessageKey;
    bodyKey: MessageKey;
  }>;
  source: 'MOCK_AGROMET';
  prototypeData: true;
};
```

Decimal measurements are strings to prevent inconsistent float formatting. Presentation uses the shared locale formatters and unit labels.

### 7.4 Safe read API

```text
GET /api/v1/weather/districts/{districtCode}/summary
```

The district code must come from a small synthetic allowlist. The response is public synthetic information and contains no farmer identifier. A future sanctioned provider adapter must implement the same port and pass the same contract kit after an ADR/security review.

### 7.5 Weather UI

The dashboard weather card shows:

- farmer district and `Mock district forecast` label;
- current condition, temperature, humidity, wind, and update/validity time;
- a five-day compact rainfall and min/max temperature visualization;
- one action-oriented mock agromet advisory;
- warning text when present;
- `View forecast details` disclosure with an accessible table.

The visual chart is supplementary. Every bar/point has text or an accessible table equivalent, and colour is never the only encoding. No animated weather artwork, auto-playing carousel, map-only display, or high-density scientific chart is permitted.

## 8. Modern government-service dashboard

“Modern” means task-oriented, responsive, clear, and trustworthy—not glossy gradients, dense analytics, or startup gamification.

### 8.1 Mobile content order

```text
1. Persistent prototype notice and compact header
2. Farmer greeting, district, masked ID, session/consent status
3. Action-required summary (deadlines, corrections, failed application step)
4. District weather and mock agromet advisory
5. Public scheme/form notices
6. Applications and next steps
7. Eligible mock scheme/credit offerings
8. Farm data overview (land, crops, bank readiness)
9. Source status and technical details disclosure
```

The order prioritizes what the farmer needs to do today over infrastructure timings.

### 8.2 Desktop layout

Use a 12-column content grid within the existing 1200px maximum:

```text
┌──────────────────────────────────────────────────────────┐
│ Greeting + Action required                               │
├───────────────────────────────────┬──────────────────────┤
│ Applications / next steps (8 col) │ Weather (4 col)      │
├───────────────────────────────────┼──────────────────────┤
│ Schemes and benefits (8 col)      │ Notifications (4 col)│
├───────────────────────────────────┴──────────────────────┤
│ Land • crops • bank readiness                            │
├──────────────────────────────────────────────────────────┤
│ Source status / technical details (collapsed)            │
└──────────────────────────────────────────────────────────┘
```

At mobile widths all regions become one column in the priority order above.

### 8.3 Useful visualizations

| Visualization | Purpose | Accessible representation |
|---|---|---|
| Application stepper | show submitted, review, action-needed, completed | ordered list with current-step text |
| Five-day rainfall bars | show likely wet/dry days quickly | labelled values plus forecast table |
| Temperature min/max range | show daily spread | explicit min/max text per day |
| Land/crop allocation bar | compare cultivable share and recorded crops | description list with hectares and percentages |
| Scheme deadline strip | show opening/closing sequence | sorted list with exact dates and days remaining |
| Readiness checklist | show land/crop/bank availability | three labelled status rows, not a misleading score |

Do not add pie/donut charts, unlabeled sparklines, auto-rotating banners, a universal “farmer score,” or eligibility gauges. Those shapes imply precision or ranking that the prototype cannot justify.

### 8.4 Dashboard component boundaries

```text
apps/web/src/features/dashboard/
  components/DashboardOverview.tsx
  components/ActionRequiredPanel.tsx
  components/ApplicationTimeline.tsx
  components/FarmDataOverview.tsx
  components/SourceStatusDisclosure.tsx
  mappers/dashboard-view-model.ts

apps/web/src/features/notifications/
  components/PublicNoticeCard.tsx
  components/PublicNoticeList.tsx
  components/NotificationCentre.tsx
  components/NotificationEmptyState.tsx

apps/web/src/features/weather-advisory/
  components/DistrictWeatherCard.tsx
  components/FiveDayForecast.tsx
  components/AgrometAdvisory.tsx
  components/WeatherUnavailableState.tsx
```

Shared primitives belong in `@krishisetu/design-system` only after reuse is demonstrated. Feature-specific layouts stay in their feature package.

## 9. Delegation strategy for Gemini 3.7 Flash High

### 9.1 Green work — delegate directly

- Normalize ESM imports/configuration and repair workspace builds.
- Repair validators that currently pass unconditionally.
- Turn documented lint rules into executable rules.
- Remove raw colours and move missing semantic values into token JSON/codegen.
- Self-host and wire Noto font files if approved font assets are already present; otherwise create the local font-loader structure and report the missing assets.
- Add locale route shells, dynamic `lang`, font mapping, and route-derived language selection.
- Move hardcoded UI records into typed synthetic fixtures/view models.
- Create notification/weather message namespaces with parity tests.
- Create typed module interfaces, mock fixture catalogs, in-memory read adapters, and unit tests.
- Create stateless notification/weather/dashboard components and accessibility-focused tests.
- Create loading, empty, stale, unavailable, partial, and error presentations.
- Update progress evidence honestly after commands pass.

### 9.2 Amber work — delegate with explicit contracts and review

- Add `weather-advisory` to the module registry and package graph.
- Expand the notifications public API and notice lifecycle types.
- Add read-only Fastify routes after schemas and error mappings exist.
- Create a generated client/read mapper after the contract generation path is approved.
- Draft Marathi, Hindi, and Kannada UI copy; mark it for native-language review.
- Implement deterministic audience filtering by exact district/crop/scheme codes.

Each amber change needs senior review of ownership, contract shape, source provenance, accessibility, and data minimization before it becomes a baseline.

### 9.3 Red work — do not delegate as autonomous completion

- Identity, session, OTP, authentication, authorization, CSRF, or cryptography.
- Consent grant/revoke/expiry, signatures, DPDPA policy, purge, or retention decisions.
- Subsidy eligibility, KCC calculations, credit/financial decisions, or NPCI mappings.
- Application saga, idempotency, retries, outbox, concurrency, or multi-module transactions.
- Admin publishing/moderation/approval workflow for official notices.
- Emergency alert classification or safety-critical agronomic recommendations.
- Live IMD, government, bank, Aadhaar, UFSI, ULI, SMS, email, WhatsApp, push, Maps, or analytics integrations.
- Destructive migrations, production deployment, secrets, or new trust boundaries.
- Architecture/framework/database changes without an ADR.

Gemini may scaffold ports/test doubles around red work but must not invent behavior.

## 10. Recommended delegated work packets

### Packet A — repair the foundation

Exit gate:

```text
npm run validate:foundation
npm run codegen:check
npm run lint
npm run typecheck
npm test
npm run build
```

All must pass for real. No validator may contain an unconditional pass.

### Packet B — public-notice presentation slice

- Expand notification contracts and mock fixtures.
- Add four-locale message namespace and parity tests.
- Build public notice list/card/archive/empty states from typed props.
- Do not build publishing admin, personal delivery, or external channels.

### Packet C — district weather presentation slice

- Add optional weather-advisory module shell and mock-only contracts/fixtures.
- Build district card, five-day visualization, table alternative, stale/unavailable states, and mock disclosure.
- Do not call a weather API or generate advice from measurements.

### Packet D — dashboard refactor

- Replace the monolithic hardcoded dashboard component with feature public exports and typed view models.
- Apply mobile priority order and desktop 8/4 grid.
- Put provider timings behind technical details.
- Preserve existing land/scheme/credit storyboard data only as explicit synthetic fixtures.

### Packet E — evidence

- Add meaningful validator tests, component rendering tests, locale parity, keyboard semantics where tooling permits, and 320px/200% zoom checklist documentation.
- Record missing axe/E2E/browser tooling as missing; do not claim it ran.

## 11. Review gates before the next handoff

After Gemini completes Packets A–E, a senior reviewer should verify:

1. all root/package builds pass from a clean checkout;
2. validators fail on deliberately introduced test violations;
3. no external font/weather/government request exists;
4. every notice and forecast is visibly synthetic;
5. no domain calculation moved into React or fixtures;
6. notification/weather module APIs remain read-only and module-owned;
7. dashboard content order works at 320px and 200% zoom;
8. all four locales render without missing keys or obvious clipping;
9. progress documentation matches executed evidence;
10. no work from the red delegation list was implemented.

Only then should the project proceed to senior-owned API/database/identity/consent/domain workflows.

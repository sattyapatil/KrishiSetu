# Gemini 3.7 Flash High — KrishiSetu Handoff 03

Copy the prompt below into a coding-agent session configured for Gemini 3.7 Flash with thinking level **High**.

```text
You are a bounded implementation engineer working inside the KrishiSetu repository.

MODEL
Gemini 3.7 Flash, thinking level HIGH.

WORKSPACE
/Users/satishpophale/satish/work/IT/Hackathon/KrishiSetu

OBJECTIVE
Repair the missing route architecture, modernize the web UI without making it flashy, and implement a complete responsive mock-only farmer application presentation journey in which every visible link and CTA has a meaningful, tested result.

This is not permission to implement production identity, privacy, financial, government-integration, or application-orchestration logic. All data and responses remain explicit synthetic fixtures.

NON-NEGOTIABLE DISTINCTION
“No dummy UI” means:
- no dead links;
- no no-op buttons;
- no console-only actions;
- no toast-only substitute for a required page;
- no CTA that claims success without a typed mock result;
- no link to a route that does not exist.

It does NOT mean using real government data or APIs. Mock data is mandatory. Every mock result must be deterministic, typed, visibly disclosed, and injected through an adapter rather than invented inside JSX.

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
12. docs/implementation/KRISHISETU-SECOND-ROUND-UX-ROUTE-AND-FLOW-AUDIT.md
13. docs/implementation/IMPLEMENTATION-PROGRESS.md
14. docs/architecture/decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md

SOURCE PRECEDENCE
Security/privacy rules win over convenience. Modular architecture owns boundaries. API documents own observable contracts. Design-system documents own UI and accessibility. The round-three audit owns this implementation scope but does not override those sources.

FIRST ACTION — VERIFY, DO NOT ASSUME

1. Run `git status --short`; preserve unrelated/user changes.
2. Inspect the current Next.js route tree, AppShell, locale page, LoginView, ConsentView, DashboardView, ApplicationsView, PrivacyView, notifications, weather, tokens, messages, and tests.
3. Run and record the baseline:
   - npm run validate:foundation
   - npm run codegen:check
   - npm run lint
   - npm run typecheck
   - npm test
   - npm run build
4. Confirm the production build currently exposes only `/`, `/_not-found`, and `/{locale}`.
5. Confirm `/en/dashboard`, `/en/applications`, and `/en/privacy` are missing routes.
6. Confirm language selection changes component state without changing the URL.
7. Confirm the apply CTA skips review/declaration and immediately renders a completed bundle.
8. Produce a concise file-by-file plan, then implement Packets A–F in order. Stop if a non-negotiable or architecture ownership conflict appears.

PACKET A — EXPLICIT ROUTE ARCHITECTURE

Create real, route-specific App Router pages for every supported locale:

- /[locale]                           start/login
- /[locale]/consent                   dashboard-purpose consent
- /[locale]/dashboard                 dashboard
- /[locale]/schemes                   scheme list
- /[locale]/schemes/[schemeCode]      scheme details
- /[locale]/applications              applications list
- /[locale]/applications/new/review   review selected services and data
- /[locale]/applications/new/declare  application-purpose consent/declaration
- /[locale]/applications/new/submitting accessible mock processing state
- /[locale]/applications/[bundleId]   confirmation/bundle status
- /[locale]/applications/[bundleId]/[childId] child detail/retry
- /[locale]/notifications             notification centre page
- /[locale]/notices/[noticeId]        notice detail
- /[locale]/weather                   weather/advisory detail
- /[locale]/privacy                   privacy overview
- /[locale]/privacy/consent           synthetic consent details
- /[locale]/privacy/withdrawal/[receiptId] honest simulation receipt

Implementation rules:

- derive locales from the locale registry; do not repeat an array in route code;
- redirect `/` to the configured English default;
- do not use a catch-all route that renders one generic page;
- use Next Link for navigation and buttons for actions;
- use `aria-current="page"` for active navigation;
- make the wordmark target the start page when signed out and dashboard when the prototype session is active;
- hide authenticated nav on login/consent screens;
- direct access to a protected route without prototype session state shows a localized Access Required page with a working “Start demo” link, not 404;
- unknown fixture IDs get a localized not-found state within the known route;
- language switching replaces only the locale segment and preserves route, IDs, query, and hash;
- route refresh must be safe and never expose or persist PINs, tokens, full identifiers, consent evidence, or financial details.

PACKET B — PROTOTYPE JOURNEY ADAPTER

Create an app-composition interface and deterministic in-memory implementation such as `PrototypeJourneyAdapter`.

Allowed methods:

- startSession
- grantDashboardConsent
- submitBundle
- retryChild
- simulateWithdrawal

Rules:

- adapter lives outside React components and feature JSX;
- use shared Clock and deterministic ID helpers;
- return typed Result-like outcomes and explicit scenarios: COMPLETED, PARTIAL_RETRYABLE, UNAVAILABLE;
- mark every record `prototypeData: true` and source `SYNTHETIC_MOCK`;
- components may own ephemeral UI state only: disclosure open/closed, local selection, focus, current tab;
- do not calculate eligibility, benefit, credit, interest, joint ownership, or financial terms;
- do not call HTTP, databases, browser geolocation, or external services;
- do not represent this adapter as a production domain service;
- avoid a new state-management dependency. Prefer a narrow provider/reducer at app composition only if needed.

PACKET C — COMPLETE APPLICATION PRESENTATION JOURNEY

Implement:

1. Scheme list and scheme details.
   - no scheme or credit offering preselected;
   - each item has a working details link and include/remove control;
   - show synthetic provenance and plain-language eligibility disclaimer.

2. Review page.
   - show selected offerings, farmer summary, land/crop/bank prefill, and prototype source labels;
   - provide accessible Change links per section;
   - preserve selections when returning;
   - do not submit from this page.

3. Declaration page.
   - request only additional application-purpose scopes;
   - optional consent scopes and declaration checkbox start unchecked;
   - the final CTA says exactly what it does, including selected count;
   - block submit until requirements are affirmatively completed.

4. Submitting and outcomes.
   - call the adapter once and prevent duplicate submit;
   - use `role="status"` for progress and completion;
   - support completed, partial retryable, and unavailable states;
   - do not use timers directly inside JSX.

5. Confirmation, list, bundle, and child detail.
   - show a strong “Prototype only—nothing sent to a department or bank” statement;
   - show deterministic IDs/timestamps from adapter results;
   - provide working links to bundle, each child result, applications index, and dashboard;
   - expose retry only for the retryable child;
   - retry only that child and preserve successful child state;
   - include an application empty state and status filters with meaningful behaviour.

PACKET D — CONSENT, PRIVACY, AND PREFERENCES REPAIR

- do not preselect optional consent scopes;
- explain each purpose and consequence in plain language;
- separate dashboard-purpose consent from broader application-purpose consent;
- provide working consent details and privacy links;
- make withdrawal as easy to find as grant;
- confirmation dialog must trap focus, close with Escape, and restore focus;
- replace fabricated purge counts and deletion claims;
- receipt wording must say: “Prototype withdrawal simulated. No real personal data was stored or deleted.” Translate via message catalogs;
- it may describe what a production purge would target, clearly as future behaviour;
- high-contrast and reduced-motion controls must apply an actual root class/data attribute and visibly change behaviour;
- only those two preference booleans may be persisted; do not persist identity or consent data.

Do not write legal policy, real consent evidence, retention logic, audit events, erasure logic, database code, or production session code.

PACKET E — MODERN, RESPONSIVE, ACCESSIBLE UI

Modern means clear, compact, task-oriented, and calm—not fancy.

- retain the approved civic blue, agri green, typography, spacing, and token system;
- keep the persistent prototype disclosure as a compact phase banner;
- compact the header and do not use the State Emblem;
- replace emoji navigation/bell symbols with simple repo-native inline SVG icons;
- do not add gradients, glassmorphism, animations, illustrations, charts for decoration, oversized headings, or a new UI library;
- use a compact authenticated nav: horizontal/left rail on desktop and a tested menu or four-item bottom nav on mobile, not both;
- reorder the dashboard: attention items, continue/start application, readiness summary, weather, notices, collapsed technical evidence;
- move provider latency into collapsed technical details;
- reduce equal-weight borders and use whitespace/dividers/soft surfaces for hierarchy;
- split the large DashboardView into bounded presentation sections;
- move styles to maintainable classes/CSS modules using existing tokens;
- keep one main CTA per card;
- repair the mobile sticky application bar so it never covers content; reserve matching bottom padding;
- remove grid minimums that overflow at 320px;
- body remains at least 16px, legal text at least 12px, line-height at least 1.5, touch targets at least 44x44;
- ensure long mr/hi/kn labels wrap without collision;
- weather cards retain accessible table representation;
- every page has one h1 and sequential headings.

PACKET F — CTA, ROUTE, LOCALE, RESPONSIVE, AND ACCESSIBILITY TESTS

Create a machine-readable interaction inventory or test table covering every rendered:

- anchor;
- button;
- checkbox/radio;
- select;
- details disclosure;
- dialog action;
- actual dynamic tab.

Every control must cause one documented result: navigation, state change, disclosure, validation, dialog, download, or adapter action. Delete decorative/inert controls or make them real. Console logging and no-op callbacks do not count.

Add tests proving:

- all declared routes render for en, mr, hi, and kn;
- every internal href resolves;
- signed-out protected pages show Access Required rather than 404;
- language switching preserves the logical page;
- login invalid/valid paths work;
- optional consent begins unchecked and the grant path is affirmative;
- full select -> review -> change -> declaration -> submit -> confirmation -> child detail -> applications journey works;
- partial retry updates only the failed child;
- notice and weather actions reach their destination;
- privacy withdrawal returns only an honest simulated receipt;
- preference toggles produce a visible effect;
- dialogs close on Escape and restore focus;
- active nav uses aria-current;
- progress changes are announced;
- keyboard-only journey works;
- 320x568, 360x800, 390x844, 768x1024, 1024x768, and 1440x900 have no horizontal overflow or content hidden by fixed/sticky controls;
- 200% zoom remains usable.

Use existing test tooling if adequate. Do not add a large dependency without explaining why and obtaining approval if repository rules require it. If full browser automation is unavailable, add the strongest route/component tests possible and explicitly report missing manual/E2E evidence; never claim it was run.

I18N RULES

- English remains canonical/default/fallback.
- Supported locales are exactly en, mr, hi, kn from the registry.
- no user-visible literals in feature/page JSX;
- add message keys in all four catalogs with exact interpolation parity;
- use shared formatters for dates, numbers, currency, hectares, temperature, rain, and wind;
- draft translations are allowed for operational prototype copy, but report native-language review as pending;
- do not independently rewrite legal, consent, or financial meaning.

STRICTLY FORBIDDEN

- live or sandbox government/bank/Aadhaar/IMD APIs;
- real Aadhaar, Farmer IDs, bank details, land records, weather, notices, or PII;
- official State Emblem or language implying KrishiSetu is a government service;
- external fonts, CDN scripts, maps, geolocation, analytics, or tracking;
- hardcoded provider URLs or fetch calls;
- real auth/session/cookie/CSRF design;
- real consent/purge/retention/audit implementation;
- real eligibility, subsidy, KCC, lending, interest, or ownership calculations;
- real application saga, compensation, idempotency, or persistence;
- database migrations for high-consequence modules;
- changing the accepted TypeScript modular-monolith stack or public module ownership;
- business logic in React components, route handlers, repositories, or fixtures;
- deep imports into package/module internals;
- direct `process.env` outside config;
- raw brand colors outside token sources/generated output;
- weakening tests, validators, TypeScript, accessibility, or safety checks to obtain green output;
- catch-all pages, fake success, silent failures, no-op CTAs, or links to `#`.

STOP CONDITIONS

Stop and report instead of guessing if work requires:

- a new architecture or module-ownership decision;
- a legal/consent/financial interpretation;
- a live/external provider;
- real user or government data;
- auth/security/retention/purge rules;
- a database or production application state machine;
- deletion of user work;
- weakening a gate;
- a major dependency or stack change.

VALIDATION AND HANDOFF

After each packet run the narrow relevant tests. At the end run:

- npm run validate:foundation
- npm run codegen:check
- npm run lint
- npm run typecheck
- npm test
- npm run build
- git diff --check

Then manually inspect the complete English journey at desktop and 360px mobile and spot-check the same route in mr, hi, and kn. Do not claim assistive-technology, native-language, device, or 200%-zoom testing unless actually performed.

Final report must contain:

1. concise outcome;
2. changed files grouped by packet;
3. final production route table;
4. every command and exact pass/fail count;
5. interaction/CTA audit result and any known dead control (target: zero);
6. viewport/keyboard checks actually performed;
7. explicit list of mock/simulated behaviour;
8. explicit list of deferred senior-owned behaviour;
9. risks, skipped checks, and native-language review status;
10. git status summary.

Do not mark a packet complete if its route, action, error state, accessibility behaviour, or test evidence is missing.
```


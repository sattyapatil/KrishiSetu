# KrishiSetu Architecture Pack

KrishiSetu is the canonical citizen-facing product name. Older documents retain the Krishi-Ekatra working name only where they preserve earlier research or decisions.

## Documents

1. [Definitive modular foundation architecture](./KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md) — bounded modules, core/common packages, dependency rules, SSOT ownership, dynamic localization, data ownership, events, and extraction-ready evolution.
2. [Final phase-based implementation plan](../implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md) — folder/bootstrap, common platform, modules, UI, quality, deployment, and a source-document matrix.
3. [API contract and DPI data flows](./API-CONTRACT-AND-DATA-FLOWS.md) — public and mock routes, request/response JSON, fan-out/fan-in behavior, bundled applications, consent, errors, and purge semantics.
4. [Security, privacy, and mock-data boundary](./SECURITY-PRIVACY-AND-THREAT-MODEL.md) — non-negotiable safety controls, threat model, data lifecycle, and no-live-government-API enforcement.
5. [KrishiSetu design system](../design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md) — brand, tokens, components, header, languages, and accessibility.
6. [ADR-001: TypeScript modular monolith](./decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md) — stack decision and rejected alternatives.
7. [Earlier full-stack blueprint](./KRISHI-EKATRA-FULL-STACK-ARCHITECTURE.md) — retained for stack/deployment context; structural/localization guidance is superseded.
8. [Historical date-oriented hackathon plan](./HACKATHON-EXECUTION-PLAN.md) — retained for demo script, release gates, and contingency guidance.

## Authority and scope

- These documents synthesize the repository's Phase 1 UI/UX blueprint and Phase 2 DPI/mock API specification.
- The official builder brief was checked on August 22, 2026. It requires a working end-to-end citizen journey, meaningful use of Codex or an OpenAI model, synthetic data for sensitive/government dependencies, and honest disclosure of mocks. It explicitly forbids touching live government systems or using real sensitive identifiers.
- The official submission deadline shown on the brief is **August 28, 2026 at 8:00 PM IST**. The project keeps **August 27** as the code/content freeze so August 28 remains a deployment and submission buffer.
- This is an architecture pack, not evidence that the implementation already exists. Delivery status must be tracked in the execution plan and repository issues.

## Definitive decisions at a glance

| Area | Decision |
|---|---|
| Architecture | TypeScript modular monolith split into deployable `web` and `api` apps |
| Module boundaries | Identity, users, consent, farmer profile, land, crops, schemes, credit, applications, notifications, audit, and dashboard composition |
| Single source of truth | One authoritative owner per concern; generated contracts, clients, tokens, locale keys, and documentation |
| Localization | English configurable default; English, Marathi, Hindi, and Kannada from one locale registry |
| Frontend | Next.js 16.3 App Router, React 19.2, TypeScript, Tailwind CSS 4 |
| API gateway | Node.js 24 LTS, Fastify 5, JSON Schema/OpenAPI, `jose` |
| Data | SQLite 3 via `better-sqlite3`; SQL migrations and deterministic JSON fixtures |
| Mock integrations | In-process domain adapters with separately exposed `/mock/*` routes |
| Runtime AI | None on the critical citizen path |
| OpenAI/Codex | Build-time fixture/schema/scenario generation and test generation; synthetic inputs only |
| Deployment | Vercel for `web`; one Render web service for `api`; seeded ephemeral SQLite |
| Main demo | Farmer ID login → consent → unified data → select subsidy + KCC → one bundled submit → status receipts → revoke consent |
| Safety | No Aadhaar field, no real OTP/payment, no government logos, no live government network calls |

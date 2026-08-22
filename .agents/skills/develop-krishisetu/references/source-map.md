# KrishiSetu Source Map

## Required authority order

1. `docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md` — module boundaries, folders, dependencies, SSOT, localization, data ownership, events, evolution.
2. `docs/architecture/SECURITY-PRIVACY-AND-THREAT-MODEL.md` — safety, privacy, mock-only boundary, consent enforcement, retention, threat controls.
3. `docs/architecture/API-CONTRACT-AND-DATA-FLOWS.md` — HTTP behavior, JSON flows, error/status contracts, dashboard fan-out, bundle saga, purge; apply its localization amendment.
4. `docs/design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md` — brand, UX4G/GIGW-aligned visual/accessibility behavior, languages/fonts, component anatomy.
5. `docs/implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md` — dependency-ordered phases, deliverables, source routing, exit gates.
6. `docs/architecture/decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md` — accepted stack/topology and alternatives.
7. `DPI Backend Architecture & Mock API Specification.md` — backend/DPI research input only.
8. `Civic Tech UI/UX Design Orchestration & Master Blueprint.md` — user-friction/UI research input only.
9. `docs/architecture/KRISHI-EKATRA-FULL-STACK-ARCHITECTURE.md` — older stack/deployment context only; structure/localization is superseded.
10. `docs/architecture/HACKATHON-EXECUTION-PLAN.md` — historical dates, demo script, release gates, contingencies only; phase/default-language guidance is superseded.

Security/privacy wins over convenience. The modular foundation wins for structure/SSOT/locales. API contract wins for observable behavior. The design system wins for visuals/accessibility. Research explains intent but cannot override current architecture.

## Read by task

| Task | Read completely before editing |
|---|---|
| Workspace, module, architecture, shared package | modular foundation; relevant implementation phase; ADR |
| API, route, DTO, error, dashboard, application | modular foundation; API contract; security/privacy; relevant implementation phase |
| Identity, user, consent, purge, audit | modular foundation; security/privacy; API contract sections 3 and 6; implementation Phase 7 |
| Land, crop, scheme, credit, provider mock, database | modular foundation; API contract provider/dashboard sections; backend research relevant schema/rules; implementation Phase 8 |
| Frontend, component, brand, accessibility | modular foundation frontend/i18n sections; design-system document; UI research relevant section; implementation Phases 4, 5, or 11 |
| Locale/copy/font | modular foundation section 9; design typography/content sections; implementation Phase 4 |
| Deployment, external dependency, service extraction | modular foundation evolution sections; security/privacy; ADR; implementation Phases 13–14 |

Use `rg -n` with section names to navigate long research files, but read each selected authoritative document completely on the first substantial task in that area.

Resolve all paths from the workspace root. Quote the two research paths because their filenames contain spaces:

```bash
test -f "DPI Backend Architecture & Mock API Specification.md"
test -f "Civic Tech UI/UX Design Orchestration & Master Blueprint.md"
```

Do not report a source as missing until an exact quoted existence check fails.

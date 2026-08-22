# KrishiSetu Source Register

This register records the status, authority order, and ownership of documentation and code assets in the KrishiSetu repository.

## 1. Authority Order

1. `docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md` — Definitive structural, modular, SSOT, and localization architecture.
2. `docs/architecture/SECURITY-PRIVACY-AND-THREAT-MODEL.md` — Safety, privacy, mock-only boundary, consent enforcement, threat controls.
3. `docs/architecture/API-CONTRACT-AND-DATA-FLOWS.md` — Public HTTP behavior, JSON contracts, dashboard fan-out, bundle saga, and purge protocol (with localization amendment).
4. `docs/design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md` — Brand identity, UX4G/GIGW-aligned design system, typography, accessibility checklist.
5. `docs/implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md` — Dependency-ordered implementation phases and exit criteria.
6. `docs/architecture/decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md` — Stack and topology decision record.
7. `DPI Backend Architecture & Mock API Specification.md` — Supporting research input for backend schemas.
8. `Civic Tech UI/UX Design Orchestration & Master Blueprint.md` — Supporting research input for UI/UX friction.
9. `docs/architecture/KRISHI-EKATRA-FULL-STACK-ARCHITECTURE.md` — Historical architecture baseline (superseded in structure/locales).
10. `docs/architecture/HACKATHON-EXECUTION-PLAN.md` — Historical execution plan.

## 2. File Classifications

| Path | Status | Ownership / Purpose |
|---|---|---|
| `docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md` | Authoritative | Core structural architecture |
| `docs/architecture/SECURITY-PRIVACY-AND-THREAT-MODEL.md` | Authoritative | Security, privacy, threat model |
| `docs/architecture/API-CONTRACT-AND-DATA-FLOWS.md` | Authoritative | API endpoints and data flows |
| `docs/design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md` | Authoritative | Brand and UI design guidelines |
| `docs/design-system/krishisetu.tokens.css` | Reference | Initial token seed for JSON generation |
| `docs/implementation/KRISHISETU-FINAL-IMPLEMENTATION-PLAN.md` | Authoritative | Master implementation phase plan |
| `docs/architecture/decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md` | Authoritative | Architecture decision record |
| `packages/config/src/product.config.ts` | Authoritative SSOT | Product identity and metadata |
| `packages/config/src/module-registry.ts` | Authoritative SSOT | Module availability and capabilities |
| `packages/config/src/env.schema.ts` | Authoritative SSOT | Validated runtime environment schema |
| `packages/i18n/src/locale-registry.ts` | Authoritative SSOT | Supported locales (`en`, `mr`, `hi`, `kn`) and default (`en`) |
| `packages/i18n/messages/en/*.json` | Authoritative SSOT | Canonical message keyset and English copy |
| `packages/i18n/messages/{mr,hi,kn}/*.json` | Authoritative SSOT | Marathi, Hindi, and Kannada translations |
| `packages/policy/src/consent-catalog.ts` | Authoritative SSOT | Consent purpose and scope definitions |
| `packages/policy/src/permission-catalog.ts` | Authoritative SSOT | System permissions |
| `packages/contracts/src/errors/error-catalog.ts` | Authoritative SSOT | Error codes, message keys, and HTTP status mappings |
| `packages/design-tokens/tokens/*.json` | Authoritative SSOT | Canonical design tokens (colors, typography, spacing, etc.) |
| `packages/design-tokens/generated/*` | Generated | Generated CSS variables and Tailwind tokens (DO NOT EDIT) |
| `packages/i18n/src/generated/*` | Generated | Generated message-key TypeScript types (DO NOT EDIT) |

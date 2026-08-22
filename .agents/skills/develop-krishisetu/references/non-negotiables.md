# KrishiSetu Non-Negotiables

## Architecture

- Use the modular monolith and public module APIs.
- Give each behavior/data fact one owner.
- Enforce delivery → application → domain and adapter → port dependency direction.
- Keep module tables, migrations, repositories, fixtures, and provider adapters private to the owner.
- Compose across modules through commands, queries, ports, or versioned events.
- Keep `packages/core` business-agnostic and small.
- Add architecture tests for every new boundary.

## Single source of truth

- Product metadata: `packages/config/src/product.config.ts`.
- Module availability/navigation capability: `packages/config/src/module-registry.ts`.
- Environment: validated config package only; no direct `process.env` elsewhere.
- Locales/default: `packages/i18n/src/locale-registry.ts`.
- Messages: `packages/i18n/messages/<locale>`; English defines canonical keyset.
- Consent/permissions/classification: `packages/policy` catalogs.
- API/errors/events: contracts/owning module schemas.
- Design values: token JSON; CSS/Tailwind are generated.
- Rules/rates/status mappings: versioned catalog in the owning business module.
- Persistence: module-owned migrations.

Generated derivatives are never edited manually. CI must detect drift/duplicates.

## Localization

- Configurable default: English (`en`). Supported: `en`, `mr`, `hi`, `kn`.
- Resolution: explicit URL → authenticated preference → signed cookie → Accept-Language → configured default → English safety fallback.
- Modules/APIs emit codes, message keys, and structured facts.
- English/Marathi/Hindi/Kannada have identical keys and interpolation variables.
- Fonts: Noto Sans; Noto Sans Devanagari; Noto Sans Kannada.
- Test script rendering, 320px reflow, 200% zoom, dates/numbers/currency, and persistence.

## Security and privacy

- Synthetic data only; accept allowlisted demo IDs.
- No live government/bank/Aadhaar/NPCI/UFSI/ULI calls, scraping, or private APIs.
- No real PII, credentials, documents, payments, OTPs, or uploads.
- Verify session/owner/consent status/purpose/scopes before adapters.
- Invalid consent must produce zero provider calls.
- Keep private responses `no-store`; clear client private state on revoke/logout.
- Log identifiers/payloads only through centralized safe redaction; default to counts/codes/timings.
- Retain/purge data only by the documented classification policy.
- Prototype has no State Emblem, official logo, or approval claim.

## Domain correctness

- Store Farmer ID, ULPIN, account references, and similar identifiers as strings.
- Represent money as integer paise/value objects; no floating-point financial arithmetic.
- Version eligibility/rate/rule catalogs and return structured explanation facts.
- Deterministic code decides mock eligibility/credit. Models may generate synthetic build-time inputs/tests only.
- Use ownership share allocation, not whole-parcel area, for joint-owner calculations.
- Revalidate applications server-side; never trust UI-calculated amounts/outcomes.
- Use idempotency and a parent/child saga; never fake a distributed transaction.

## UI/accessibility

- Use generated design tokens and shared components; no raw brand hex/spacing.
- Base body 16px/1.5; legal/motto minimum 12px/1.5.
- All targets ≥44×44px; primary mobile actions normally 48px high.
- One localized H1 per route; sequential headings; visible labels/errors/focus.
- Never communicate state by colour/icon alone.
- Support keyboard, screen reader, 320px, 200% zoom, forced colours, reduced motion.
- Show persistent non-official/mock disclosure and label every mock result honestly.

## Change discipline

- Preserve user changes and unrelated files.
- Use migrations; never rewrite applied migration history.
- Make destructive/reset scripts validate explicit prototype targets and require prototype mode.
- Add an ADR for framework/topology/database/trust-boundary/core-rule changes.
- Do not claim completion, compliance, production readiness, or tests that were not verified.


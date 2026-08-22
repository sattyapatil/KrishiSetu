---
name: develop-krishisetu
description: Implement, extend, refactor, review, or validate KrishiSetu code and infrastructure under apps, modules, packages, tools, or deployment. Use for new modules, APIs, database migrations, frontend features, localization, design-system work, tests, bug fixes, deployment, architecture changes, and implementation handoffs. Enforces the modular-monolith boundaries, one authoritative source per concern, English as the configurable default with English/Marathi/Hindi/Kannada support, mock-only DPI integrations, consent/privacy rules, accessibility, phase gates, and required validation.
---

# Develop KrishiSetu

Implement KrishiSetu without weakening its module boundaries, authoritative registries, privacy model, multilingual behavior, or non-official prototype status.

## Start every task

1. Locate the workspace root as the nearest ancestor containing `docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md`.
2. Verify source paths from that root using `rg --files` or quoted `test -f` calls. The two root research filenames contain spaces; never declare a routed source missing from an unquoted or relative-to-the-wrong-directory check.
3. Read [references/source-map.md](references/source-map.md) and [references/non-negotiables.md](references/non-negotiables.md) completely.
4. Read the authoritative repository documents routed by `source-map.md`. On first implementation work in a fresh context, read the modular foundation architecture completely.
5. Map the request to one implementation phase and one owning module/package. If no owner exists, propose the boundary before creating files.
6. Inspect existing code, package exports, generated sources, migrations, tests, and uncommitted user changes. Preserve unrelated work.
7. State the selected phase/module and any source conflict before editing. Resolve conflicts using the documented authority order, never by a local exception.

Do not start feature code before Phases 0–2 of the implementation plan exist or the user explicitly asks to scaffold those phases.

## Choose the change path

| Change | Owner/path | Required reference |
|---|---|---|
| Universal primitive | `packages/core` | [module-playbook.md](references/module-playbook.md) |
| Runtime/product/module config | `packages/config` | modular architecture SSOT/config sections |
| Locale, message, formatter | `packages/i18n` | i18n section + design typography |
| Consent, permission, retention category | `packages/policy` | security/privacy + API consent contract |
| API schema/error/event | `packages/contracts` or owning module contract | API contract + module playbook |
| Design value | `packages/design-tokens/tokens` | brand design system |
| Reusable UI primitive | `packages/design-system` | brand design system + accessibility checklist |
| Business behavior/data | `modules/<bounded-context>` | owning phase + backend/UX research as routed |
| Feature presentation | `apps/web/src/features/<feature>` | design system + generated API contract |
| HTTP composition | `apps/api` | API composition rules; keep business logic in modules |
| Async composition | `apps/worker` | event/outbox architecture; keep business logic in modules |
| Generation/validation tooling | `tools` | SSOT/codegen/validation rules |

Read [references/module-playbook.md](references/module-playbook.md) before adding a module, route, table, provider adapter, message, design token, event, or shared utility.

## Mandatory implementation flow

### 1. Establish ownership and contract

- Identify the owning module and authoritative source for every new fact.
- Reuse an existing public contract when possible.
- Add or change the authoritative catalog/schema first; regenerate derivatives instead of editing them.
- Reject cross-module repository/table access. Define a public query/command/port/event instead.
- Create an ADR before changing the chosen framework, topology, database direction, trust boundary, or core dependency rule.

### 2. Implement inward to outward

Use this order where applicable:

1. domain value objects, invariants, and unit tests;
2. application command/query and port contracts;
3. repository/provider/event adapters and integration tests;
4. HTTP/job delivery adapter and contract tests;
5. generated client refresh;
6. localized frontend mapper/components/routes;
7. end-to-end and accessibility tests.

Keep domain/application code independent of Fastify, React, SQL, environment variables, provider SDKs, and OpenAI.

### 3. Preserve multilingual behavior

- Import the locale registry; never create a local locale list or fallback.
- Keep English (`en`) as the checked-in configurable default. Support `en`, `mr`, `hi`, and `kn` with identical message keys and interpolation variables.
- Use message keys and structured facts in modules/APIs. Do not hardcode citizen-facing sentences in JSX, handlers, rules, or status maps.
- Use Noto Sans for English, Noto Sans Devanagari for Marathi/Hindi/Sanskrit, and Noto Sans Kannada for Kannada.
- Run locale completeness and 320px overflow checks for any user-facing change.

### 4. Preserve security, consent, and mock boundaries

- Accept only synthetic allowlisted identifiers and fixtures.
- Make every provider a mock adapter unless the user supplies new explicit authority and the architecture/security documents are formally revised first.
- Declare consent scopes/permissions from the policy catalog and enforce them before module/provider invocation.
- Minimize returned/logged data and use shared redaction/audit context.
- Keep deterministic code responsible for eligibility, money, and credit results. OpenAI/Codex may assist build-time synthetic generation/tests only.
- Keep the State Emblem, government logos, and official-approval implications out of prototype assets and copy.

### 5. Validate in layers

Run the smallest relevant checks during iteration, then all checks required by [references/validation-matrix.md](references/validation-matrix.md). Always run:

```bash
bash .agents/skills/develop-krishisetu/scripts/validate-foundation.sh
```

If a documented command is not implemented yet, report it as a phase prerequisite; do not silently invent a weaker substitute or claim it passed.

### 6. Hand off with evidence

Report:

- phase and owning module/package;
- authoritative sources changed;
- generated artifacts refreshed;
- contracts/migrations/events affected;
- tests and validation commands run with outcomes;
- unresolved risk, mock limitation, or next dependency.

Do not call work complete when required gates are skipped or failing.

## Absolute prohibitions

- Do not call, scrape, probe, or configure live government, Aadhaar, NPCI, bank, UFSI, ULI, or public-service systems.
- Do not collect or commit real Aadhaar/PAN, OTP, phone, bank, land, payment, password, health, or other personal data.
- Do not add raw business/config/design/localization values outside their authoritative owner.
- Do not hand-edit generated files.
- Do not deep-import module internals or read another module’s tables/repositories.
- Do not place business rules in React components, route handlers, database repositories, or mock fixtures.
- Do not use floating-point money or numeric Farmer ID/ULPIN values.
- Do not create a miscellaneous `utils` dumping ground.
- Do not add a new service, queue, cache, database, framework, global store, or provider SDK without demonstrated need and an ADR.
- Do not present mock eligibility, credit, consent, or applications as official/approved/production-certified.
- Do not delete or overwrite unrelated user work, migrations, fixtures, or evidence.

## Stop conditions

Stop and ask for direction when:

- the request requires a live/real-data integration or government emblem authorization;
- no module can own the behavior without changing a documented boundary;
- authoritative documents conflict after applying the source hierarchy;
- a migration would destroy or irreversibly reinterpret existing data;
- a new external service, credential, paid dependency, or trust boundary is required;
- required native-language, legal, financial, or security review cannot be represented honestly.

Do not stop merely because a phase is large. Implement the smallest safe vertical slice and preserve the gates.

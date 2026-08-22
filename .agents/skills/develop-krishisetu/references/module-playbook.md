# KrishiSetu Module Playbook

## Contents

1. Add a module
2. Add business behavior
3. Add an API route
4. Add persistence
5. Add a provider adapter
6. Add an event
7. Add localized copy
8. Add a design token/component
9. Add shared code

## 1. Add a module

1. Confirm a cohesive bounded capability not owned elsewhere.
2. Add its ID/config to the module registry.
3. Create `domain`, `application`, `ports`, `adapters`, `delivery`, `config`, `migrations`, `seed`, and `tests` folders only as needed.
4. Export only the public application API from `src/index.ts`; restrict `package.json#exports`.
5. Create a composition factory receiving config/core/platform ports.
6. Register through API/worker composition, never filesystem scanning.
7. Add dependency/table/public-export architecture tests.

## 2. Add business behavior

1. Express invariant in a domain value object/entity/service and unit test.
2. Define application command/query and result/error contract.
3. Define needed ports; do not import infrastructure.
4. Implement use case with `ExecutionContext`.
5. Add adapter/delivery/UI only after application tests pass.
6. Emit stable codes/message keys/facts, not localized prose.

## 3. Add an API route

1. Add TypeBox/OpenAPI contract and consent/permission metadata in the authoritative contract owner.
2. Generate server/client types.
3. Implement thin delivery adapter: parse → authorize → call use case → map result.
4. Keep SQL, provider calls, rules, status mapping, and copy out of the handler.
5. Add contract tests for success, validation, auth/owner, consent, error mapping, and `no-store`.

## 4. Add persistence

1. Define repository port in the owning module.
2. Add a new ordered module migration; never edit applied history.
3. Use strings for identifiers and integer paise for money.
4. Add CHECK/unique/index constraints that express storage invariants.
5. Implement prepared statements/transaction adapter.
6. Test migration, repository contract, rollback, and module data ownership.

## 5. Add a provider adapter

1. Define a provider-neutral port and contract kit.
2. Implement an in-process mock adapter with synthetic fixtures.
3. Keep raw provider DTO/status inside the adapter and normalize at the boundary.
4. Add timeout/failure/partial cases and data-minimization assertions.
5. Do not add configurable live URLs/network clients to runtime mock modules.
6. A future sanctioned adapter must pass the same contract kit and a new security/ADR review.

## 6. Add an event

1. Name a completed fact: `<module>.<fact>.v1`.
2. Put schema/version in the authoritative event contract owner.
3. Include event ID, occurredAt, correlation/causation IDs, producer, and minimal payload.
4. Publish after local commit through the event port.
5. Make consumers idempotent and test duplicate/out-of-order delivery assumptions.
6. Do not put whole profiles/records in events.

## 7. Add localized copy

1. Choose semantic namespace/key; add English canonical key.
2. Add Marathi, Hindi, and Kannada values with identical variables.
3. Generate typed keys and run locale validation.
4. Use `t(key, facts)` or return `messageKey + facts`; do not duplicate sentence literals.
5. Test fonts, plural/number/date/unit formatting, 320px reflow, and fallback.

## 8. Add a design token/component

1. Add semantic token JSON, not a component hex value.
2. Generate CSS/Tailwind outputs and update visual evidence.
3. Build shared component only when reused or a standardized accessible primitive.
4. Cover default/hover/active/focus/disabled/loading/error states.
5. Test all locales, keyboard, axe, forced colours, reduced motion, 200% zoom, and target size.

## 9. Add shared code

Share only when behavior is identical, stable, and business-agnostic across at least two owners. Prefer duplication inside modules until the correct abstraction is clear. Place universal value/execution primitives in `core`, platform integrations in their named package, UI primitives in `design-system`, and test-only helpers in `testing`. Never create generic root `utils`, `helpers`, or `common` dumping grounds.


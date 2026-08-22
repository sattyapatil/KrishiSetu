# ADR-001: TypeScript Modular Monolith with Next.js, Fastify, and SQLite

**Status:** Accepted  
**Date:** August 22, 2026  
**Decision owners:** Krishi-Ekatra build team

> **Implementation addendum:** the decision remains accepted under the KrishiSetu brand. Module/package layout, single-source-of-truth ownership, and four-language configuration are defined by `KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md`; that document supersedes the earlier internal folder examples without changing this ADR's stack/topology decision.

## Context

Krishi-Ekatra must demonstrate a complete citizen journey and credible backend/process interoperability by an August 27 internal freeze. It cannot call live government systems or use real sensitive data. The architecture needs clear UFSI/ULI-shaped boundaries, consent enforcement, parallel aggregation, relational joint ownership, idempotent multi-scheme applications, and purge behavior. At the same time, it must remain deployable and debuggable by a hackathon-sized team.

## Decision

Use one npm workspace and one language across two deployable apps:

- Next.js 16.3/React 19.2/TypeScript for the web citizen experience.
- Node.js 24 LTS/Fastify 5/TypeScript for the API gateway.
- SQLite through `better-sqlite3`, SQL migrations, and deterministic JSON fixtures.
- Logical mock-provider modules with typed ports/adapters and separately exposed `/mock` routes.
- TypeBox JSON Schema as the request/response contract source, exported as OpenAPI.

The web and API may deploy separately, but provider mocks remain modules inside the single API process for the hackathon.

## Decision drivers

1. Complete the core path within five implementation days.
2. Make backend interoperability visible and testable.
3. Share types/contracts without code generation drift.
4. Model relationships and transactions credibly.
5. Eliminate unnecessary cloud services and live external dependencies.
6. Preserve seams for later sanctioned DPI adapters.
7. Make failure injection, reset, and demo reproduction deterministic.

## Consequences

### Positive

- One language and lockfile reduce setup and integration overhead.
- Fastify plugins and adapter interfaces preserve domain separation without distributed-system deployment risk.
- JSON Schema produces runtime validation, typed handlers, OpenAPI, and contract tests.
- SQLite demonstrates joint ownership, uniqueness, transactions, idempotency, and purge better than static JSON.
- The full mock system can be reset from fixtures and run offline locally.
- A future live adapter can implement the same port after authorization, security review, and contract negotiation.

### Negative

- It does not demonstrate real network isolation or independent scaling between mock providers.
- SQLite constrains horizontal write scaling and requires one API instance for consistent local state.
- Separate Vercel/Render deployment introduces cross-origin cookie and CSRF configuration.
- `better-sqlite3` is a native dependency and therefore requires a compatible Node/container build.

### Mitigations

- Trace each logical provider independently with correlation IDs and timings.
- Expose provider-shaped mock routes and OpenAPI while calling their services through ports.
- Use one containerized API instance and resettable ephemeral data for the demo.
- Test production cookie/origin behavior from a private browser before freeze.

## Alternatives considered

### Next.js route handlers only

Rejected as the definitive backend because domain orchestration, provider mocks, Swagger contracts, plugins, and testable consent pre-handlers are clearer in a dedicated Fastify app. A single Next deployment would be simpler, but the backend/process story would be less explicit.

### Express.js

Viable but rejected. It would require more conventions and packages for schema-first validation, serialization, structured plugin boundaries, and generated OpenAPI. Team familiarity can override this ADR only before implementation starts.

### Python/FastAPI backend

Viable and strong for APIs, but rejected for this schedule because it introduces a second language/type system and generated client step. The workload does not need Python-specific data/ML libraries, and runtime AI is intentionally outside eligibility decisions.

### Separate mock microservices

Rejected for the hackathon. Five services would add ports, deployment units, health checks, secrets, cross-service debugging, and failure modes without improving the citizen proof. The logical boundaries and contract tests provide the useful evidence.

### JSON Server/static JSON only

Rejected because it cannot credibly model transactional bundles, uniqueness/idempotency, consent lifecycle, joint-owner relations, or purging.

### Hosted PostgreSQL

Deferred. It is the natural production evolution, but account provisioning, migrations, credentials, network reliability, and cost are not justified for a deterministic synthetic demo.

### Redis/cache/queue

Deferred. Consent status is checked directly in SQLite so revocation is immediate. The small synchronous bundle/purge workload does not require a queue. Production would add an outbox and workers for durable provider dispatch/erasure jobs.

## Revisit triggers

Revisit this ADR when any of the following becomes true:

- a sanctioned live provider contract requires a separate trust/network boundary;
- more than one API instance must accept writes;
- application dispatch must survive process termination with guaranteed delivery;
- production data retention, key management, audit, or residency requirements are defined;
- the team has more than one domain squad and an operational platform for services;
- formal UFSI/ULI specifications require protocol or signing behavior incompatible with current ports.

## Production evolution path

1. Replace SQLite with managed PostgreSQL while retaining repository ports.
2. Add transactional outbox and workers for bundle provider dispatch and purge jobs.
3. Move secrets/signing keys to KMS/HSM and rotate verified keys.
4. Split adapters into separately deployed connectors only where trust/scale demands it.
5. Replace mocks one at a time with sanctioned, documented provider clients after approvals.
6. Add consent-manager conformance, DPI security review, observability, DR, penetration testing, and legal/privacy assessment.

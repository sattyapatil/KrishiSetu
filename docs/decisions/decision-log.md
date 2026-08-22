# KrishiSetu Architecture Decision Log

This log tracks accepted, superseded, and candidate architecture decision records (ADRs) for KrishiSetu.

## Accepted Decisions

| ADR | Title | Date | Status | Summary |
|---|---|---|---|---|
| [ADR-001](file:///Users/satishpophale/satish/work/IT/Hackathon/KrishiSetu/docs/architecture/decisions/ADR-001-TYPESCRIPT-MODULAR-MONOLITH.md) | TypeScript Modular Monolith with Next.js, Fastify, and SQLite | 2026-08-22 | Accepted | Single repository, TypeScript modular monolith with npm workspaces, Next.js 15/React 19 web app, Fastify 5 API gateway, SQLite prototype persistence, TypeBox contracts, and in-process mock DPI integration adapters. |

## Implementation Notes

- **Workspace Structure**: Implemented inside `/Users/satishpophale/satish/work/IT/Hackathon/KrishiSetu` as an isolated monorepo with its own git repository.
- **Module Isolation**: 12 business modules under `modules/*` enforce restricted public exports preventing deep imports.
- **Single Source of Truth**: Design tokens and 4-language i18n catalogs (`en`, `mr`, `hi`, `kn`) have zero-drift automated verification.

## Candidate / Future Decision Topics

1. **Transactional Outbox for Production Extraction**: Pattern for durable provider event dispatch and asynchronous purging when PostgreSQL is introduced.
2. **KMS / HSM Signing Key Integration**: Architecture for managing JWS consent keys and secret rotations in production deployments.
3. **Assisted-Service Admin Topology**: Integration of assisted-service CSC (Common Service Center) operator client using the same modular API contracts.

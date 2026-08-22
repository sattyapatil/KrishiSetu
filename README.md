# KrishiSetu (कृषीसेतू)

> **Motto:** अन्नदः सर्वदश्चैव (*"The provider of food is the provider of everything."*)  
> **Safety Notice:** Hackathon prototype • Not a government website • All records are fictional.

KrishiSetu is an Indian agricultural digital public infrastructure (DPI) prototype designed as a domain-modular monolith in TypeScript. It demonstrates unified land-record linking, crop-registry integration, deterministic subsidy eligibility, credit limit pre-qualification, and consent-driven multi-scheme application bundling.

---

## 1. Prototype & Safety Boundaries

- **Mock-Only Integrations:** KrishiSetu connects exclusively to in-process mock provider adapters simulating UFSI/Mahabhumi, Crop Sown Registry, MahaDBT, and ULI/KCC. It contains **no live government or banking API connections**.
- **Synthetic Data Only:** Identifiers (Farmer IDs `27202600000001`–`27202600000099`, ULPINs, Survey numbers, bank accounts) and personas are strictly synthetic fixtures.
- **No Government Emblems:** An original `DEMO` seal is rendered. Official State Emblems, Lion Capital, and Ashoka Chakra are excluded from prototype assets.
- **Consent & Privacy:** Purpose-specific consent scoping (`IDENTITY_READ`, `LAND_READ`, `CROP_READ`, `BANK_STATUS_READ`, `SUBSIDY_ELIGIBILITY_READ`, `CREDIT_READ`, `SUBSIDY_APPLY`, `CREDIT_PREAPPLY`) with synchronous prototype purge on revocation.

---

## 2. Architecture & Workspaces

The repository is structured as a TypeScript modular monolith with npm workspaces:

```text
krishisetu/
├── apps/
│   ├── web/               # Next.js 16 / React 19 citizen web application
│   ├── api/               # Fastify 5 HTTP composition gateway
│   └── worker/            # Async job & event composition shell
├── modules/
│   ├── identity/          # Synthetic login & session lifecycle
│   ├── users/             # User profile & locale/accessibility preferences
│   ├── consent/           # Consent grant, validation, revocation, and purge
│   ├── farmer-profile/    # Agricultural identity & provider linkage
│   ├── land-records/      # Parcels, ULPIN, and joint ownership allocation
│   ├── crop-registry/     # Seasonal crop survey records
│   ├── schemes/           # Versioned rules & deterministic eligibility
│   ├── credit/            # ULI/KCC rate cards & financial estimates
│   ├── applications/      # Multi-scheme bundle saga & idempotency
│   ├── notifications/     # Notification intents & delivery preferences
│   ├── audit/             # Immutable sanitized audit events
│   └── dashboard/         # Composite read model fan-out
├── packages/
│   ├── core/              # Universal primitives (Result, Money, Identifiers, Clock)
│   ├── config/            # Authoritative product, module, and env configuration
│   ├── contracts/         # API schemas, error catalog, and event contracts
│   ├── i18n/              # Locale registry (en, mr, hi, kn) and message catalogs
│   ├── policy/            # Consent purposes, scopes, and data classification
│   ├── design-tokens/     # Canonical JSON tokens and generated CSS/Tailwind
│   ├── design-system/     # Accessible, stateless UI components (UX4G/GIGW-aligned)
│   ├── observability/     # Structured logging and redaction
│   ├── testing/           # Synthetic fixture harnesses & test helpers
│   ├── database/          # SQLite adapter, transactions, and migration checksums
│   ├── eslint-config/     # Workspace ESLint boundary rules
│   └── tsconfig/          # Shared TypeScript base configs
└── tools/
    ├── codegen/           # Token & message-key generators
    ├── database/          # Safe migrate/seed/reset commands
    ├── smoke/             # Public API smoke checks
    └── architecture-tests/# Boundary and dependency tests
```

---

## 3. Localization (i18n)

- **Default Locale:** English (`en`)
- **Supported Locales:**
  - English (`en`) — Noto Sans
  - Marathi (`mr`) — Noto Sans Devanagari
  - Hindi (`hi`) — Noto Sans Devanagari
  - Kannada (`kn`) — Noto Sans Kannada
- **Resolution Pipeline:** URL path (`/[locale]/...`) → Authenticated user preference → Signed cookie → Accept-Language header → Configured default (`en`) → Registry fallback (`en`).

---

## 4. Development & Verification

### Prerequisites
- Node.js >= 22.0.0
- npm >= 10.0.0

### Commands
```bash
# Install dependencies
npm install

# Run codegen (tokens, message keys)
npm run codegen

# Verify codegen drift
npm run codegen:check

# Start the complete demo: web on 3000 and API on 3001
npm run dev

# Optional: run either service independently for debugging
npm run dev:web
npm run dev:api

# Typecheck all packages
npm run typecheck

# Lint workspace and boundary rules
npm run lint

# Run all unit, integration, contract, and boundary tests
npm test

# Create/verify the checksum-protected synthetic SQLite database
npm run db:migrate

# Run API contract and public surface checks
npm run test:contract
npm run smoke:public

# Run foundation validation
npm run validate:foundation
```

---

## 5. Documentation

- [Implementation Progress](docs/implementation/IMPLEMENTATION-PROGRESS.md)
- [Implementation Evidence](docs/evidence/IMPLEMENTATION-EVIDENCE-2026-08-22.md)
- [Architecture & Modular Monolith](docs/architecture/KRISHISETU-MODULAR-FOUNDATION-ARCHITECTURE.md)
- [API Contracts & Data Flows](docs/architecture/API-CONTRACT-AND-DATA-FLOWS.md)
- [Security, Privacy & Threat Model](docs/architecture/SECURITY-PRIVACY-AND-THREAT-MODEL.md)
- [Brand & Accessible UI System](docs/design-system/KRISHISETU-BRAND-AND-UI-DESIGN-SYSTEM.md)
- [Architecture Decision Log](docs/decisions/decision-log.md)

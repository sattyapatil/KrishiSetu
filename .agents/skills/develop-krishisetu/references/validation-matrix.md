# KrishiSetu Validation Matrix

Run only commands that exist, but treat missing phase-required commands as incomplete implementation.

| Change | Required checks |
|---|---|
| Any change | foundation validator, lint, typecheck, relevant tests |
| Registry/contract/token/message | codegen, codegen drift, catalog/locale/token validation |
| Core/module boundary | architecture tests, unit tests, package build |
| Domain rule/money/identifier | unit + boundary/property cases; deterministic clock/ID |
| Migration/repository | migration checksum/idempotency, repository integration, ownership scan |
| API/guard/error | contract tests, auth/owner/consent negative tests, no-store/redaction |
| Provider mock | provider contract kit, timeout/failure/data-minimization, no-egress scan |
| Application saga | concurrency/idempotency/state/retry/event tests |
| Frontend/copy | component/E2E, four locales, axe, keyboard, 320px, 200% zoom |
| Consent/purge | invalid-consent zero-call spy, purge table/category assertions, cache/session clear |
| Deployment/config | clean build, startup config failure, readiness, public smoke, network capture |

Target final commands:

```bash
npm ci
npm run build
npm run lint
npm run typecheck
npm run codegen:check
npm run test
npm run test:contract
npm run test:architecture
npm run test:locales
npm run test:a11y
npm run test:e2e
npm run validate:fixtures
npm run validate:security
```

Evidence must state command, exit status, relevant counts, and skipped/unavailable gates. Never summarize a failed or unrun gate as passing.


# Deployment Configurations for KrishiSetu

The checked-in Compose stack runs the same synthetic-only API and web compositions used locally:

```bash
docker compose -f deployment/compose/docker-compose.yml up --build
```

The Compose defaults are for local demonstration only. A production-mode start intentionally fails until all session, CSRF, internal-mock, and reset secrets replace the development defaults. The worker remains dormant because the prototype purge and bundle dispatch are deliberately synchronous.

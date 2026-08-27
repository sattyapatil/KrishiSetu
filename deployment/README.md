# Deployment Configurations for KrishiSetu

The checked-in Compose stack runs the same synthetic-only API and web compositions used locally:

```bash
docker compose -f deployment/compose/docker-compose.yml up --build
```

The Compose defaults are for local demonstration only. A production-mode start intentionally fails until all session, CSRF, internal-mock, and reset secrets replace the development defaults. The worker remains dormant because the prototype purge and bundle dispatch are deliberately synchronous.

## Frontend-only hackathon deployment

The web application defaults to the `browser-demo` journey adapter. It runs the
synthetic login, consent, dashboard, application, retry, and withdrawal flows
entirely in the visitor's browser, so the public demo has no runtime dependency
on the API service or its database.

The API adapter and the `/backend` rewrite are intentionally retained for the
full-stack Compose deployment. They are not selected by the public demo. To use
that full-stack path, pass an `ApiPrototypeJourneyAdapter` to `JourneyProvider`
or create one through `createJourneyAdapter('api')` in an environment-specific
web composition.

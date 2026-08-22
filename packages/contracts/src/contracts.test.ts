import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { errorCatalog, apiRoutes } from './index';

describe('packages/contracts', () => {
  it('errorCatalog defines status codes and message keys for all standard errors', () => {
    assert.equal(errorCatalog.CONSENT_REQUIRED.defaultStatus, 403);
    assert.equal(errorCatalog.CONSENT_REQUIRED.messageKey, 'errors.consent.required');

    assert.equal(errorCatalog.CONSENT_REVOKED.defaultStatus, 403);
    assert.equal(errorCatalog.IDEMPOTENCY_CONFLICT.defaultStatus, 409);
    assert.equal(errorCatalog.DEMO_FARMER_NOT_FOUND.defaultStatus, 404);
  });

  it('apiRoutes defines correct endpoint URLs', () => {
    assert.equal(apiRoutes.healthLive, '/health/live');
    assert.equal(apiRoutes.authLogin, '/api/v1/auth/login');
    assert.equal(apiRoutes.dashboard, '/api/v1/dashboard');
    assert.equal(apiRoutes.consents, '/api/v1/consents');
    assert.equal(apiRoutes.consentById('123'), '/api/v1/consents/123');
  });
});

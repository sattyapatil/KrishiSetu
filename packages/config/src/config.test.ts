import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { productConfig, moduleRegistry, loadRuntimeConfig } from './index.js';

describe('packages/config', () => {
  it('productConfig has required brand and safety properties', () => {
    assert.equal(productConfig.id, 'krishisetu');
    assert.equal(productConfig.name, 'KrishiSetu');
    assert.equal(productConfig.sanskritMotto, 'अन्नदः सर्वदश्चैव');
    assert.equal(productConfig.prototype, true);
    assert.equal(typeof productConfig.disclosureText, 'string');
  });

  it('moduleRegistry defines required and optional modules with required scopes', () => {
    assert.equal(moduleRegistry.identity.enabled, true);
    assert.equal(moduleRegistry.identity.required, true);

    assert.equal(moduleRegistry.consent.enabled, true);
    assert.equal(moduleRegistry.consent.required, true);

    assert.deepEqual(moduleRegistry.landRecords.requiredScopes, ['LAND_READ']);
    assert.deepEqual(moduleRegistry.cropRegistry.requiredScopes, ['CROP_READ']);
    assert.deepEqual(moduleRegistry.schemes.requiredScopes, ['SUBSIDY_ELIGIBILITY_READ']);
    assert.deepEqual(moduleRegistry.credit.requiredScopes, ['CREDIT_READ']);
    assert.deepEqual(moduleRegistry.applications.requiredScopes, ['SUBSIDY_APPLY', 'CREDIT_PREAPPLY']);

    assert.equal(moduleRegistry.notifications.enabled, false);
  });

  it('loadRuntimeConfig provides immutable runtime defaults', () => {
    const config = loadRuntimeConfig();
    assert.equal(typeof config.port, 'number');
    assert.equal(typeof config.host, 'string');
    assert.equal(config.defaultLocale, 'en');
    assert.equal(config.prototypeMode, true);
    assert.ok(Object.isFrozen(config));
  });
});

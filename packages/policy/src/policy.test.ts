import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { consentScopes, consentPurposes, retentionPolicies, permissions, dataClasses } from './index.js';

describe('packages/policy', () => {
  it('consentScopes defines all required agricultural, identity, benefit, and credit scopes', () => {
    assert.ok(consentScopes.IDENTITY_READ);
    assert.ok(consentScopes.LAND_READ);
    assert.ok(consentScopes.CROP_READ);
    assert.ok(consentScopes.BANK_STATUS_READ);
    assert.ok(consentScopes.SUBSIDY_ELIGIBILITY_READ);
    assert.ok(consentScopes.CREDIT_READ);
    assert.ok(consentScopes.SUBSIDY_APPLY);
    assert.ok(consentScopes.CREDIT_PREAPPLY);
  });

  it('consentPurposes contains DASHBOARD_VIEW and MULTI_SCHEME_APPLICATION with required scopes', () => {
    const dashboard = consentPurposes.DASHBOARD_VIEW;
    assert.equal(dashboard.code, 'DASHBOARD_VIEW');
    assert.equal(dashboard.defaultDurationSeconds, 1800);
    assert.ok(dashboard.requiredScopes.includes('LAND_READ'));

    const bundle = consentPurposes.MULTI_SCHEME_APPLICATION;
    assert.equal(bundle.code, 'MULTI_SCHEME_APPLICATION');
    assert.ok(bundle.requiredScopes.includes('SUBSIDY_APPLY'));
    assert.ok(bundle.requiredScopes.includes('CREDIT_PREAPPLY'));
  });

  it('permissions defines core system authorization scopes', () => {
    assert.equal(permissions.FARMER_SELF_READ, 'FARMER_SELF_READ');
    assert.equal(permissions.CONSENT_MANAGE, 'CONSENT_MANAGE');
  });

  it('retentionPolicies covers all ephemeral and synthetic classifications', () => {
    assert.equal(retentionPolicies.dashboardCache.onRevocation, 'DELETE_IMMEDIATELY');
    assert.equal(retentionPolicies.normalizedSnapshots.onRevocation, 'DELETE_IMMEDIATELY');
    assert.equal(retentionPolicies.syntheticFixtures.onRevocation, 'RETAIN_SYNTHETIC');
    assert.equal(retentionPolicies.auditTombstone.onRevocation, 'RETAIN_MINIMAL_AUDIT');
  });

  it('dataClasses defines logging boundaries', () => {
    assert.equal(dataClasses.PUBLIC.loggingAllowed, true);
    assert.equal(dataClasses.SYNTHETIC_RESTRICTED.loggingAllowed, false);
    assert.equal(dataClasses.SECRET.loggingAllowed, false);
  });
});


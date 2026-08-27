import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryPrototypeJourneyAdapter } from '@krishisetu/testing';

describe('KrishiSetu Complete Interaction Contract & Journey Verification', () => {
  test('Authentication: allowlisted synthetic demo persona succeeds with valid PIN', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    const result = await adapter.startSession('27202600000001', '2468');

    assert.ok(result.success);
    assert.ok(result.session);
    assert.equal(result.session.farmerId, '27202600000001');
    assert.equal(result.session.farmerName, 'Namdev Tukaram Shinde');
    assert.equal(result.session.dashboardConsentGranted, false);
  });

  test('Authentication: rejects invalid PIN with typed error', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    const result = await adapter.startSession('27202600000001', '9999');

    assert.equal(result.success, false);
    assert.equal(result.errorMessageKey, 'errors.identity.invalidPin');
    assert.equal(result.session, undefined);
  });

  test('Authentication: rejects unseeded farmer ID', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    const result = await adapter.startSession('99999999999999', '2468');

    assert.equal(result.success, false);
    assert.equal(result.errorMessageKey, 'errors.identity.farmerNotFound');
  });

  test('Dashboard Consent: grants the required journey scope bundle', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    await adapter.startSession('27202600000001', '2468');

    const grantResult = await adapter.grantDashboardConsent([
      'IDENTITY_READ',
      'LAND_READ',
      'CROP_READ',
    ]);

    assert.ok(grantResult.consentId);
    assert.deepEqual(grantResult.scopes, [
      'IDENTITY_READ',
      'LAND_READ',
      'CROP_READ',
    ]);

    const activeSession = adapter.getActiveSession();
    assert.ok(activeSession);
    assert.equal(activeSession.dashboardConsentGranted, true);
    assert.deepEqual(activeSession.dashboardConsentScopes, [
      'IDENTITY_READ',
      'LAND_READ',
      'CROP_READ',
    ]);
  });

  test('Journey Submission (COMPLETED scenario): generates deterministic bundle and child receipts', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    await adapter.startSession('27202600000001', '2468');
    await adapter.grantDashboardConsent(['IDENTITY_READ', 'LAND_READ']);

    const submitResult = await adapter.submitBundle({
      farmerId: '27202600000001',
      offeringIds: ['offering_drip_2026', 'offering_kcc_2026'],
      declarationAffirmed: true,
      applicationScopesGranted: ['SUBSIDY_APPLY', 'CREDIT_PREAPPLY'],
      idempotencyKey: 'IDEMP-TEST-001',
    });

    assert.ok(submitResult.success);
    assert.ok(submitResult.bundle);
    assert.equal(submitResult.bundle.status, 'COMPLETED');
    assert.equal(submitResult.bundle.children.length, 2);
    assert.equal(submitResult.bundle.children[0]?.status, 'ACCEPTED_MOCK');
    assert.equal(submitResult.bundle.children[1]?.status, 'ACCEPTED_MOCK');
    assert.ok(submitResult.bundle.children[0]?.providerReceipt?.startsWith('MOCK-MDBT-'));
    assert.ok(submitResult.bundle.children[1]?.providerReceipt?.startsWith('MOCK-ULI-'));
  });

  test('Journey Submission (PARTIAL_RETRYABLE scenario): recovers on child retry', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    // Ramesh Ghadge triggers simulated retryable timeout scenario
    await adapter.startSession('27202600000003', '2468');
    await adapter.grantDashboardConsent(['IDENTITY_READ', 'LAND_READ']);

    const submitResult = await adapter.submitBundle({
      farmerId: '27202600000003',
      offeringIds: ['offering_drip_2026', 'offering_kcc_2026'],
      declarationAffirmed: true,
      applicationScopesGranted: ['SUBSIDY_APPLY', 'CREDIT_PREAPPLY'],
    });

    assert.ok(submitResult.success);
    assert.ok(submitResult.bundle);
    assert.equal(submitResult.bundle.status, 'PARTIAL');

    const failedChild = submitResult.bundle.children.find((c) => c.status === 'FAILED_RETRYABLE');
    assert.ok(failedChild, 'Expected at least one failed retryable child');
    assert.equal(failedChild.retryable, true);

    // Perform retry on failed child
    const retryResult = await adapter.retryChild(submitResult.bundle.bundleId, failedChild.childId);
    assert.ok(retryResult.success);
    assert.ok(retryResult.bundle);
    assert.equal(retryResult.bundle.status, 'COMPLETED');

    const retriedChild = retryResult.bundle.children.find((c) => c.childId === failedChild.childId);
    assert.equal(retriedChild?.status, 'ACCEPTED_MOCK');
    assert.ok(retriedChild?.providerReceipt?.startsWith('MOCK-ULI-RETRY-'));
  });

  test('Scope Gating: submit fails if declaration or application scopes not granted', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    await adapter.startSession('27202600000001', '2468');
    await adapter.grantDashboardConsent(['IDENTITY_READ', 'LAND_READ']);

    const failedSubmit = await adapter.submitBundle({
      farmerId: '27202600000001',
      offeringIds: ['offering_drip_2026'],
      declarationAffirmed: false, // Not affirmed
      applicationScopesGranted: [],
    });

    assert.equal(failedSubmit.success, false);
    assert.equal(failedSubmit.errorMessageKey, 'errors.journey.declarationRequired');
  });

  test('Idempotency: duplicate submission returns existing bundle without double-creating', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    await adapter.startSession('27202600000001', '2468');
    await adapter.grantDashboardConsent(['IDENTITY_READ', 'LAND_READ']);

    const firstSubmit = await adapter.submitBundle({
      farmerId: '27202600000001',
      offeringIds: ['offering_drip_2026'],
      declarationAffirmed: true,
      applicationScopesGranted: ['SUBSIDY_APPLY'],
      idempotencyKey: 'EXACT_SAME_KEY_123',
    });

    const secondSubmit = await adapter.submitBundle({
      farmerId: '27202600000001',
      offeringIds: ['offering_drip_2026'],
      declarationAffirmed: true,
      applicationScopesGranted: ['SUBSIDY_APPLY'],
      idempotencyKey: 'EXACT_SAME_KEY_123',
    });

    assert.ok(firstSubmit.success);
    assert.ok(secondSubmit.success);
    assert.equal(firstSubmit.bundle?.bundleId, secondSubmit.bundle?.bundleId);
  });

  test('Privacy Withdrawal: produces honest disclosure receipt and clears session data', async () => {
    const adapter = new InMemoryPrototypeJourneyAdapter();
    await adapter.startSession('27202600000001', '2468');
    await adapter.grantDashboardConsent(['IDENTITY_READ', 'LAND_READ']);

    const receipt = await adapter.simulateWithdrawal('CNS-2026-0001');

    assert.ok(receipt.receiptId.startsWith('RCP-PURGE-'));
    assert.equal(
      receipt.wording,
      'Prototype withdrawal completed for derived synthetic state.'
    );
    assert.ok(receipt.purgedTargets.length > 0);
    assert.equal(adapter.getActiveSession(), null);
  });
});

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { DeterministicIdGenerator, FixedClock } from '@krishisetu/core';
import { consentPurposes } from '@krishisetu/policy';
import { createApplicationRuntime } from './composition/runtime.js';
import { buildServer } from './server.js';

const ORIGIN = 'http://localhost:3000';

function cookieFrom(response: { headers: Record<string, unknown> }): string {
  const header = String(response.headers['set-cookie'] ?? '');
  return header.split(';')[0] ?? '';
}

describe('KrishiSetu API contract and trust boundary', () => {
  const runtime = createApplicationRuntime({
    databasePath: ':memory:',
    clock: new FixedClock('2026-08-22T09:00:00.000Z'),
    ids: new DeterministicIdGenerator('api'),
  });
  let server: Awaited<ReturnType<typeof buildServer>>;

  before(async () => {
    server = await buildServer({ runtime, allowedOrigin: ORIGIN, secureCookies: false });
  });

  after(async () => {
    await server.close();
    runtime.close();
  });

  async function login(farmerId = '27202600000001') {
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      headers: { origin: ORIGIN },
      payload: { farmerId, demoPin: '2468', locale: 'en' },
    });
    assert.equal(response.statusCode, 200);
    const body = response.json();
    return {
      cookie: cookieFrom(response),
      csrf: String(body.session.csrfToken),
      body,
    };
  }

  async function grant(
    session: { cookie: string; csrf: string },
    purposeCode: keyof typeof consentPurposes
  ) {
    const purpose = consentPurposes[purposeCode];
    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/consents',
      headers: {
        origin: ORIGIN,
        cookie: session.cookie,
        'x-csrf-token': session.csrf,
      },
      payload: {
        purposeCode,
        purposeVersion: purpose.version,
        scopes: purpose.requiredScopes,
        validForSeconds: 1800,
        noticeAcknowledged: true,
      },
    });
    assert.equal(response.statusCode, 201, response.body);
    return response.json().consent;
  }

  it('blocks dashboard before consent without invoking mock providers', async () => {
    const session = await login();
    const beforeLand = runtime.landRecords.providerCalls.count;
    const beforeCrops = runtime.cropRegistry.providerCalls.count;
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/dashboard',
      headers: { cookie: session.cookie },
    });
    assert.equal(response.statusCode, 403);
    assert.equal(response.json().error.code, 'CONSENT_REQUIRED');
    assert.equal(runtime.landRecords.providerCalls.count, beforeLand);
    assert.equal(runtime.cropRegistry.providerCalls.count, beforeCrops);
  });

  it('composes land, crops, deterministic eligibility, and integer-paise credit', async () => {
    const session = await login();
    const consent = await grant(session, 'DASHBOARD_VIEW');
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/dashboard',
      headers: { cookie: session.cookie, 'x-consent-id': consent.consentId },
    });
    assert.equal(response.statusCode, 200, response.body);
    const body = response.json();
    assert.equal(body.land.totalCultivableShareHectares, '0.6750');
    assert.equal(body.land.holdings[0].shareLabel, '1/2');
    const credit = body.offerings.find((item: { domain: string }) => item.domain === 'ULI');
    assert.equal(credit.estimatedLimitPaise, 15_750_001);
    assert.equal(body.metadata.overallStatus, 'COMPLETE');
    assert.equal(response.headers['cache-control'], 'no-store, private');
  });

  it('creates one idempotent parent/child saga and retries only the failed child', async () => {
    const session = await login('27202600000003');
    const consent = await grant(session, 'MULTI_SCHEME_APPLICATION');
    const headers = {
      origin: ORIGIN,
      cookie: session.cookie,
      'x-csrf-token': session.csrf,
      'x-consent-id': String(consent.consentId),
      'idempotency-key': 'idem-api-partial-0001',
    };
    const payload = {
      selections: [
        {
          offeringId: 'offering_mahadbt_drip_2026',
          domain: 'MAHADBT',
          schemeCode: 'MAHADBT_DRIP',
        },
        {
          offeringId: 'offering_uli_kcc_2026',
          domain: 'ULI',
          schemeCode: 'KCC_CROP_LOAN',
        },
      ],
      declarations: { reviewedPrefilledData: true, understandsPrototype: true },
    };
    const [first, duplicate] = await Promise.all([
      server.inject({ method: 'POST', url: '/api/v1/application-bundles', headers, payload }),
      server.inject({ method: 'POST', url: '/api/v1/application-bundles', headers, payload }),
    ]);
    assert.equal(first.statusCode, 201, first.body);
    assert.equal(duplicate.statusCode, 201, duplicate.body);
    const firstBundle = first.json().bundle;
    assert.equal(firstBundle.bundleId, duplicate.json().bundle.bundleId);
    assert.equal(firstBundle.status, 'PARTIAL');
    assert.equal(firstBundle.children.filter((child: { status: string }) => child.status === 'ACCEPTED_MOCK').length, 1);
    const subsidyCalls = runtime.schemes.providerCalls.submission;
    const retry = await server.inject({
      method: 'POST',
      url: `/api/v1/application-bundles/${firstBundle.bundleId}/retry`,
      headers,
    });
    assert.equal(retry.statusCode, 200, retry.body);
    assert.equal(retry.json().bundle.status, 'COMPLETED');
    assert.equal(runtime.schemes.providerCalls.submission, subsidyCalls);

    const conflict = await server.inject({
      method: 'POST',
      url: '/api/v1/application-bundles',
      headers,
      payload: { ...payload, selections: payload.selections.slice(1) },
    });
    assert.equal(conflict.statusCode, 409);
    assert.equal(conflict.json().error.code, 'IDEMPOTENCY_CONFLICT');
  });

  it('returns a valid partial dashboard and recovers through targeted refresh', async () => {
    const session = await login('27202600000003');
    const consent = await grant(session, 'DASHBOARD_VIEW');
    const first = await server.inject({
      method: 'GET',
      url: '/api/v1/dashboard',
      headers: { cookie: session.cookie, 'x-consent-id': consent.consentId },
    });
    assert.equal(first.statusCode, 200, first.body);
    assert.equal(first.json().metadata.overallStatus, 'PARTIAL');
    assert.equal(first.json().sourceStatus.uli.status, 'TIMEOUT');
    assert.equal(first.json().readiness.bank, 'UNKNOWN');

    const refresh = await server.inject({
      method: 'POST',
      url: '/api/v1/dashboard/refresh',
      headers: {
        origin: ORIGIN,
        cookie: session.cookie,
        'x-csrf-token': session.csrf,
        'x-consent-id': consent.consentId,
      },
      payload: { domains: ['uli'] },
    });
    assert.equal(refresh.statusCode, 200, refresh.body);
    assert.equal(refresh.json().metadata.overallStatus, 'COMPLETE');
    assert.equal(refresh.json().sourceStatus.uli.status, 'OK');
  });

  it('restores the session and each purpose-specific consent after a browser refresh', async () => {
    const session = await login('27202600000002');
    const dashboardConsent = await grant(session, 'DASHBOARD_VIEW');
    const applicationConsent = await grant(session, 'MULTI_SCHEME_APPLICATION');

    const me = await server.inject({
      method: 'GET',
      url: '/api/v1/users/me',
      headers: { cookie: session.cookie },
    });
    assert.equal(me.statusCode, 200, me.body);
    assert.equal(me.json().data.session.csrfToken, session.csrf);
    assert.equal(me.json().data.session.farmerId, '27202600000002');

    const restoredDashboard = await server.inject({
      method: 'GET',
      url: '/api/v1/consents/current?purposeCode=DASHBOARD_VIEW',
      headers: { cookie: session.cookie },
    });
    const restoredApplication = await server.inject({
      method: 'GET',
      url: '/api/v1/consents/current?purposeCode=MULTI_SCHEME_APPLICATION',
      headers: { cookie: session.cookie },
    });
    assert.equal(restoredDashboard.json().data.consentId, dashboardConsent.consentId);
    assert.equal(restoredApplication.json().data.consentId, applicationConsent.consentId);

    const preferences = await server.inject({
      method: 'PATCH',
      url: '/api/v1/users/me/preferences',
      headers: { origin: ORIGIN, cookie: session.cookie, 'x-csrf-token': session.csrf },
      payload: { locale: 'mr', highContrast: true },
    });
    assert.equal(preferences.statusCode, 200, preferences.body);
    assert.equal(preferences.json().data.preferences.locale, 'mr');
    assert.equal(preferences.json().data.preferences.highContrast, true);

    runtime.database
      .prepare('UPDATE consent_artefacts SET signature_compact = ? WHERE consent_id = ?')
      .run('tampered.payload.signature', applicationConsent.consentId);
    assert.throws(
      () => runtime.consent.current('27202600000002', 'MULTI_SCHEME_APPLICATION'),
      /CONSENT_SIGNATURE_INVALID/
    );
  });

  it('revokes consent synchronously, returns a minimal receipt, and blocks reuse before adapters', async () => {
    const session = await login();
    const consent = await grant(session, 'DASHBOARD_VIEW');
    await server.inject({
      method: 'GET',
      url: '/api/v1/dashboard',
      headers: { cookie: session.cookie, 'x-consent-id': consent.consentId },
    });
    const revoked = await server.inject({
      method: 'DELETE',
      url: `/api/v1/consents/${consent.consentId}`,
      headers: {
        origin: ORIGIN,
        cookie: session.cookie,
        'x-csrf-token': session.csrf,
      },
      payload: { confirmation: 'WITHDRAW_AND_PURGE', locale: 'en' },
    });
    assert.equal(revoked.statusCode, 200, revoked.body);
    assert.equal(revoked.json().purge.status, 'COMPLETED');
    assert.equal(revoked.json().purge.digestMeaning, 'INTEGRITY_RECEIPT_NOT_PHYSICAL_DELETION_PROOF');
    assert.ok(revoked.json().purge.categories.dashboardCachesDeleted >= 1);

    const relogin = await login();
    const calls = runtime.landRecords.providerCalls.count;
    const reused = await server.inject({
      method: 'GET',
      url: '/api/v1/dashboard',
      headers: { cookie: relogin.cookie, 'x-consent-id': consent.consentId },
    });
    assert.equal(reused.statusCode, 403);
    assert.equal(reused.json().error.code, 'CONSENT_REVOKED');
    assert.equal(runtime.landRecords.providerCalls.count, calls);
  });

  it('requires exact origin and session-bound CSRF for mutations', async () => {
    const session = await login();
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/v1/users/me/preferences',
      headers: { origin: 'http://attacker.invalid', cookie: session.cookie, 'x-csrf-token': session.csrf },
      payload: { locale: 'mr' },
    });
    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error.details.reason, 'CSRF_ORIGIN_CHECK_FAILED');
  });
});

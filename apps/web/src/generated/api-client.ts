/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: packages/contracts/src/api/routes.ts and tools/codegen/src/generate-api-client.ts
 */
import { apiRoutes } from '@krishisetu/contracts';

export class KrishiSetuApiError extends Error {
  constructor(
    readonly code: string,
    readonly messageKey: string,
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'KrishiSetuApiError';
  }
}

export class KrishiSetuApiClient {
  private csrfToken: string | null = null;
  private dashboardConsentId: string | null = null;
  private applicationConsentId: string | null = null;

  constructor(private readonly baseUrl: string) {}

  get activeConsentId(): string | null {
    return this.applicationConsentId ?? this.dashboardConsentId;
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
    options: { csrf?: boolean; consentId?: string | null; idempotencyKey?: string } = {}
  ): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body) headers.set('Content-Type', 'application/json');
    if (options.csrf && this.csrfToken) headers.set('X-CSRF-Token', this.csrfToken);
    if (options.consentId) headers.set('X-Consent-Id', options.consentId);
    if (options.idempotencyKey) headers.set('Idempotency-Key', options.idempotencyKey);
    const target = this.baseUrl.startsWith('http')
      ? new URL(path, this.baseUrl).toString()
      : `${this.baseUrl.replace(/\/$/, '')}${path}`;
    const response = await fetch(target, {
      ...init,
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      const error = (payload.error ?? {}) as Record<string, unknown>;
      throw new KrishiSetuApiError(
        String(error.code ?? 'INTERNAL_SERVER_ERROR'),
        String(error.messageKey ?? 'errors.common.internalError'),
        response.status,
        String(error.message ?? 'Request failed')
      );
    }
    return payload as T;
  }

  async login(input: { farmerId: string; demoPin: string; locale: string }) {
    const result = await this.request<{
      session: { expiresAt: string; csrfToken: string };
      farmer: { displayName: Record<string, string> };
    }>(apiRoutes.authLogin, { method: 'POST', body: JSON.stringify(input) });
    this.csrfToken = result.session.csrfToken;
    return result;
  }

  async restore() {
    const me = await this.request<{ data: {
      profile: { preferences: Record<string, unknown> };
      session: { farmerId: string; expiresAt: string; csrfToken: string };
      farmer: { displayName: Record<string, string> };
    }}>(apiRoutes.usersMe);
    this.csrfToken = me.data.session.csrfToken;
    const [dashboardConsent, applicationConsent, bundles] = await Promise.all([
      this.currentConsent('DASHBOARD_VIEW'),
      this.currentConsent('MULTI_SCHEME_APPLICATION'),
      this.listBundles(),
    ]);
    this.dashboardConsentId = dashboardConsent?.consentId ?? null;
    this.applicationConsentId = applicationConsent?.consentId ?? null;
    const dashboard = this.dashboardConsentId ? await this.dashboard() : null;
    return { me: me.data, dashboardConsent, applicationConsent, bundles, dashboard };
  }

  async currentConsent(purposeCode: string) {
    const query = new URLSearchParams({ purposeCode });
    const result = await this.request<{ data: {
      consentId: string; grantedAt: string; validUntil: string; scopes: string[]; purposeCode: string;
    } | null }>(`${apiRoutes.consentsCurrent}?${query.toString()}`);
    return result.data;
  }

  async listBundles() {
    const result = await this.request<{
      data: import('@krishisetu/applications').ApplicationBundle[];
    }>(apiRoutes.applicationBundles);
    return result.data;
  }

  async updatePreferences(patch: Record<string, unknown>) {
    const result = await this.request<{ data: Record<string, unknown> }>(
      apiRoutes.usersMePreferences,
      { method: 'PATCH', body: JSON.stringify(patch) },
      { csrf: true }
    );
    return result.data;
  }

  async grantConsent(input: Record<string, unknown>) {
    const result = await this.request<{ consent: {
      consentId: string; grantedAt: string; validUntil: string; scopes: string[]; purposeCode: string;
    }}>(apiRoutes.consents, { method: 'POST', body: JSON.stringify(input) }, { csrf: true });
    if (result.consent.purposeCode === 'DASHBOARD_VIEW') {
      this.dashboardConsentId = result.consent.consentId;
    } else if (result.consent.purposeCode === 'MULTI_SCHEME_APPLICATION') {
      this.applicationConsentId = result.consent.consentId;
    }
    return result.consent;
  }

  dashboard(refreshDomains?: readonly string[]) {
    return refreshDomains
      ? this.request<Record<string, unknown>>(
          apiRoutes.dashboardRefresh,
          { method: 'POST', body: JSON.stringify({ domains: refreshDomains }) },
          { csrf: true, consentId: this.dashboardConsentId }
        )
      : this.request<Record<string, unknown>>(
          apiRoutes.dashboard,
          {},
          { consentId: this.dashboardConsentId }
        );
  }

  submitBundle(input: Record<string, unknown>, idempotencyKey: string) {
    return this.request<{ bundle: import('@krishisetu/applications').ApplicationBundle }>(
      apiRoutes.applicationBundles,
      { method: 'POST', body: JSON.stringify(input) },
      { csrf: true, consentId: this.applicationConsentId, idempotencyKey }
    );
  }

  retryBundle(bundleId: string, idempotencyKey: string) {
    return this.request<{ bundle: import('@krishisetu/applications').ApplicationBundle }>(
      apiRoutes.applicationBundleRetry(bundleId),
      { method: 'POST', body: JSON.stringify({}) },
      { csrf: true, consentId: this.applicationConsentId, idempotencyKey }
    );
  }

  async revoke(consentId: string) {
    const result = await this.request<{ purge: Record<string, unknown> }>(
      apiRoutes.consentById(consentId),
      { method: 'DELETE', body: JSON.stringify({ confirmation: 'WITHDRAW_AND_PURGE' }) },
      { csrf: true }
    );
    if (this.dashboardConsentId === consentId) this.dashboardConsentId = null;
    if (this.applicationConsentId === consentId) this.applicationConsentId = null;
    this.csrfToken = null;
    return result.purge;
  }

  async logout(): Promise<void> {
    if (!this.csrfToken) return;
    await this.request(apiRoutes.authLogout, { method: 'POST', body: JSON.stringify({}) }, { csrf: true });
    this.csrfToken = null;
    this.dashboardConsentId = null;
    this.applicationConsentId = null;
  }
}

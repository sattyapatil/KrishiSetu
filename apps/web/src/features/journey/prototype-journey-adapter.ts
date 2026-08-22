import { consentPurposes } from '@krishisetu/policy';
import type { ApplicationBundle } from '@krishisetu/applications';
import type {
  PrototypeJourneyAdapter,
  PrototypeSession,
  PrototypeSessionResult,
  PrototypeConsentInput,
  PrototypeConsentResult,
  PrototypeBundleInput,
  PrototypeBundleResult,
  PrototypeWithdrawalResult,
} from '@krishisetu/testing';
import { KrishiSetuApiClient, KrishiSetuApiError } from '../../generated/api-client.js';

const OFFERINGS = {
  offering_drip_2026: {
    offeringId: 'offering_mahadbt_drip_2026',
    domain: 'MAHADBT',
    schemeCode: 'MAHADBT_DRIP',
  },
  offering_mahadbt_drip_2026: {
    offeringId: 'offering_mahadbt_drip_2026',
    domain: 'MAHADBT',
    schemeCode: 'MAHADBT_DRIP',
  },
  offering_rotavator_2026: {
    offeringId: 'offering_mahadbt_mechanization_2026',
    domain: 'MAHADBT',
    schemeCode: 'SMAM_ROTAVATOR',
  },
  offering_kcc_2026: {
    offeringId: 'offering_uli_kcc_2026',
    domain: 'ULI',
    schemeCode: 'KCC_CROP_LOAN',
  },
  offering_uli_kcc_2026: {
    offeringId: 'offering_uli_kcc_2026',
    domain: 'ULI',
    schemeCode: 'KCC_CROP_LOAN',
  },
} as const;

export class ApiPrototypeJourneyAdapter implements PrototypeJourneyAdapter {
  private readonly client: KrishiSetuApiClient;
  private currentSession: PrototypeSession | null = null;
  private bundles = new Map<string, ApplicationBundle>();
  private dashboardSnapshot: Record<string, unknown> | null = null;

  constructor(baseUrl = '/backend') {
    this.client = new KrishiSetuApiClient(baseUrl);
  }

  async restoreSession(): Promise<PrototypeSessionResult> {
    try {
      const restored = await this.client.restore();
      this.bundles = new Map(restored.bundles.map((bundle) => [bundle.bundleId, bundle]));
      this.dashboardSnapshot = restored.dashboard;
      const dashboardConsent = restored.dashboardConsent;
      const activeConsent = restored.applicationConsent ?? dashboardConsent;
      this.currentSession = {
        farmerId: restored.me.session.farmerId,
        farmerName:
          restored.me.farmer.displayName.en ??
          Object.values(restored.me.farmer.displayName)[0] ??
          '',
        sessionStartedAt: new Date().toISOString(),
        dashboardConsentGranted: Boolean(dashboardConsent),
        dashboardConsentScopes: dashboardConsent?.scopes ?? [],
        selectedOfferingIds: [],
        activeConsentId: activeConsent?.consentId,
        activeBundleId: restored.bundles[0]?.bundleId,
      };
      return { success: true, session: this.currentSession };
    } catch (error) {
      this.currentSession = null;
      this.dashboardSnapshot = null;
      return {
        success: false,
        errorMessageKey:
          error instanceof KrishiSetuApiError
            ? error.messageKey
            : 'auth.apiUnavailable',
      };
    }
  }

  async updatePreferences(patch: Record<string, unknown>): Promise<void> {
    try {
      await this.client.updatePreferences(patch);
    } catch {
      // Local accessibility and locale changes remain usable if the session expired.
    }
  }

  async startSession(personaId: string, pin: string): Promise<PrototypeSessionResult> {
    try {
      const response = await this.client.login({ farmerId: personaId, demoPin: pin, locale: 'en' });
      this.currentSession = {
        farmerId: personaId,
        farmerName: response.farmer.displayName.en ?? Object.values(response.farmer.displayName)[0] ?? '',
        sessionStartedAt: new Date().toISOString(),
        dashboardConsentGranted: false,
        dashboardConsentScopes: [],
        selectedOfferingIds: [],
      };
      return { success: true, session: this.currentSession };
    } catch (error) {
      return {
        success: false,
        errorMessageKey:
          error instanceof KrishiSetuApiError
            ? error.messageKey
            : 'errors.common.temporarilyUnavailable',
      };
    }
  }

  async grantDashboardConsent(
    _input: PrototypeConsentInput | readonly string[]
  ): Promise<PrototypeConsentResult> {
    if (!this.currentSession) throw new Error('UNAUTHORIZED');
    const purpose = consentPurposes.DASHBOARD_VIEW;
    const consent = await this.client.grantConsent({
      purposeCode: purpose.code,
      purposeVersion: purpose.version,
      scopes: purpose.requiredScopes,
      validForSeconds: purpose.defaultDurationSeconds,
      locale: 'en',
      noticeAcknowledged: true,
    });
    this.dashboardSnapshot = await this.client.dashboard();
    this.currentSession = {
      ...this.currentSession,
      dashboardConsentGranted: true,
      dashboardConsentScopes: consent.scopes,
      activeConsentId: consent.consentId,
    };
    return {
      consentId: consent.consentId,
      farmerId: this.currentSession.farmerId,
      grantedAt: consent.grantedAt,
      expiresAt: consent.validUntil,
      scopes: consent.scopes,
      purpose: consent.purposeCode,
      prototypeData: true,
      source: 'SYNTHETIC_MOCK',
    };
  }

  async submitBundle(command: PrototypeBundleInput): Promise<PrototypeBundleResult> {
    if (!this.currentSession) {
      return {
        success: false,
        scenario: 'UNAVAILABLE',
        errorMessageKey: 'errors.identity.sessionRequired',
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    }
    try {
      const purpose = consentPurposes.MULTI_SCHEME_APPLICATION;
      const consent = await this.client.grantConsent({
        purposeCode: purpose.code,
        purposeVersion: purpose.version,
        scopes: purpose.requiredScopes,
        validForSeconds: purpose.defaultDurationSeconds,
        locale: 'en',
        noticeAcknowledged: true,
      });
      const selected = command.selectedOfferingIds ?? command.offeringIds ?? [];
      const selections = selected.map(
        (offeringId) => OFFERINGS[offeringId as keyof typeof OFFERINGS]
      ).filter(Boolean);
      const response = await this.client.submitBundle(
        {
          dashboardCorrelationId: 'browser-generated-client',
          selections,
          declarations: {
            reviewedPrefilledData:
              command.declarationConfirmed ?? command.declarationAffirmed ?? false,
            understandsPrototype: true,
          },
        },
        command.idempotencyKey ?? globalThis.crypto.randomUUID()
      );
      this.bundles.set(response.bundle.bundleId, response.bundle);
      this.currentSession = {
        ...this.currentSession,
        activeBundleId: response.bundle.bundleId,
        activeConsentId: consent.consentId,
      };
      return {
        success: true,
        scenario: response.bundle.status === 'COMPLETED' ? 'COMPLETED' : 'PARTIAL_RETRYABLE',
        bundle: response.bundle,
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    } catch (error) {
      return {
        success: false,
        scenario: 'UNAVAILABLE',
        errorMessageKey:
          error instanceof KrishiSetuApiError
            ? error.messageKey
            : 'errors.common.temporarilyUnavailable',
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    }
  }

  async retryChild(bundleId: string, _childId: string): Promise<PrototypeBundleResult> {
    try {
      const response = await this.client.retryBundle(bundleId, globalThis.crypto.randomUUID());
      this.bundles.set(bundleId, response.bundle);
      return {
        success: true,
        scenario: response.bundle.status === 'COMPLETED' ? 'COMPLETED' : 'PARTIAL_RETRYABLE',
        bundle: response.bundle,
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    } catch (error) {
      return {
        success: false,
        scenario: 'UNAVAILABLE',
        errorMessageKey:
          error instanceof KrishiSetuApiError ? error.messageKey : 'errors.common.temporarilyUnavailable',
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    }
  }

  async simulateWithdrawal(consentId: string): Promise<PrototypeWithdrawalResult> {
    const activeConsentId = this.client.activeConsentId ?? consentId;
    const purge = await this.client.revoke(activeConsentId);
    const categories = (purge.categories ?? {}) as Record<string, number>;
    const categoryLabels: Record<string, string> = {
      dashboardCachesDeleted: 'Dashboard caches deleted',
      normalizedSnapshotsDeleted: 'Provider snapshots deleted',
      draftBundlesDeleted: 'Draft bundles deleted',
      incompleteApplicationsDeleted: 'Incomplete applications deleted',
      temporaryAttachmentsDeleted: 'Temporary attachments deleted',
      completedReceiptsPseudonymized: 'Completed receipts pseudonymized',
      sessionsInvalidated: 'Demo sessions invalidated',
    };
    const targets = Object.entries(categories).map(
      ([category, count]) => `${categoryLabels[category] ?? category}: ${count}`
    );
    this.currentSession = null;
    return {
      receiptId: String(purge.purgeJobId),
      consentId: activeConsentId,
      simulatedAt: String(purge.processingStoppedAt),
      wording: 'Prototype withdrawal completed for derived synthetic records.',
      messageKey: 'privacy.withdrawalSimulatedBody',
      purgedTargets: targets,
      simulatedTargets: targets,
      prototypeData: true,
      source: 'SYNTHETIC_MOCK',
    };
  }

  getBundle(bundleId: string): ApplicationBundle | undefined {
    return this.bundles.get(bundleId);
  }

  listBundles(): readonly ApplicationBundle[] {
    return [...this.bundles.values()].reverse();
  }

  getActiveSession(): PrototypeSession | null {
    return this.currentSession;
  }

  getDashboardSnapshot(): Record<string, unknown> | null {
    return this.dashboardSnapshot;
  }

  resetSession(): void {
    void this.client.logout();
    this.currentSession = null;
    this.bundles.clear();
    this.dashboardSnapshot = null;
  }
}

export const defaultPrototypeAdapter = new ApiPrototypeJourneyAdapter();

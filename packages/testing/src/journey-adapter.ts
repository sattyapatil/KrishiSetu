import { Clock, FixedClock } from '@krishisetu/core';
import { ApplicationBundle, ChildApplicationReceipt } from '@krishisetu/applications';
import { SYNTHETIC_DEMO_FARMERS } from './fixtures.js';
import {
  PrototypeJourneyAdapter,
  PrototypeSession,
  PrototypeSessionResult,
  PrototypeConsentInput,
  PrototypeConsentResult,
  PrototypeBundleInput,
  PrototypeBundleResult,
  PrototypeWithdrawalResult,
  PrototypeScenario,
} from './journey-types.js';

export class InMemoryPrototypeJourneyAdapter implements PrototypeJourneyAdapter {
  private clock: Clock;
  private currentSession: PrototypeSession | null = null;
  private bundles: Map<string, ApplicationBundle> = new Map();
  private bundlesByIdempotency: Map<string, string> = new Map();
  private selectedOfferings: Set<string> = new Set();
  private bundleCounter = 81;

  constructor(clock: Clock = new FixedClock('2026-08-22T09:00:00Z')) {
    this.clock = clock;
    this.seedDefaultBundle();
  }

  private seedDefaultBundle(): void {
    const defaultBundle: ApplicationBundle = {
      bundleId: 'BND-2026-000081',
      idempotencyKey: 'IDEMP-BND-2026-000081',
      status: 'COMPLETED',
      submittedAt: '2026-08-22 09:00:00 IST',
      children: [
        {
          childId: 'CH-MDBT-01',
          domain: 'MAHADBT',
          schemeCode: 'drip_irrigation_2026',
          status: 'ACCEPTED_MOCK',
          providerReceipt: 'MOCK-MDBT-332101',
          nextStepKey: 'applications.nextSteps',
          retryable: false,
        },
        {
          childId: 'CH-ULI-01',
          domain: 'ULI',
          schemeCode: 'kcc_crop_loan_2026',
          status: 'ACCEPTED_MOCK',
          providerReceipt: 'MOCK-ULI-771902',
          nextStepKey: 'applications.nextSteps',
          retryable: false,
        },
      ],
      prototypeData: true,
    };
    this.bundles.set(defaultBundle.bundleId, defaultBundle);
    this.bundlesByIdempotency.set(defaultBundle.idempotencyKey, defaultBundle.bundleId);
  }

  async startSession(personaId: string, pin: string): Promise<PrototypeSessionResult> {
    const farmer = SYNTHETIC_DEMO_FARMERS.find((f) => f.farmerId === personaId);
    if (!farmer) {
      return {
        success: false,
        errorMessageKey: 'errors.identity.farmerNotFound',
      };
    }

    if (pin !== '2468') {
      return {
        success: false,
        errorMessageKey: 'errors.identity.invalidPin',
      };
    }

    this.currentSession = {
      farmerId: farmer.farmerId,
      farmerName: farmer.name.en,
      sessionStartedAt: this.clock.isoString(),
      dashboardConsentGranted: false,
      dashboardConsentScopes: [],
      selectedOfferingIds: [],
    };

    return {
      success: true,
      session: this.currentSession,
    };
  }

  async grantDashboardConsent(
    input: PrototypeConsentInput | readonly string[]
  ): Promise<PrototypeConsentResult> {
    const isArray = Array.isArray(input);
    const farmerId = isArray
      ? this.currentSession?.farmerId || '27202600000001'
      : (input as PrototypeConsentInput).farmerId || this.currentSession?.farmerId || '27202600000001';
    const grantedScopes = isArray
      ? (input as readonly string[])
      : (input as PrototypeConsentInput).grantedScopes;
    const purpose = isArray
      ? 'DASHBOARD_VIEW'
      : (input as PrototypeConsentInput).purpose || 'DASHBOARD_VIEW';
    const grantedAt = this.clock.isoString();
    const expiresAt = new Date(this.clock.now().getTime() + 30 * 60 * 1000).toISOString();
    const consentId = `CNS-2026-${farmerId.slice(-4)}`;

    if (this.currentSession) {
      this.currentSession = {
        ...this.currentSession,
        dashboardConsentGranted: true,
        dashboardConsentScopes: grantedScopes,
      };
    }

    return {
      consentId,
      farmerId,
      grantedAt,
      expiresAt,
      scopes: grantedScopes,
      purpose,
      prototypeData: true,
      source: 'SYNTHETIC_MOCK',
    };
  }

  async submitBundle(input: PrototypeBundleInput): Promise<PrototypeBundleResult> {
    const declarationConfirmed = input.declarationConfirmed ?? input.declarationAffirmed ?? false;
    const farmerId = input.farmerId || this.currentSession?.farmerId || '27202600000001';
    const offeringIds = input.selectedOfferingIds ?? input.offeringIds ?? Array.from(this.selectedOfferings);

    if (!declarationConfirmed) {
      return {
        success: false,
        scenario: 'UNAVAILABLE',
        errorMessageKey: 'errors.journey.declarationRequired',
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    }

    if (offeringIds.length === 0) {
      return {
        success: false,
        scenario: 'UNAVAILABLE',
        errorMessageKey: 'errors.journey.noOfferingsSelected',
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    }

    // Idempotency check
    if (input.idempotencyKey && this.bundlesByIdempotency.has(input.idempotencyKey)) {
      const existingId = this.bundlesByIdempotency.get(input.idempotencyKey)!;
      const existingBundle = this.bundles.get(existingId);
      if (existingBundle) {
        return {
          success: true,
          scenario: existingBundle.status === 'COMPLETED' ? 'COMPLETED' : 'PARTIAL_RETRYABLE',
          bundle: existingBundle,
          prototypeData: true,
          source: 'SYNTHETIC_MOCK',
        };
      }
    }

    let scenario: PrototypeScenario = input.requestedScenario ?? 'COMPLETED';
    if (!input.requestedScenario && farmerId === '27202600000003') {
      scenario = 'PARTIAL_RETRYABLE';
    }

    const bundleId = `BND-2026-${this.bundleCounter.toString().padStart(6, '0')}`;
    this.bundleCounter += 1;

    const children: ChildApplicationReceipt[] = [];

    for (const offeringId of offeringIds) {
      if (offeringId.includes('kcc') || offeringId.includes('credit')) {
        if (scenario === 'PARTIAL_RETRYABLE') {
          children.push({
            childId: `child_uli_${bundleId.slice(-3)}`,
            domain: 'ULI',
            schemeCode: offeringId,
            status: 'FAILED_RETRYABLE',
            errorCode: 'TIMEOUT_RETRYABLE',
            nextStepKey: 'applications.nextSteps',
            retryable: true,
          });
        } else {
          children.push({
            childId: `child_uli_${bundleId.slice(-3)}`,
            domain: 'ULI',
            schemeCode: offeringId,
            status: 'ACCEPTED_MOCK',
            providerReceipt: `MOCK-ULI-${Math.floor(100000 + Math.random() * 900000)}`,
            nextStepKey: 'applications.nextSteps',
            retryable: false,
          });
        }
      } else {
        children.push({
          childId: `child_mahadbt_${bundleId.slice(-3)}`,
          domain: 'MAHADBT',
          schemeCode: offeringId,
          status: 'ACCEPTED_MOCK',
          providerReceipt: `MOCK-MDBT-${Math.floor(100000 + Math.random() * 900000)}`,
          nextStepKey: 'applications.nextSteps',
          retryable: false,
        });
      }
    }

    const overallStatus = children.every((c) => c.status === 'ACCEPTED_MOCK')
      ? 'COMPLETED'
      : 'PARTIAL';

    const idempotencyKey = input.idempotencyKey || `IDEMP-${bundleId}`;

    const newBundle: ApplicationBundle = {
      bundleId,
      idempotencyKey,
      status: overallStatus,
      submittedAt: this.clock.isoString().replace('T', ' ').slice(0, 19) + ' IST',
      children,
      prototypeData: true,
    };

    this.bundles.set(bundleId, newBundle);
    this.bundlesByIdempotency.set(idempotencyKey, bundleId);

    if (this.currentSession) {
      this.currentSession = {
        ...this.currentSession,
        activeBundleId: bundleId,
      };
    }

    return {
      success: true,
      scenario,
      bundle: newBundle,
      prototypeData: true,
      source: 'SYNTHETIC_MOCK',
    };
  }

  async retryChild(bundleId: string, childId: string): Promise<PrototypeBundleResult> {
    const bundle = this.bundles.get(bundleId);
    if (!bundle) {
      return {
        success: false,
        scenario: 'UNAVAILABLE',
        errorMessageKey: 'errors.bundleNotFound',
        prototypeData: true,
        source: 'SYNTHETIC_MOCK',
      };
    }

    const updatedChildren = bundle.children.map((c) => {
      if (c.childId === childId) {
        return {
          ...c,
          status: 'ACCEPTED_MOCK' as const,
          providerReceipt: `MOCK-ULI-RETRY-${Math.floor(100000 + Math.random() * 900000)}`,
          retryable: false,
        };
      }
      return c;
    });

    const isAllCompleted = updatedChildren.every((c) => c.status === 'ACCEPTED_MOCK');
    const updatedBundle: ApplicationBundle = {
      ...bundle,
      status: isAllCompleted ? 'COMPLETED' : 'PARTIAL',
      children: updatedChildren,
    };

    this.bundles.set(bundleId, updatedBundle);

    return {
      success: true,
      scenario: 'COMPLETED',
      bundle: updatedBundle,
      prototypeData: true,
      source: 'SYNTHETIC_MOCK',
    };
  }

  async simulateWithdrawal(consentId: string): Promise<PrototypeWithdrawalResult> {
    const receiptId = `RCP-PURGE-2026-${Math.floor(100 + Math.random() * 900)}`;
    const simulatedAt = this.clock.isoString();

    const targets = [
      'Mahabhumi 7/12 Dashboard Read Model Cache (1 record)',
      'Crop Survey Normalized Snapshot (2 seasonal crop records)',
      'Bank Direct Benefit Transfer Mapping Cache (1 record)',
      'Unsubmitted Application Draft Snapshots (0 records)',
    ];

    const result: PrototypeWithdrawalResult = {
      receiptId,
      consentId,
      simulatedAt,
      wording: 'Prototype withdrawal completed for derived synthetic state.',
      messageKey: 'privacy.withdrawalSimulatedBody',
      purgedTargets: targets,
      simulatedTargets: targets,
      prototypeData: true,
      source: 'SYNTHETIC_MOCK',
    };

    if (this.currentSession) {
      this.currentSession = null;
    }
    this.selectedOfferings.clear();

    return result;
  }

  getBundle(bundleId: string): ApplicationBundle | undefined {
    return this.bundles.get(bundleId);
  }

  listBundles(): readonly ApplicationBundle[] {
    return Array.from(this.bundles.values()).reverse();
  }

  getActiveSession(): PrototypeSession | null {
    return this.currentSession;
  }

  resetSession(): void {
    this.currentSession = null;
    this.selectedOfferings.clear();
  }
}

export const defaultPrototypeAdapter = new InMemoryPrototypeJourneyAdapter();

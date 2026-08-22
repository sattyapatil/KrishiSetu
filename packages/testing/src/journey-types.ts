import { ApplicationBundle } from '@krishisetu/applications';

export type PrototypeScenario = 'COMPLETED' | 'PARTIAL_RETRYABLE' | 'UNAVAILABLE';

export interface PrototypeSession {
  readonly farmerId: string;
  readonly farmerName: string;
  readonly sessionStartedAt: string;
  readonly dashboardConsentGranted: boolean;
  readonly dashboardConsentScopes: readonly string[];
  readonly selectedOfferingIds: readonly string[];
  readonly activeBundleId?: string;
  readonly activeWithdrawalReceipt?: PrototypeWithdrawalResult;
}

export interface PrototypeSessionResult {
  readonly success: boolean;
  readonly session?: PrototypeSession;
  readonly errorMessageKey?: string;
}

export interface PrototypeConsentInput {
  readonly farmerId?: string;
  readonly grantedScopes: readonly string[];
  readonly purpose?: 'DASHBOARD_VIEW' | 'MULTI_SCHEME_APPLICATION';
}

export interface PrototypeConsentResult {
  readonly consentId: string;
  readonly farmerId: string;
  readonly grantedAt: string;
  readonly expiresAt: string;
  readonly scopes: readonly string[];
  readonly purpose: string;
  readonly prototypeData: true;
  readonly source: 'SYNTHETIC_MOCK';
}

export interface PrototypeBundleInput {
  readonly farmerId?: string;
  readonly selectedOfferingIds?: readonly string[];
  readonly offeringIds?: readonly string[];
  readonly applicationConsentScopes?: readonly string[];
  readonly applicationScopesGranted?: readonly string[];
  readonly declarationConfirmed?: boolean;
  readonly declarationAffirmed?: boolean;
  readonly idempotencyKey?: string;
  readonly requestedScenario?: PrototypeScenario;
}

export interface PrototypeBundleResult {
  readonly success: boolean;
  readonly scenario: PrototypeScenario;
  readonly bundle?: ApplicationBundle;
  readonly errorMessageKey?: string;
  readonly prototypeData: true;
  readonly source: 'SYNTHETIC_MOCK';
}

export interface PrototypeWithdrawalResult {
  readonly receiptId: string;
  readonly consentId: string;
  readonly simulatedAt: string;
  readonly wording: string;
  readonly messageKey: string;
  readonly purgedTargets: readonly string[];
  readonly simulatedTargets: readonly string[];
  readonly prototypeData: true;
  readonly source: 'SYNTHETIC_MOCK';
}

export interface PrototypeJourneyAdapter {
  startSession(personaId: string, pin: string): Promise<PrototypeSessionResult>;
  grantDashboardConsent(input: PrototypeConsentInput | readonly string[]): Promise<PrototypeConsentResult>;
  submitBundle(input: PrototypeBundleInput): Promise<PrototypeBundleResult>;
  retryChild(bundleId: string, childId: string): Promise<PrototypeBundleResult>;
  simulateWithdrawal(consentId: string): Promise<PrototypeWithdrawalResult>;
  getBundle(bundleId: string): ApplicationBundle | undefined;
  listBundles(): readonly ApplicationBundle[];
  getActiveSession(): PrototypeSession | null;
  resetSession(): void;
}

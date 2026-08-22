import { Clock } from '@krishisetu/core';
import { ApplicationBundle } from '@krishisetu/applications';
import { PrototypeJourneyAdapter, PrototypeSession, PrototypeSessionResult, PrototypeConsentInput, PrototypeConsentResult, PrototypeBundleInput, PrototypeBundleResult, PrototypeWithdrawalResult } from './types.js';
export declare class InMemoryPrototypeJourneyAdapter implements PrototypeJourneyAdapter {
    private clock;
    private currentSession;
    private bundles;
    private bundlesByIdempotency;
    private selectedOfferings;
    private bundleCounter;
    constructor(clock?: Clock);
    private seedDefaultBundle;
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
export declare const defaultPrototypeAdapter: InMemoryPrototypeJourneyAdapter;
//# sourceMappingURL=prototype-journey-adapter.d.ts.map
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  PrototypeJourneyAdapter,
  PrototypeSession,
  PrototypeSessionResult,
  PrototypeConsentResult,
  PrototypeBundleResult,
  PrototypeWithdrawalResult,
  PrototypeScenario,
} from './types.js';
import { defaultJourneyAdapter } from './journey-adapter-factory.js';
import type { CompositeDashboardModel } from '@krishisetu/dashboard';

interface JourneyContextValue {
  session: PrototypeSession | null;
  adapter: PrototypeJourneyAdapter;
  selectedOfferings: Set<string>;
  toggleOffering: (offeringId: string) => void;
  clearOfferings: () => void;
  setOfferings: (offerings: string[]) => void;
  startSession: (personaId: string, pin: string) => Promise<PrototypeSessionResult>;
  grantDashboardConsent: (scopes: string[]) => Promise<PrototypeConsentResult>;
  submitBundle: (
    declarationConfirmed: boolean,
    scopes: string[],
    scenario?: PrototypeScenario,
    offeringIds?: readonly string[]
  ) => Promise<PrototypeBundleResult>;
  retryChild: (bundleId: string, childId: string) => Promise<PrototypeBundleResult>;
  simulateWithdrawal: (consentId: string) => Promise<PrototypeWithdrawalResult>;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  logout: () => void;
  dashboardSnapshot: CompositeDashboardModel | null;
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

export function JourneyProvider({
  children,
  adapter = defaultJourneyAdapter,
}: {
  children: React.ReactNode;
  adapter?: PrototypeJourneyAdapter;
}): React.JSX.Element {
  const [session, setSession] = useState<PrototypeSession | null>(null);
  const [selectedOfferings, setSelectedOfferings] = useState<Set<string>>(new Set());
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [dashboardSnapshot, setDashboardSnapshot] = useState<CompositeDashboardModel | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('ks_selected_offerings');
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
          setSelectedOfferings(new Set(parsed));
        }
      }
    } catch {
      // Selection persistence is an optional browser convenience.
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!adapter.restoreSession) return () => { active = false; };
    void adapter.restoreSession().then((result) => {
      if (!active || !result.success || !result.session) return;
      setSession((current) => current ?? result.session ?? null);
      const apiAdapter = adapter as PrototypeJourneyAdapter & {
        getDashboardSnapshot?: () => Record<string, unknown> | null;
      };
      setDashboardSnapshot(
        (apiAdapter.getDashboardSnapshot?.() as unknown as CompositeDashboardModel | null) ?? null
      );
    });
    return () => { active = false; };
  }, [adapter]);

  // Load accessibility preferences from sessionStorage if available in browser
  useEffect(() => {
    try {
      const hc = typeof window !== 'undefined' ? window.localStorage.getItem('ks_pref_high_contrast') : null;
      const rm = typeof window !== 'undefined' ? window.localStorage.getItem('ks_pref_reduced_motion') : null;
      if (hc === 'true') {
        setHighContrastState(true);
        document.documentElement.setAttribute('data-contrast', 'high');
      }
      if (rm === 'true') {
        setReducedMotionState(true);
        document.documentElement.setAttribute('data-motion', 'reduced');
      }
    } catch {
      // Ignore storage errors in non-browser environments
    }
  }, []);

  const setHighContrast = useCallback((val: boolean) => {
    setHighContrastState(val);
    try {
      if (val) {
        document.documentElement.setAttribute('data-contrast', 'high');
        window.localStorage.setItem('ks_pref_high_contrast', 'true');
      } else {
        document.documentElement.removeAttribute('data-contrast');
        window.localStorage.removeItem('ks_pref_high_contrast');
      }
    } catch {
      // ignore storage errors
    }
    void adapter.updatePreferences?.({ highContrast: val });
  }, [adapter]);

  const setReducedMotion = useCallback((val: boolean) => {
    setReducedMotionState(val);
    try {
      if (val) {
        document.documentElement.setAttribute('data-motion', 'reduced');
        window.localStorage.setItem('ks_pref_reduced_motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-motion');
        window.localStorage.removeItem('ks_pref_reduced_motion');
      }
    } catch {
      // ignore storage errors
    }
    void adapter.updatePreferences?.({ reducedMotion: val });
  }, [adapter]);

  const toggleOffering = useCallback((offeringId: string) => {
    setSelectedOfferings((prev) => {
      const next = new Set(prev);
      if (next.has(offeringId)) {
        next.delete(offeringId);
      } else {
        next.add(offeringId);
      }
      try {
        window.sessionStorage.setItem('ks_selected_offerings', JSON.stringify([...next]));
      } catch {
        // Ignore storage errors; in-memory selection still works.
      }
      return next;
    });
  }, []);

  const clearOfferings = useCallback(() => {
    setSelectedOfferings(new Set());
    try { window.sessionStorage.removeItem('ks_selected_offerings'); } catch {}
  }, []);

  const setOfferings = useCallback((offerings: string[]) => {
    setSelectedOfferings(new Set(offerings));
    try {
      window.sessionStorage.setItem('ks_selected_offerings', JSON.stringify(offerings));
    } catch {}
  }, []);

  const startSession = useCallback(
    async (personaId: string, pin: string): Promise<PrototypeSessionResult> => {
      const res = await adapter.startSession(personaId, pin);
      if (res.success && res.session) {
        setSession(res.session);
        setSelectedOfferings(new Set());
        try {
          window.sessionStorage.removeItem('ks_selected_offerings');
          window.sessionStorage.removeItem('ks_application_draft');
        } catch {}
      }
      return res;
    },
    [adapter]
  );

  const grantDashboardConsent = useCallback(
    async (scopes: string[]): Promise<PrototypeConsentResult> => {
      const farmerId = session?.farmerId ?? '27202600000001';
      const res = await adapter.grantDashboardConsent({
        farmerId,
        grantedScopes: scopes,
        purpose: 'DASHBOARD_VIEW',
      });
      const apiAdapter = adapter as PrototypeJourneyAdapter & {
        getDashboardSnapshot?: () => Record<string, unknown> | null;
      };
      setDashboardSnapshot(
        (apiAdapter.getDashboardSnapshot?.() as unknown as CompositeDashboardModel | null) ?? null
      );
      setSession((prev) =>
        prev
          ? {
              ...prev,
              dashboardConsentGranted: true,
              dashboardConsentScopes: res.scopes,
              activeConsentId: res.consentId,
            }
          : {
              farmerId,
              farmerName: 'Namdev Tukaram Shinde',
              sessionStartedAt: res.grantedAt,
              dashboardConsentGranted: true,
              dashboardConsentScopes: res.scopes,
              activeConsentId: res.consentId,
              selectedOfferingIds: [],
            }
      );
      return res;
    },
    [adapter, session]
  );

  const submitBundle = useCallback(
    async (
      declarationConfirmed: boolean,
      scopes: string[],
      scenario?: PrototypeScenario,
      offeringIds?: readonly string[]
    ): Promise<PrototypeBundleResult> => {
      const farmerId = session?.farmerId ?? '27202600000001';
      const offerings = offeringIds ? [...offeringIds] : Array.from(selectedOfferings);
      const res = await adapter.submitBundle({
        farmerId,
        selectedOfferingIds: offerings,
        applicationConsentScopes: scopes,
        declarationConfirmed,
        requestedScenario: scenario,
      });
      if (res.success && res.bundle) {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                activeBundleId: res.bundle?.bundleId,
              }
            : null
        );
        setSelectedOfferings(new Set());
        try {
          window.sessionStorage.removeItem('ks_selected_offerings');
          window.sessionStorage.removeItem('ks_application_draft');
        } catch {}
      }
      return res;
    },
    [adapter, session, selectedOfferings]
  );

  const retryChild = useCallback(
    async (bundleId: string, childId: string): Promise<PrototypeBundleResult> => {
      return adapter.retryChild(bundleId, childId);
    },
    [adapter]
  );

  const simulateWithdrawal = useCallback(
    async (consentId: string): Promise<PrototypeWithdrawalResult> => {
      const res = await adapter.simulateWithdrawal(consentId);
      try {
        window.sessionStorage.setItem('ks_withdrawal_receipt', JSON.stringify(res));
      } catch {}
      setSession((prev) =>
        prev
          ? {
              ...prev,
              dashboardConsentGranted: false,
              activeWithdrawalReceipt: res,
            }
          : null
      );
      setSelectedOfferings(new Set());
      try {
        window.sessionStorage.removeItem('ks_selected_offerings');
        window.sessionStorage.removeItem('ks_application_draft');
      } catch {}
      setDashboardSnapshot(null);
      return res;
    },
    [adapter]
  );

  const logout = useCallback(() => {
    adapter.resetSession();
    setSession(null);
    setSelectedOfferings(new Set());
    setDashboardSnapshot(null);
    try {
      window.sessionStorage.removeItem('ks_selected_offerings');
      window.sessionStorage.removeItem('ks_application_draft');
    } catch {}
  }, [adapter]);

  const value = useMemo(
    () => ({
      session,
      adapter,
      selectedOfferings,
      toggleOffering,
      clearOfferings,
      setOfferings,
      startSession,
      grantDashboardConsent,
      submitBundle,
      retryChild,
      simulateWithdrawal,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion,
      logout,
      dashboardSnapshot,
    }),
    [
      session,
      adapter,
      selectedOfferings,
      toggleOffering,
      clearOfferings,
      setOfferings,
      startSession,
      grantDashboardConsent,
      submitBundle,
      retryChild,
      simulateWithdrawal,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion,
      logout,
      dashboardSnapshot,
    ]
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return ctx;
}

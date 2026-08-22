'use client';

import React, { useState } from 'react';
import { Locale } from '@krishisetu/i18n';
import {
  AppShell,
  LoginView,
  ConsentView,
  DashboardView,
  ApplicationsView,
  PrivacyView,
} from '../src/index';

type ViewMode = 'login' | 'consent' | 'dashboard' | 'applications' | 'privacy';

export default function HomePage(): React.JSX.Element {
  const [locale, setLocale] = useState<Locale>('en');
  const [view, setView] = useState<ViewMode>('login');
  const [farmerId, setFarmerId] = useState<string>('27202600000001');
  const [farmerName, setFarmerName] = useState<string>('Namdev Tukaram Shinde');

  const handleLoginSuccess = (selectedId: string) => {
    setFarmerId(selectedId);
    if (selectedId === '27202600000002') {
      setFarmerName('Savitri Bai Patil');
    } else if (selectedId === '27202600000003') {
      setFarmerName('Ramesh Vithal Ghadge');
    } else {
      setFarmerName('Namdev Tukaram Shinde');
    }
    setView('consent');
  };

  const handleGrantConsent = (scopes: string[]) => {
    setView('dashboard');
  };

  const handleProceedToBundle = (selectedOfferings: string[]) => {
    setView('applications');
  };

  return (
    <AppShell
      locale={locale}
      onSelectLocale={setLocale}
      currentPath={`/${view}`}
    >
      {view === 'login' && (
        <LoginView
          locale={locale}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {view === 'consent' && (
        <ConsentView
          locale={locale}
          farmerName={farmerName}
          onGrantConsent={handleGrantConsent}
          onDenyConsent={() => setView('login')}
        />
      )}

      {view === 'dashboard' && (
        <DashboardView
          locale={locale}
          farmerId={farmerId}
          onProceedToBundle={handleProceedToBundle}
        />
      )}

      {view === 'applications' && (
        <ApplicationsView
          locale={locale}
          onReturnToDashboard={() => setView('dashboard')}
        />
      )}

      {view === 'privacy' && (
        <PrivacyView
          locale={locale}
          onRevokeConsent={() => {
            setTimeout(() => {
              setView('login');
            }, 3000);
          }}
        />
      )}
    </AppShell>
  );
}

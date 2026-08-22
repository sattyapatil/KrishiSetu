'use client';

import React from 'react';
import { Locale } from '@krishisetu/i18n';
import { DashboardViewModel } from './types/dashboard-view-model.js';
import { getDashboardViewModel } from './fixtures/dashboard-fixture.js';
import { DashboardHeaderSection } from './components/DashboardHeaderSection.js';
import { DashboardAttentionSection } from './components/DashboardAttentionSection.js';
import { DashboardApplicationsSection } from './components/DashboardApplicationsSection.js';
import { DashboardReadinessSection } from './components/DashboardReadinessSection.js';
import { DashboardWeatherSection } from './components/DashboardWeatherSection.js';
import { DashboardNoticesSection } from './components/DashboardNoticesSection.js';
import { DashboardTechnicalSection } from './components/DashboardTechnicalSection.js';
import { StickyApplicationBar } from './components/StickyApplicationBar.js';

export interface DashboardViewProps {
  readonly locale: Locale;
  readonly farmerId?: string;
  readonly viewModel?: DashboardViewModel;
}

export function DashboardView({
  locale,
  farmerId = '27202600000001',
  viewModel: initialViewModel,
}: DashboardViewProps): React.JSX.Element {
  const vm = initialViewModel ?? getDashboardViewModel(farmerId);
  const activeNotices = vm.notices.filter((n) => n.status === 'ACTIVE');

  return (
    <div
      className="ks-dashboard-container"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* 1. Farmer Identity & Notification Header */}
      <DashboardHeaderSection
        locale={locale}
        farmer={vm.farmer}
        noticeCount={activeNotices.length}
      />

      {/* 2. Urgent Attention Items */}
      <DashboardAttentionSection
        locale={locale}
        actionItems={vm.actionItems}
      />

      {/* 3. Continue or Start Application (Subsidies & Credit) */}
      <DashboardApplicationsSection
        locale={locale}
        schemes={vm.schemes}
        credit={vm.credit}
      />

      {/* 4. Agricultural Readiness Summary (Land, Crops, Bank) */}
      <DashboardReadinessSection
        locale={locale}
        farmer={vm.farmer}
      />

      {/* 5. District Weather and Agromet Advisory */}
      <DashboardWeatherSection
        locale={locale}
        weather={vm.weather}
      />

      {/* 6. Public Notices & Advisories */}
      <DashboardNoticesSection
        locale={locale}
        notices={vm.notices}
      />

      {/* 7. Collapsed Technical Trace */}
      <DashboardTechnicalSection
        locale={locale}
        technicalDetails={vm.technicalDetails}
      />

      {/* 8. Sticky Action Bar when selections exist */}
      <StickyApplicationBar locale={locale} />
    </div>
  );
}

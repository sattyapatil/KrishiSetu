'use client';

import React from 'react';
import { Locale } from '@krishisetu/i18n';
import { DashboardViewModel } from './types/dashboard-view-model.js';
import { getDashboardViewModel } from './fixtures/dashboard-fixture.js';
import { DashboardHeaderSection } from './components/DashboardHeaderSection.js';
import { DashboardAttentionSection } from './components/DashboardAttentionSection.js';
import { DashboardApplicationsSection } from './components/DashboardApplicationsSection.js';
import { DashboardReadinessSection } from './components/DashboardReadinessSection.js';
import { DashboardNoticesSection } from './components/DashboardNoticesSection.js';
import { DashboardTechnicalSection } from './components/DashboardTechnicalSection.js';
import { StickyApplicationBar } from './components/StickyApplicationBar.js';
import { DashboardProductivitySection } from './components/DashboardProductivitySection.js';
import { DashboardOverviewTiles } from './components/DashboardOverviewTiles.js';
import styles from './DashboardView.module.css';

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
    <div className={`${styles.dashboard} ks-dashboard-container`}>
      <DashboardHeaderSection
        locale={locale}
        farmer={vm.farmer}
        noticeCount={activeNotices.length}
      />

      <DashboardOverviewTiles locale={locale} weather={vm.weather} />

      <DashboardProductivitySection locale={locale} viewModel={vm} />

      <DashboardAttentionSection
        locale={locale}
        actionItems={vm.actionItems}
      />

      <DashboardApplicationsSection
        locale={locale}
        schemes={vm.schemes}
        credit={vm.credit}
      />

      <DashboardReadinessSection
        locale={locale}
        farmer={vm.farmer}
      />

      <DashboardNoticesSection
        locale={locale}
        notices={vm.notices}
      />

      <DashboardTechnicalSection
        locale={locale}
        technicalDetails={vm.technicalDetails}
      />

      <StickyApplicationBar locale={locale} />
    </div>
  );
}

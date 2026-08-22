'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { DashboardView } from '../../../src/features/dashboard/DashboardView.js';
import { AccessRequiredView } from '../../../src/components/AccessRequiredView.js';
import { useJourney } from '../../../src/features/journey/index.js';
import { mapDashboardApiToViewModel } from '../../../src/features/dashboard/dashboard-api-mapper.js';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): React.JSX.Element {
  const resolvedParams = use(params);
  const rawLocale = resolvedParams.locale;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const { session, dashboardSnapshot } = useJourney();

  if (!session || !session.dashboardConsentGranted) {
    return <AccessRequiredView locale={locale} />;
  }

  const viewModel = dashboardSnapshot
    ? mapDashboardApiToViewModel({
        model: dashboardSnapshot,
        farmerId: session.farmerId,
        locale,
        activeScopes: session.dashboardConsentScopes,
      })
    : undefined;

  return <DashboardView locale={locale} farmerId={session.farmerId} viewModel={viewModel} />;
}

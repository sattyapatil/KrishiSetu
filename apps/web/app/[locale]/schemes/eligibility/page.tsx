'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { EligibilityCheckView } from '../../../../src/features/schemes/EligibilityCheckView.js';
import { AccessRequiredView } from '../../../../src/components/AccessRequiredView.js';
import { useJourney } from '../../../../src/features/journey/index.js';

export default function EligibilityPage({ params }: { params: Promise<{ locale: string }> }): React.JSX.Element {
  const { locale: rawLocale } = use(params);
  if (!isSupportedLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { session } = useJourney();
  if (!session || !session.dashboardConsentGranted) return <AccessRequiredView locale={locale} />;
  return <EligibilityCheckView locale={locale} />;
}

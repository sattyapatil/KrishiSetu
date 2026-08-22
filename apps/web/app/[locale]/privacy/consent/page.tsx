'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { ConsentDetailView } from '../../../../src/features/privacy/ConsentDetailView.js';
import { AccessRequiredView } from '../../../../src/components/AccessRequiredView.js';
import { useJourney } from '../../../../src/features/journey/index.js';

export default function PrivacyConsentPage({
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
  const { session } = useJourney();

  if (!session || !session.dashboardConsentGranted) {
    return <AccessRequiredView locale={locale} />;
  }

  return <ConsentDetailView locale={locale} />;
}

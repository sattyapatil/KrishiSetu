'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { PrivacyView } from '../../../src/features/privacy/PrivacyView.js';
import { AccessRequiredView } from '../../../src/components/AccessRequiredView.js';
import { useJourney } from '../../../src/features/journey/index.js';

export default function PrivacyPage({
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

  return <PrivacyView locale={locale} />;
}

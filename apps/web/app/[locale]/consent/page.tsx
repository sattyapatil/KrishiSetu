'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { ConsentView } from '../../../src/features/consent/ConsentView.js';
import { useJourney } from '../../../src/features/journey/index.js';

export default function ConsentPage({
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
  const router = useRouter();
  const { session } = useJourney();

  const handleGrantConsent = (_scopes: string[]) => {
    router.push(`/${locale}/dashboard`);
  };

  const handleDenyConsent = () => {
    router.push(`/${locale}`);
  };

  return (
    <ConsentView
      locale={locale}
      farmerName={session?.farmerName || 'Namdev Tukaram Shinde'}
      onGrantConsent={handleGrantConsent}
      onDenyConsent={handleDenyConsent}
    />
  );
}

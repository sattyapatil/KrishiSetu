'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { PublicHomeView } from '../../src/features/public-home/index.js';

export default function LocaleLandingPage({
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

  return <PublicHomeView locale={locale} />;
}

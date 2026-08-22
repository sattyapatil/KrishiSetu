'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { LoginView } from '../../src/features/identity/LoginView.js';

export default function LocaleStartPage({
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

  const handleLoginSuccess = (_farmerId: string) => {
    router.push(`/${locale}/consent`);
  };

  return <LoginView locale={locale} onLoginSuccess={handleLoginSuccess} />;
}

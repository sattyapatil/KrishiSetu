'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { SchemeDetailView } from '../../../../src/features/schemes/SchemeDetailView.js';
import { getSchemeById } from '../../../../src/features/schemes/fixtures.js';
import { AccessRequiredView } from '../../../../src/components/AccessRequiredView.js';
import { NotFoundView } from '../../../../src/components/NotFoundView.js';
import { useJourney } from '../../../../src/features/journey/index.js';

export default function SchemeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; schemeCode: string }>;
}): React.JSX.Element {
  const resolvedParams = use(params);
  const rawLocale = resolvedParams.locale;
  const schemeCode = resolvedParams.schemeCode;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const { session } = useJourney();

  if (!session || !session.dashboardConsentGranted) {
    return <AccessRequiredView locale={locale} />;
  }

  const scheme = getSchemeById(schemeCode);
  if (!scheme) {
    return (
      <NotFoundView
        locale={locale}
        messageKey="common.notFoundDescription"
        returnHref={`/${locale}/schemes`}
      />
    );
  }

  return <SchemeDetailView locale={locale} scheme={scheme} />;
}

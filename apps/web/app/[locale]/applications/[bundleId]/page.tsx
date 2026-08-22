'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { BundleDetailView } from '../../../../src/features/applications/BundleDetailView.js';
import { AccessRequiredView } from '../../../../src/components/AccessRequiredView.js';
import { NotFoundView } from '../../../../src/components/NotFoundView.js';
import { useJourney } from '../../../../src/features/journey/index.js';

export default function BundleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; bundleId: string }>;
}): React.JSX.Element {
  const resolvedParams = use(params);
  const rawLocale = resolvedParams.locale;
  const bundleId = resolvedParams.bundleId;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const { session, adapter } = useJourney();

  if (!session || !session.dashboardConsentGranted) {
    return <AccessRequiredView locale={locale} />;
  }

  const bundle = adapter.getBundle(bundleId);
  if (!bundle) {
    return (
      <NotFoundView
        locale={locale}
        messageKey="errors.bundleNotFound"
        returnHref={`/${locale}/applications`}
      />
    );
  }

  return <BundleDetailView locale={locale} bundle={bundle} />;
}

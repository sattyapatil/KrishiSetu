'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { ChildDetailView } from '../../../../../src/features/applications/ChildDetailView.js';
import { AccessRequiredView } from '../../../../../src/components/AccessRequiredView.js';
import { NotFoundView } from '../../../../../src/components/NotFoundView.js';
import { useJourney } from '../../../../../src/features/journey/index.js';

export default function ChildDetailPage({
  params,
}: {
  params: Promise<{ locale: string; bundleId: string; childId: string }>;
}): React.JSX.Element {
  const resolvedParams = use(params);
  const rawLocale = resolvedParams.locale;
  const bundleId = resolvedParams.bundleId;
  const childId = resolvedParams.childId;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const { session, adapter } = useJourney();

  if (!session || !session.dashboardConsentGranted) {
    return <AccessRequiredView locale={locale} />;
  }

  const bundle = adapter.getBundle(bundleId);
  const child = bundle?.children.find((c) => c.childId === childId);

  if (!bundle || !child) {
    return (
      <NotFoundView
        locale={locale}
        messageKey="errors.bundleNotFound"
        returnHref={`/${locale}/applications`}
      />
    );
  }

  return <ChildDetailView locale={locale} bundle={bundle} child={child} />;
}

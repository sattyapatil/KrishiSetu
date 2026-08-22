'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { SYNTHETIC_PUBLIC_NOTICES } from '@krishisetu/notifications';
import { NoticeDetailView } from '../../../../src/features/notifications/NoticeDetailView.js';
import { AccessRequiredView } from '../../../../src/components/AccessRequiredView.js';
import { NotFoundView } from '../../../../src/components/NotFoundView.js';
import { useJourney } from '../../../../src/features/journey/index.js';

export default function NoticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; noticeId: string }>;
}): React.JSX.Element {
  const resolvedParams = use(params);
  const rawLocale = resolvedParams.locale;
  const noticeId = resolvedParams.noticeId;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const { session } = useJourney();

  if (!session || !session.dashboardConsentGranted) {
    return <AccessRequiredView locale={locale} />;
  }

  const notice = SYNTHETIC_PUBLIC_NOTICES.find((n) => n.id === noticeId);
  if (!notice) {
    return (
      <NotFoundView
        locale={locale}
        messageKey="notifications.emptyStateTitle"
        returnHref={`/${locale}/notifications`}
      />
    );
  }

  return <NoticeDetailView locale={locale} notice={notice} />;
}

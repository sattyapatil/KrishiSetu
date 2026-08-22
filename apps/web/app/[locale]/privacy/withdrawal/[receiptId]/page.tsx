'use client';

import React, { use } from 'react';
import { Locale, isSupportedLocale } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';
import { WithdrawalReceiptView } from '../../../../../src/features/privacy/WithdrawalReceiptView.js';

export default function WithdrawalReceiptPage({
  params,
}: {
  params: Promise<{ locale: string; receiptId: string }>;
}): React.JSX.Element {
  const resolvedParams = use(params);
  const rawLocale = resolvedParams.locale;
  const receiptId = resolvedParams.receiptId;

  if (!isSupportedLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  return <WithdrawalReceiptView locale={locale} receiptId={receiptId} />;
}

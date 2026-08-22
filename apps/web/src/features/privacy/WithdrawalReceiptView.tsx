'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, Alert } from '@krishisetu/design-system';
import type { PrototypeWithdrawalResult } from '@krishisetu/testing';
import { useJourney } from '../journey/index.js';

export interface WithdrawalReceiptViewProps {
  readonly locale: Locale;
  readonly receiptId: string;
}

export function WithdrawalReceiptView({
  locale,
  receiptId,
}: WithdrawalReceiptViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { session } = useJourney();
  const [storedReceipt, setStoredReceipt] = useState<PrototypeWithdrawalResult | null>(null);
  const activeReceipt = session?.activeWithdrawalReceipt;

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('ks_withdrawal_receipt');
      if (stored) setStoredReceipt(JSON.parse(stored) as PrototypeWithdrawalResult);
    } catch {
      // The current-render receipt remains available when browser storage is unavailable.
    }
  }, []);

  const receipt = activeReceipt?.receiptId === receiptId
    ? activeReceipt
    : storedReceipt?.receiptId === receiptId
      ? storedReceipt
      : null;

  return (
    <div style={{ maxWidth: '44rem', margin: '2rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {t('privacy.withdrawalSimulatedTitle')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('privacy.receiptIdLabel')}: <strong>{receiptId}</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Alert variant="info" title="Prototype data boundary">
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            {t('privacy.withdrawalSimulatedBody')}
          </p>
        </Alert>

        <Card
          title="Completed Purge Results"
          subtitle="Counts returned by the synchronous prototype purge transaction:"
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href={`/${locale}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg">
                  {t('privacy.returnStart')}
                </Button>
              </Link>
            </div>
          }
        >
          {receipt ? (
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem' }}>
              {receipt.purgedTargets.map((target) => <li key={target}>{target}</li>)}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>Detailed counts are unavailable after this browser session ends.</p>
          )}

          <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--ks-color-border, #cbd5e1)', fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            <p style={{ margin: 0 }}>
              {t('privacy.syntheticFixturesRetained')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

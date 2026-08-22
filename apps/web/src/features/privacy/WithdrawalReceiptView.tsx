'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, Alert } from '@krishisetu/design-system';

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
        <Alert variant="warning" title="Honest Simulation Disclosure">
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
            {t('privacy.withdrawalSimulatedBody')}
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            {t('privacy.futurePurgeDescription')}
          </p>
        </Alert>

        <Card
          title="Simulated Purge Targets"
          subtitle="The following read-model caches and draft states would be purged in production:"
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
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9375rem' }}>
            <li>Mahabhumi 7/12 Dashboard Read Model Cache (1 record)</li>
            <li>Crop Survey Normalized Snapshot (2 seasonal crop records)</li>
            <li>Bank Direct Benefit Transfer Mapping Cache (1 record)</li>
            <li>Unsubmitted Application Draft Snapshots (0 records)</li>
          </ul>

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

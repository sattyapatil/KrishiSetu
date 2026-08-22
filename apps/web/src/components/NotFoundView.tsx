'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, StatusBadge } from '@krishisetu/design-system';

export interface NotFoundViewProps {
  readonly locale: Locale;
  readonly messageKey?: string;
  readonly returnHref?: string;
}

export function NotFoundView({
  locale,
  messageKey = 'common.notFoundDescription',
  returnHref,
}: NotFoundViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const targetHref = returnHref ?? `/${locale}/dashboard`;

  return (
    <div style={{ maxWidth: '36rem', margin: '2rem auto', padding: '0 1rem' }}>
      <Card
        title={t('common.notFoundTitle')}
        subtitle={t('brand.name')}
        footerSlot={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href={targetHref} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                {t('common.returnHome')}
              </Button>
            </Link>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <StatusBadge status="unavailable" label={t('common.notFoundTitle')} />
          <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.5, color: 'var(--ks-color-text, #0f172a)' }}>
            {t(messageKey)}
          </p>
        </div>
      </Card>
    </div>
  );
}

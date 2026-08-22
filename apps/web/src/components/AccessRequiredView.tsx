'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, StatusBadge } from '@krishisetu/design-system';

export interface AccessRequiredViewProps {
  readonly locale: Locale;
}

export function AccessRequiredView({ locale }: AccessRequiredViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <div style={{ maxWidth: '36rem', margin: '2rem auto', padding: '0 1rem' }}>
      <Card
        title={t('common.accessRequiredTitle')}
        subtitle={t('brand.name')}
        footerSlot={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Link href={`/${locale}`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg">
                {t('common.startDemo')}
              </Button>
            </Link>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <StatusBadge status="needsAction" label={t('common.accessRequiredTitle')} />
            <StatusBadge status="mockResult" label="Prototype" />
          </div>

          <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.5, color: 'var(--ks-color-text, #0f172a)' }}>
            {t('common.accessRequiredDescription')}
          </p>

          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('brand.prototypeDisclosure')}
          </p>
        </div>
      </Card>
    </div>
  );
}

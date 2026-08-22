'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button } from '@krishisetu/design-system';
import { ArrowLeftIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';

export interface ConsentDetailViewProps {
  readonly locale: Locale;
}

export function ConsentDetailView({ locale }: ConsentDetailViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { session } = useJourney();

  const farmerId = session?.farmerId || '27202600000001';
  const consentId = `CNS-2026-${farmerId.slice(-4)}`;
  const scopes = session?.dashboardConsentScopes && session.dashboardConsentScopes.length > 0
    ? session.dashboardConsentScopes
    : ['IDENTITY_READ', 'LAND_READ', 'CROP_READ', 'BANK_STATUS_READ', 'SUBSIDY_ELIGIBILITY_READ', 'CREDIT_READ'];

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/privacy`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeftIcon size={16} aria-hidden={true} />
          <span>{t('privacy.backToPrivacy')}</span>
        </Link>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.375rem 0',
          }}
        >
          {t('privacy.consentDetailsTitle')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          Deterministic in-memory consent record created under DPDP Act s.6 demonstration rules.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Card
          title={t('privacy.activeConsent')}
          subtitle={`UUID: ${consentId}`}
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href={`/${locale}/privacy`} style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="md">
                  {t('privacy.backToPrivacy')}
                </Button>
              </Link>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)' }}>{t('privacy.purposeLabel')}:</span>
              <strong>{t('consent.purposeTitle')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)' }}>{t('privacy.grantedAt')}:</span>
              <span>{session?.sessionStartedAt || '2026-08-22 09:00:00 IST'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)' }}>{t('privacy.validUntil')}:</span>
              <span>30 minutes duration</span>
            </div>

            <div>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)', display: 'block', marginBottom: '0.5rem' }}>
                {t('privacy.grantedScopesLabel')}:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {scopes.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                      borderRadius: '0.25rem',
                      border: '1px solid var(--ks-color-border, #cbd5e1)',
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

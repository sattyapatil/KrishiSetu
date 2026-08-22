'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { Card, StatusBadge } from '@krishisetu/design-system';
import { ArrowLeftIcon, CheckIcon } from '../../components/icons.js';
import { SchemeDetailItem } from './fixtures.js';
import { useJourney } from '../journey/index.js';
import { StickyApplicationBar } from '../dashboard/components/StickyApplicationBar.js';

export interface SchemeDetailViewProps {
  readonly locale: Locale;
  readonly scheme: SchemeDetailItem;
}

export function SchemeDetailView({
  locale,
  scheme,
}: SchemeDetailViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { selectedOfferings, toggleOffering } = useJourney();
  const isSelected = selectedOfferings.has(scheme.id);
  const isCredit = scheme.domain === 'ULI';

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href={`/${locale}/schemes`}
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
          <span>{t('schemes.backToSchemes')}</span>
        </Link>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.375rem 0',
          }}
        >
          {t(scheme.titleKey)}
        </h1>
        <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)', fontSize: '1rem' }}>
          {scheme.providerName}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Estimated Benefits Card */}
        <Card
          title={t('schemes.benefitsTitle')}
          subtitle="Calculated against verified land parcel and crop survey records"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>
                {isCredit ? 'Indicative Credit Scale' : t('schemes.estimatedBenefit')}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: isCredit ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-agri-green, #166534)' }}>
                {formatCurrencyFromPaise(scheme.estimatedBenefitPaise, locale)}
              </span>
            </div>
            <StatusBadge status="ready" label={isCredit ? 'Pre-Qualified' : t('schemes.likelyEligible')} />
          </div>

          <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ks-color-text, #0f172a)' }}>
            {scheme.guidelines}
          </p>
        </Card>

        {/* Eligibility Criteria & Verification Basis */}
        <Card title={t('schemes.eligibilityCriteria')}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {scheme.reasons.map((r, idx) => (
              <li key={idx} style={{ fontSize: '0.9375rem', color: 'var(--ks-color-text, #0f172a)' }}>
                <strong>{t(r)}</strong>
              </li>
            ))}
          </ul>
        </Card>

        {/* Synthetic Provenance & Action Card */}
        <Card
          title="Demonstration Action"
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => toggleOffering(scheme.id)}
                aria-pressed={isSelected}
                style={{
                  minHeight: '2.75rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: isSelected
                    ? `1px solid ${isCredit ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-agri-green, #166534)'}`
                    : '1px solid var(--ks-color-civic-blue, #1e3a8a)',
                  backgroundColor: isSelected
                    ? isCredit
                      ? 'var(--ks-color-civic-blue, #1e3a8a)'
                      : 'var(--ks-color-agri-green, #166534)'
                    : 'transparent',
                  color: isSelected ? 'var(--ks-color-surface-card, #ffffff)' : 'var(--ks-color-civic-blue, #1e3a8a)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                {isSelected && <CheckIcon size={18} aria-hidden={true} />}
                <span>{isSelected ? t('schemes.removeOffering') : t('schemes.selectOffering')}</span>
              </button>

              <Link
                href={`/${locale}/schemes`}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                {t('schemes.backToSchemes')}
              </Link>
            </div>
          }
        >
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('schemes.disclaimer')}
          </p>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            Required application scopes: {scheme.requiredScopes.join(', ')}
          </p>
        </Card>
      </div>

      <StickyApplicationBar locale={locale} />
    </div>
  );
}

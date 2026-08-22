'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { StatusBadge, Alert } from '@krishisetu/design-system';
import { CheckIcon } from '../../components/icons.js';
import { SYNTHETIC_SCHEMES_CATALOG } from './fixtures.js';
import { useJourney } from '../journey/index.js';
import { StickyApplicationBar } from '../dashboard/components/StickyApplicationBar.js';

export interface SchemeListViewProps {
  readonly locale: Locale;
}

export function SchemeListView({ locale }: SchemeListViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { selectedOfferings, toggleOffering } = useJourney();

  return (
    <div style={{ maxWidth: '56rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {t('schemes.pageTitle')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('schemes.pageSubtitle')}
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Alert variant="info" title="Eligibility Disclaimer">
          {t('schemes.disclaimer')}
        </Alert>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1rem' }}>
        {SYNTHETIC_SCHEMES_CATALOG.map((item) => {
          const isSelected = selectedOfferings.has(item.id);
          const isCredit = item.domain === 'ULI';

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
                borderRadius: 'var(--ks-radius-md, 0.5rem)',
                border: isSelected
                  ? `2px solid ${isCredit ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-agri-green, #166534)'}`
                  : '1px solid var(--ks-color-border, #cbd5e1)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <StatusBadge status="ready" label={isCredit ? 'Pre-Qualified' : t('schemes.likelyEligible')} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {item.domain === 'MAHADBT' ? t('schemes.sourceMahadbt') : 'Mock ULI'}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.375rem 0' }}>
                  {t(item.titleKey)}
                </h2>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                  {t(item.descKey)}
                </p>

                <div
                  style={{
                    padding: '0.625rem',
                    backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                    borderRadius: '0.375rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>
                    {isCredit ? 'Indicative Limit' : t('schemes.estimatedBenefit')}
                  </span>
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: isCredit ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-agri-green, #166534)',
                    }}
                  >
                    {formatCurrencyFromPaise(item.estimatedBenefitPaise, locale)}
                    {item.subsidyPercentage > 0 && ` (${item.subsidyPercentage}% Subsidy)`}
                  </span>
                </div>

                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--ks-color-text, #0f172a)' }}>
                  {item.reasons.map((r, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{t(r)}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
                }}
              >
                <Link
                  href={`/${locale}/schemes/${item.id}`}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--ks-color-civic-blue, #1e3a8a)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  {t('schemes.viewSchemeDetails')}
                </Link>

                <button
                  type="button"
                  onClick={() => toggleOffering(item.id)}
                  aria-pressed={isSelected}
                  style={{
                    minHeight: '2.5rem',
                    padding: '0.375rem 0.875rem',
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
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  {isSelected && <CheckIcon size={16} aria-hidden={true} />}
                  <span>{isSelected ? t('schemes.removeOffering') : t('schemes.selectOffering')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <StickyApplicationBar locale={locale} />
    </div>
  );
}

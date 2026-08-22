import React from 'react';
import Link from 'next/link';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { StatusBadge } from '@krishisetu/design-system';
import { CheckIcon } from '../../../components/icons.js';
import { DashboardSchemeOffering, DashboardCreditOffering } from '../types/dashboard-view-model.js';
import { useJourney } from '../../journey/index.js';

export interface DashboardApplicationsSectionProps {
  readonly locale: Locale;
  readonly schemes: readonly DashboardSchemeOffering[];
  readonly credit: readonly DashboardCreditOffering[];
}

export function DashboardApplicationsSection({
  locale,
  schemes,
  credit,
}: DashboardApplicationsSectionProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { selectedOfferings, toggleOffering } = useJourney();

  return (
    <section aria-labelledby="applications-flow-heading">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div>
          <h2
            id="applications-flow-heading"
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
              margin: '0 0 0.125rem 0',
            }}
          >
            {t('schemes.cardTitle')}
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('schemes.summary')}
          </p>
        </div>

        <Link
          href={`/${locale}/schemes`}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            textDecoration: 'none',
          }}
        >
          {t('schemes.pageTitle')} &rarr;
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Scheme Offering 1: Micro-Irrigation Drip */}
        {schemes.map((scheme) => {
          const isSelected = selectedOfferings.has(scheme.id);
          return (
            <div
              key={scheme.id}
              style={{
                backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
                borderRadius: 'var(--ks-radius-md, 0.5rem)',
                border: isSelected
                  ? '2px solid var(--ks-color-agri-green, #166534)'
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
                  <StatusBadge
                    status={scheme.status === 'LIKELY_ELIGIBLE' ? 'ready' : 'needsAction'}
                    label={t('schemes.likelyEligible')}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {t('schemes.sourceMahadbt')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.375rem 0' }}>
                  {t(scheme.titleKey)}
                </h3>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                  {t(scheme.descKey)}
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
                    {t('schemes.estimatedBenefit')}
                  </span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ks-color-agri-green, #166534)' }}>
                    {formatCurrencyFromPaise(scheme.estimatedBenefitPaise, locale)} ({scheme.subsidyPercentage}% Subsidy)
                  </span>
                </div>

                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--ks-color-text, #0f172a)' }}>
                  {scheme.reasons.map((r, idx) => (
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
                  href={`/${locale}/schemes/${scheme.id}`}
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
                  onClick={() => toggleOffering(scheme.id)}
                  aria-pressed={isSelected}
                  style={{
                    minHeight: '2.5rem',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '0.375rem',
                    border: isSelected
                      ? '1px solid var(--ks-color-agri-green, #166534)'
                      : '1px solid var(--ks-color-civic-blue, #1e3a8a)',
                    backgroundColor: isSelected
                      ? 'var(--ks-color-agri-green, #166534)'
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

        {/* Credit Offering: Kisan Credit Card */}
        {credit.map((item) => {
          const isSelected = selectedOfferings.has(item.id);
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
                borderRadius: 'var(--ks-radius-md, 0.5rem)',
                border: isSelected
                  ? '2px solid var(--ks-color-civic-blue, #1e3a8a)'
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
                  <StatusBadge status="ready" label={t('credit.prequalifiedMock')} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {t('credit.sourceUli')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.375rem 0' }}>
                  {t(item.titleKey)}
                </h3>
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
                    {t('credit.estimatedLimit')}
                  </span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                    {formatCurrencyFromPaise(item.estimatedLimitPaise, locale)}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                  {t(item.interestSubventionKey)}
                </p>
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
                      ? '1px solid var(--ks-color-civic-blue, #1e3a8a)'
                      : '1px solid var(--ks-color-civic-blue, #1e3a8a)',
                    backgroundColor: isSelected
                      ? 'var(--ks-color-civic-blue, #1e3a8a)'
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
    </section>
  );
}

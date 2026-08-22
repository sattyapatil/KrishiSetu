import React from 'react';
import { Locale, translate, formatHectares } from '@krishisetu/i18n';
import { StatusBadge } from '@krishisetu/design-system';
import { DashboardFarmerProfile } from '../types/dashboard-view-model.js';

export interface DashboardReadinessSectionProps {
  readonly locale: Locale;
  readonly farmer: DashboardFarmerProfile;
}

export function DashboardReadinessSection({
  locale,
  farmer,
}: DashboardReadinessSectionProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <section aria-labelledby="readiness-heading">
      <h2
        id="readiness-heading"
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          margin: '0 0 0.75rem 0',
        }}
      >
        Verified Agricultural Readiness
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Land Holding Card */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
            borderRadius: 'var(--ks-radius-md, 0.5rem)',
            border: '1px solid var(--ks-color-border, #cbd5e1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ks-color-text-muted, #475569)' }}>
              {t('land.cardTitle')}
            </span>
            <StatusBadge status={farmer.verifiedLand ? 'ready' : 'needsAction'} label={t('common.verified')} />
          </div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
            {formatHectares(farmer.landHoldingsHectares, locale)}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('schemes.sourceMahadbt')}: Mahabhumi 7/12 (Survey 123/1A)
          </p>
        </div>

        {/* Crop Survey Card */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
            borderRadius: 'var(--ks-radius-md, 0.5rem)',
            border: '1px solid var(--ks-color-border, #cbd5e1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ks-color-text-muted, #475569)' }}>
              {t('crops.cardTitle')}
            </span>
            <StatusBadge status={farmer.verifiedCrops ? 'ready' : 'needsAction'} label={t('common.verified')} />
          </div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-agri-green, #166534)' }}>
            {farmer.cropCount} Kharif Crops
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            Soybean & Tur recorded in Digital Crop Survey
          </p>
        </div>

        {/* Bank Mapping Card */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
            borderRadius: 'var(--ks-radius-md, 0.5rem)',
            border: '1px solid var(--ks-color-border, #cbd5e1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ks-color-text-muted, #475569)' }}>
              Bank Readiness
            </span>
            <StatusBadge status={farmer.bankMapped ? 'ready' : 'needsAction'} label="DBT Active" />
          </div>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
            {farmer.bankName}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            Masked A/C: {farmer.maskedAccount} (Aadhaar Seeding Verified)
          </p>
        </div>
      </div>
    </section>
  );
}

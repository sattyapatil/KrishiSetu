import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { StatusBadge } from '@krishisetu/design-system';
import { NoticesIcon } from '../../../components/icons.js';
import { DashboardFarmerProfile } from '../types/dashboard-view-model.js';

export interface DashboardHeaderSectionProps {
  readonly locale: Locale;
  readonly farmer: DashboardFarmerProfile;
  readonly noticeCount: number;
}

export function DashboardHeaderSection({
  locale,
  farmer,
  noticeCount,
}: DashboardHeaderSectionProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        borderRadius: 'var(--ks-radius-lg, 0.75rem)',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
      }}
    >
      <div>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.25rem 0',
          }}
        >
          {farmer.name}
        </h1>
        <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)', fontSize: '0.875rem' }}>
          {t('land.village')}: {farmer.villageKey} • {t('auth.farmerIdLabel')}: ••••••••••{farmer.id.slice(-4)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusBadge status="ready" label={t('common.verified')} />
        <StatusBadge status="mockResult" label="Prototype" />

        <Link
          href={`/${locale}/notifications`}
          aria-label={`${t('notifications.centreTitle')}, ${noticeCount} updates`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            minHeight: '2.75rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--ks-color-border, #cbd5e1)',
            backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <NoticesIcon size={18} aria-hidden={true} />
          <span>{t('notifications.centreTitle')}</span>
          {noticeCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--ks-color-civic-blue, #1e3a8a)',
                color: 'var(--ks-color-surface-card, #ffffff)',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '0.125rem 0.375rem',
                minWidth: '1.25rem',
                textAlign: 'center',
              }}
            >
              {noticeCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

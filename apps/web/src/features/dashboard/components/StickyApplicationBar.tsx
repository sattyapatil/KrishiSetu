'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { ArrowRightIcon, CloseIcon } from '../../../components/icons.js';
import { useJourney } from '../../journey/index.js';

export interface StickyApplicationBarProps {
  readonly locale: Locale;
}

export function StickyApplicationBar({ locale }: StickyApplicationBarProps): React.JSX.Element | null {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { selectedOfferings, clearOfferings } = useJourney();

  if (selectedOfferings.size === 0) {
    return null;
  }

  const count = selectedOfferings.size;

  return (
    <>
      <style>{`@media (max-width: 767px) { .ks-sticky-action-bar { bottom: 4.5rem !important; } }`}</style>
      <div
        className="ks-sticky-action-bar"
        style={{
          position: 'fixed',
          bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--ks-color-civic-blue, #1e3a8a)',
        color: 'var(--ks-color-surface-card, #ffffff)',
        padding: '0.75rem 1rem',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 850,
        }}
      >
      <div
        style={{
          maxWidth: 'var(--ks-content-max, 75rem)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span style={{ fontWeight: 700, fontSize: '1rem', display: 'block' }}>
            {t('schemes.selectedCount', { count })}
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
            {t('applications.subtitle')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={clearOfferings}
            aria-label={t('applications.clearSelection')}
            style={{
              minWidth: '2.75rem',
              minHeight: '2.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid currentColor',
              borderRadius: '0.375rem',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <CloseIcon size={18} aria-hidden={true} />
          </button>
          <Link
            href={`/${locale}/applications/new/review`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '2.75rem',
              padding: '0.5rem 1.25rem',
              backgroundColor: 'var(--ks-color-agri-green, #166534)',
              color: 'var(--ks-color-surface-card, #ffffff)',
              borderRadius: '0.375rem',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span>{t('schemes.reviewAndApply', { count })}</span>
            <ArrowRightIcon size={18} aria-hidden={true} />
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}

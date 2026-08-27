'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import type { PublicSchemeCard, ActiveDetailModalState, PublicWidgetStatus } from '../public-home.types.js';
import { PublicWidgetState } from './PublicWidgetState.js';
import styles from '../PublicHomeView.module.css';

export interface FeaturedSchemesProps {
  readonly locale: Locale;
  readonly schemes: readonly PublicSchemeCard[];
  readonly status: PublicWidgetStatus;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function FeaturedSchemes({
  locale,
  schemes,
  status,
  onOpenModal,
}: FeaturedSchemesProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const handleOpenSchemeDetails = (scheme: PublicSchemeCard) => {
    onOpenModal({
      type: 'SCHEME',
      id: scheme.schemeId,
      title: t(scheme.titleKey),
      subtitle: t(scheme.benefitKey),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <strong>{t('publicHome.schemes.audienceLabel')}:</strong> {t(scheme.audienceKey)}
          </div>
          <div>
            <strong>{t('publicHome.schemes.statusLabel')}:</strong> {t(scheme.stateKey)}
          </div>
          <div>
            <strong>{t('publicHome.schemes.benefitLabel')}:</strong> {t(scheme.benefitKey)}
          </div>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              borderRadius: '0.5rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              fontSize: '0.875rem',
              color: 'var(--ks-color-text-muted, #475569)',
              marginTop: '0.5rem',
            }}
          >
            <strong>{t('publicHome.common.loginRequiredNote')}</strong>
            <br />
            {t('publicHome.common.loginBenefitNote')}
          </div>
        </div>
      ),
    });
  };

  return (
    <section id="schemes" className={styles.sectionWrapper} aria-labelledby="schemes-heading">
      <div className={styles.sectionHeader}>
        <h2 id="schemes-heading" className={styles.sectionTitle}>
          {t('publicHome.schemes.title')}
        </h2>
        <p className={styles.sectionDescription}>{t('publicHome.schemes.description')}</p>
      </div>

      <PublicWidgetState locale={locale} status={status} label={t('publicHome.schemes.title')}>
        <div className={styles.schemesGrid}>
          {schemes.map((scheme) => (
          <article key={scheme.schemeId} className={styles.schemeCard} aria-labelledby={`scheme-title-${scheme.schemeId}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 id={`scheme-title-${scheme.schemeId}`} className={styles.schemeTitle}>
                {t(scheme.titleKey)}
              </h3>

              <ul className={styles.schemeInfoList}>
                <li className={styles.schemeInfoItem}>
                  <span className={styles.schemeInfoLabel}>{t('publicHome.schemes.benefitLabel')}</span>
                  <span className={styles.schemeInfoValue}>{t(scheme.benefitKey)}</span>
                </li>
                <li className={styles.schemeInfoItem}>
                  <span className={styles.schemeInfoLabel}>{t('publicHome.schemes.audienceLabel')}</span>
                  <span className={styles.schemeInfoValue}>{t(scheme.audienceKey)}</span>
                </li>
                <li className={styles.schemeInfoItem}>
                  <span className={styles.schemeInfoLabel}>{t('publicHome.schemes.statusLabel')}</span>
                  <span className={styles.schemeInfoValue}>{t(scheme.stateKey)}</span>
                </li>
              </ul>
            </div>

            <div className={styles.schemeActions}>
              <button
                type="button"
                onClick={() => handleOpenSchemeDetails(scheme)}
                className={styles.schemeSecondaryBtn}
              >
                {t('publicHome.schemes.viewDetails')}
              </button>

              <Link
                href={`/${locale}/login`}
                className={styles.schemePrimaryBtn}
              >
                {t('publicHome.schemes.checkEligibility')}
              </Link>
            </div>
          </article>
          ))}
        </div>
      </PublicWidgetState>
    </section>
  );
}

'use client';

import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import styles from '../PublicHomeView.module.css';

export interface PublicTrustPanelProps {
  readonly locale: Locale;
}

export function PublicTrustPanel({ locale }: PublicTrustPanelProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const points = [
    t('publicHome.trust.point1'),
    t('publicHome.trust.point2'),
    t('publicHome.trust.point3'),
    t('publicHome.trust.point4'),
  ];

  return (
    <section className={styles.sectionWrapper} aria-labelledby="trust-heading">
      <div className={styles.trustPanelCard}>
        <div className={styles.sectionHeader} style={{ marginBottom: '1rem' }}>
          <h2 id="trust-heading" className={styles.sectionTitle} style={{ fontSize: '1.5rem' }}>
            🔒 {t('publicHome.trust.title')}
          </h2>
        </div>

        <div className={styles.trustPointsGrid}>
          {points.map((pt, idx) => (
            <div key={idx} className={styles.trustPointItem}>
              <span className={styles.trustIcon} aria-hidden="true">
                ✓
              </span>
              <p className={styles.trustText}>{pt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

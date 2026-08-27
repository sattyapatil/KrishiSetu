'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import styles from '../PublicHomeView.module.css';

export interface FinalLoginCtaProps {
  readonly locale: Locale;
}

export function FinalLoginCta({ locale }: FinalLoginCtaProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <section className={styles.finalCtaSection} aria-labelledby="final-cta-heading">
      <div className={styles.finalCtaInner}>
        <h2 id="final-cta-heading" className={styles.finalCtaTitle}>
          {t('publicHome.finalCta.title')}
        </h2>
        <p className={styles.finalCtaDesc}>{t('publicHome.finalCta.description')}</p>

        <div className={styles.finalCtaActions}>
          <Link href={`/${locale}/login`} className={styles.finalPrimaryBtn}>
            {t('publicHome.finalCta.primaryAction')}
          </Link>
          <a href="#schemes" className={styles.finalSecondaryBtn}>
            {t('publicHome.finalCta.secondaryAction')}
          </a>
        </div>
      </div>
    </section>
  );
}

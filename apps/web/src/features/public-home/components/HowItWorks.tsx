'use client';

import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import styles from '../PublicHomeView.module.css';

export interface HowItWorksProps {
  readonly locale: Locale;
}

export function HowItWorks({ locale }: HowItWorksProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const steps = [
    {
      num: 1,
      title: t('publicHome.howItWorks.step1Title'),
      desc: t('publicHome.howItWorks.step1Desc'),
    },
    {
      num: 2,
      title: t('publicHome.howItWorks.step2Title'),
      desc: t('publicHome.howItWorks.step2Desc'),
    },
    {
      num: 3,
      title: t('publicHome.howItWorks.step3Title'),
      desc: t('publicHome.howItWorks.step3Desc'),
    },
    {
      num: 4,
      title: t('publicHome.howItWorks.step4Title'),
      desc: t('publicHome.howItWorks.step4Desc'),
    },
  ];

  return (
    <section id="how-it-works" className={styles.sectionWrapper} aria-labelledby="how-it-works-heading">
      <div className={styles.sectionHeader}>
        <h2 id="how-it-works-heading" className={styles.sectionTitle}>
          {t('publicHome.howItWorks.title')}
        </h2>
      </div>

      <div className={styles.howItWorksGrid}>
        {steps.map((s) => (
          <div key={s.num} className={styles.stepCard}>
            <div className={styles.stepNumber} aria-hidden="true">
              {s.num}
            </div>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepDesc}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

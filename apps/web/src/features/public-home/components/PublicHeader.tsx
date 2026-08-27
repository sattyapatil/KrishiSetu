'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, translate } from '@krishisetu/i18n';
import { BrandMark, LanguageSelector } from '@krishisetu/design-system';
import styles from '../PublicHomeView.module.css';

export interface PublicHeaderProps {
  readonly locale: Locale;
  readonly onSelectLocale?: (locale: Locale) => void;
}

export function PublicHeader({ locale, onSelectLocale }: PublicHeaderProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const router = useRouter();
  const pathname = usePathname() || `/${locale}`;

  const handleSelectLocale = (newLocale: Locale) => {
    if (onSelectLocale) {
      onSelectLocale(newLocale);
    }
    if (newLocale === locale) return;
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLocale;
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        {t('publicHome.hero.skipToContent')}
      </a>

      <header className={styles.publicHeader}>
        <div className={styles.headerInner}>
          {/* Brand lockup */}
          <Link
            href={`/${locale}`}
            className={styles.brandLink}
            aria-label={`${t('brand.name')} - ${t('brand.motto')}`}
          >
            <BrandMark size={40} />
            <div className={styles.brandTextGroup}>
              <span className={styles.brandTitle}>{t('brand.name')}</span>
              <span className={styles.brandMotto} lang="sa-Deva">
                {t('brand.motto')}
              </span>
            </div>
          </Link>

          {/* Centre anchor navigation */}
          <nav aria-label={t('publicHome.footer.navigationHeading')}>
            <ul className={styles.navMenu}>
              <li>
                <a href="#main-content" className={styles.navLink}>
                  {t('publicHome.nav.home')}
                </a>
              </li>
              <li>
                <a href="#services" className={styles.navLink}>
                  {t('publicHome.nav.services')}
                </a>
              </li>
              <li>
                <a href="#market" className={styles.navLink}>
                  {t('publicHome.nav.market')}
                </a>
              </li>
              <li>
                <a href="#schemes" className={styles.navLink}>
                  {t('publicHome.nav.schemes')}
                </a>
              </li>
              <li>
                <a href="#notices" className={styles.navLink}>
                  {t('publicHome.nav.notices')}
                </a>
              </li>
            </ul>
          </nav>

          {/* Right header actions: Language + Farmer Login */}
          <div className={styles.headerActions}>
            <LanguageSelector currentLocale={locale} onSelectLocale={handleSelectLocale} />

            <Link href={`/${locale}/login`} className={styles.loginButtonHeader}>
              {t('publicHome.nav.farmerLogin')}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

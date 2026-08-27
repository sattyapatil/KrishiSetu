'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { BrandMark } from '@krishisetu/design-system';
import type { ActiveDetailModalState } from '../public-home.types.js';
import styles from '../PublicHomeView.module.css';

export interface PublicFooterProps {
  readonly locale: Locale;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function PublicFooter({ locale, onOpenModal }: PublicFooterProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const openInfoModal = (titleKey: string, content: React.ReactNode) => {
    onOpenModal({
      type: 'NOTICE',
      title: t(titleKey),
      content,
    });
  };

  return (
    <footer className={styles.publicFooter} aria-label={`${t('brand.name')} ${t('publicHome.footer.navigationHeading')}`}>
      <div className={styles.footerInner}>
        <div className={styles.footerTopRow}>
          {/* Brand info */}
          <div className={styles.footerBrandCol}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BrandMark size={36} />
              <div>
                <strong style={{ fontSize: '1.125rem', color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                  {t('brand.name')}
                </strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--ks-color-agri-green, #166534)', fontWeight: 600 }}>
                  {t('brand.motto')}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)', margin: 0, lineHeight: 1.5 }}>
              {t('brand.mottoMeaning')}
            </p>
          </div>

          {/* Nav links */}
          <div className={styles.footerNavCol}>
            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)', display: 'block', marginBottom: '0.75rem' }}>
                {t('publicHome.footer.navigationHeading')}
              </strong>
              <ul className={styles.footerLinksList}>
                <li>
                  <a href="#services" className={styles.footerLink}>
                    {t('publicHome.nav.services')}
                  </a>
                </li>
                <li>
                  <a href="#market" className={styles.footerLink}>
                    {t('publicHome.nav.market')}
                  </a>
                </li>
                <li>
                  <a href="#schemes" className={styles.footerLink}>
                    {t('publicHome.nav.schemes')}
                  </a>
                </li>
                <li>
                  <a href="#notices" className={styles.footerLink}>
                    {t('publicHome.nav.notices')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong style={{ fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)', display: 'block', marginBottom: '0.75rem' }}>
                {t('publicHome.footer.informationHeading')}
              </strong>
              <ul className={styles.footerLinksList}>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      openInfoModal(
                        'publicHome.footer.privacy',
                        <div>
                          <p>
                            {t('publicHome.footer.privacyBody1')}
                          </p>
                          <p>
                            {t('publicHome.footer.privacyBody2')}
                          </p>
                        </div>
                      )
                    }
                    className={styles.footerLink}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                  >
                    {t('publicHome.footer.privacy')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      openInfoModal(
                        'publicHome.footer.accessibility',
                        <div>
                          <p>
                            {t('publicHome.footer.accessibilityBody1')}
                          </p>
                          <p>
                            {t('publicHome.footer.accessibilityBody2')}
                          </p>
                        </div>
                      )
                    }
                    className={styles.footerLink}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                  >
                    {t('publicHome.footer.accessibility')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      openInfoModal(
                        'publicHome.footer.sources',
                        <div>
                          <p>
                            {t('publicHome.footer.sourcesBody')}
                          </p>
                        </div>
                      )
                    }
                    className={styles.footerLink}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                  >
                    {t('publicHome.footer.sources')}
                  </button>
                </li>
                <li>
                  <Link href={`/${locale}/login`} className={styles.footerLink}>
                    {t('publicHome.nav.farmerLogin')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright / disclosure */}
        <div className={styles.footerBottomRow}>
          <p style={{ margin: 0 }}>
            {t('brand.prototypeDisclosure')}
          </p>
          <p style={{ margin: 0 }}>
            {t('publicHome.footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}

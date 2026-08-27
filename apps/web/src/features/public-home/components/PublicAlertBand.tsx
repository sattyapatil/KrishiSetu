'use client';

import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import type { PublicAlert, ActiveDetailModalState, PublicWidgetStatus } from '../public-home.types.js';
import { PublicWidgetState } from './PublicWidgetState.js';
import styles from '../PublicHomeView.module.css';

export interface PublicAlertBandProps {
  readonly locale: Locale;
  readonly alert: PublicAlert;
  readonly status: PublicWidgetStatus;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function PublicAlertBand({
  locale,
  alert,
  status,
  onOpenModal,
}: PublicAlertBandProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const handleOpenNotice = () => {
    onOpenModal({
      type: 'ALERT',
      id: alert.noticeId,
      title: t(alert.titleKey),
      subtitle: t(alert.metaKey),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {t('notifications.notices.solarDeadline.summary')}
          </p>
          <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('notifications.notices.solarDeadline.body')}
          </p>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              borderRadius: '0.5rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              fontSize: '0.8125rem',
              color: 'var(--ks-color-text-muted, #475569)',
            }}
          >
            <strong>{t('publicHome.common.syntheticDataLabel')}</strong>
            <br />
            {t('publicHome.common.loginRequiredNote')}
          </div>
        </div>
      ),
    });
  };

  return (
    <aside className={styles.alertBandSection} aria-label={t(alert.labelKey)}>
      <PublicWidgetState locale={locale} status={status} label={t(alert.labelKey)}>
        <div className={styles.alertBandInner}>
          <div className={styles.alertContent}>
            <span className={styles.alertBadge}>
              <span aria-hidden="true">⚠️ </span>
              {t(alert.labelKey)}
            </span>
            <div className={styles.alertTextGroup}>
              <p className={styles.alertTitle}>{t(alert.titleKey)}</p>
              <p className={styles.alertMeta}>{t(alert.metaKey)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenNotice}
            className={styles.alertActionBtn}
            aria-label={`${t(alert.actionKey)}: ${t(alert.titleKey)}`}
          >
            {t(alert.actionKey)}
          </button>
        </div>
      </PublicWidgetState>
    </aside>
  );
}

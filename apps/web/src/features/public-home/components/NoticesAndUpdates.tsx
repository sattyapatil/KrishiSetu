'use client';

import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import type {
  PublicNoticeItem,
  PublicAgricultureUpdate,
  ActiveDetailModalState,
  PublicWidgetStatus,
} from '../public-home.types.js';
import { PublicWidgetState } from './PublicWidgetState.js';
import styles from '../PublicHomeView.module.css';

export interface NoticesAndUpdatesProps {
  readonly locale: Locale;
  readonly notices: readonly PublicNoticeItem[];
  readonly updates: readonly PublicAgricultureUpdate[];
  readonly noticeStatus: PublicWidgetStatus;
  readonly updateStatus: PublicWidgetStatus;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function NoticesAndUpdates({
  locale,
  notices,
  updates,
  noticeStatus,
  updateStatus,
  onOpenModal,
}: NoticesAndUpdatesProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const handleOpenNotice = (notice: PublicNoticeItem) => {
    onOpenModal({
      type: 'NOTICE',
      id: notice.id,
      title: t(notice.titleKey),
      subtitle: `${t(notice.dateKey)} • ${t('publicHome.noticesAndUpdates.syntheticNoticeLabel')}`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{t(notice.summaryKey)}</p>
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
            <strong>
              {t('publicHome.noticesAndUpdates.priorityLabel')}: {t(`notifications.priorities.${notice.priority}`)}
            </strong>
            <br />
            {t('publicHome.common.loginRequiredNote')}
          </div>
        </div>
      ),
    });
  };

  const handleOpenUpdate = (update: PublicAgricultureUpdate) => {
    onOpenModal({
      type: 'UPDATE',
      id: update.id,
      title: t(update.titleKey),
      subtitle: `${t(update.dateKey)} • ${t(update.categoryKey)}`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{t(update.summaryKey)}</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.noticesAndUpdates.syntheticArticleNote')}
          </p>
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              borderRadius: '0.375rem',
              fontSize: '0.8125rem',
              color: 'var(--ks-color-text-muted, #475569)',
            }}
          >
            {t('publicHome.common.sourceLabel')}: {t('publicHome.noticesAndUpdates.syntheticEditorialLabel')}
          </div>
        </div>
      ),
    });
  };

  return (
    <section id="notices" className={styles.sectionWrapper} aria-labelledby="notices-updates-heading">
      <h2
        id="notices-updates-heading"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {t('publicHome.noticesAndUpdates.noticesTitle')} & {t('publicHome.noticesAndUpdates.updatesTitle')}
      </h2>

      <div className={styles.dualColumnGrid}>
        {/* Left Column: Public Notices */}
        <div className={styles.columnCard}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>
              {t('publicHome.noticesAndUpdates.noticesTitle')}
            </h3>
            <p className={styles.columnDesc}>
              {t('publicHome.noticesAndUpdates.noticesDescription')}
            </p>
          </div>

          <PublicWidgetState
            locale={locale}
            status={noticeStatus}
            label={t('publicHome.noticesAndUpdates.noticesTitle')}
          >
            <ul className={styles.itemsList}>
              {notices.map((notice) => (
              <li key={notice.id}>
                <article className={styles.itemArticle}>
                  <div className={styles.itemHeaderRow}>
                    <span className={styles.itemDate}>{t(notice.dateKey)}</span>
                    <span className={styles.itemSourceBadge}>
                      {t('publicHome.noticesAndUpdates.syntheticNoticeLabel')}
                    </span>
                  </div>
                  <h4 className={styles.itemHeading}>{t(notice.titleKey)}</h4>
                  <p className={styles.itemSummary}>{t(notice.summaryKey)}</p>
                  <button
                    type="button"
                    onClick={() => handleOpenNotice(notice)}
                    className={styles.itemActionLink}
                  >
                    {t('publicHome.noticesAndUpdates.viewNoticeDetails')} →
                  </button>
                </article>
              </li>
              ))}
            </ul>
          </PublicWidgetState>
        </div>

        {/* Right Column: Agriculture Updates */}
        <div className={styles.columnCard}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>
              {t('publicHome.noticesAndUpdates.updatesTitle')}
            </h3>
            <p className={styles.columnDesc}>
              {t('publicHome.noticesAndUpdates.updatesDescription')}
            </p>
          </div>

          <PublicWidgetState
            locale={locale}
            status={updateStatus}
            label={t('publicHome.noticesAndUpdates.updatesTitle')}
          >
            <ul className={styles.itemsList}>
              {updates.map((update) => (
              <li key={update.id}>
                <article className={styles.itemArticle}>
                  <div className={styles.itemHeaderRow}>
                    <span className={styles.itemDate}>{t(update.dateKey)}</span>
                    <span className={styles.itemSourceBadge}>{t(update.categoryKey)}</span>
                  </div>
                  <h4 className={styles.itemHeading}>{t(update.titleKey)}</h4>
                  <p className={styles.itemSummary}>{t(update.summaryKey)}</p>
                  <button
                    type="button"
                    onClick={() => handleOpenUpdate(update)}
                    className={styles.itemActionLink}
                  >
                    {t('publicHome.noticesAndUpdates.readArticle')} →
                  </button>
                </article>
              </li>
              ))}
            </ul>
          </PublicWidgetState>
        </div>
      </div>
    </section>
  );
}

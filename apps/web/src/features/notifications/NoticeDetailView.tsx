'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { PublicNotice } from '@krishisetu/notifications';
import { Card, Button, StatusBadge } from '@krishisetu/design-system';
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/icons.js';

export interface NoticeDetailViewProps {
  readonly locale: Locale;
  readonly notice: PublicNotice;
}

export function NoticeDetailView({
  locale,
  notice,
}: NoticeDetailViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const isUrgent = notice.priority === 'CRITICAL' || notice.priority === 'HIGH';

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/notifications`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeftIcon size={16} aria-hidden={true} />
          <span>{t('notifications.backToNotices')}</span>
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
              margin: 0,
            }}
          >
            {t(notice.titleKey)}
          </h1>

          <StatusBadge
            status={isUrgent ? 'needsAction' : 'ready'}
            label={t(`notifications.priorities.${notice.priority.toLowerCase()}`)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Card
          title={t(notice.titleKey)}
          subtitle={`${t('notifications.sourcePrefix', { source: t(`notifications.sources.${notice.source}`) })} • Notice ID: #${notice.id}`}
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link href={`/${locale}/notifications`} style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="md">
                  {t('notifications.backToNotices')}
                </Button>
              </Link>

              {notice.action && (
                <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="md">
                    <span>{t(`notifications.actions.${notice.action.labelKey}`)}</span>
                    <ArrowRightIcon size={16} aria-hidden={true} />
                  </Button>
                </Link>
              )}
            </div>
          }
        >
          <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--ks-color-text, #0f172a)' }}>
            {t(notice.summaryKey)}
          </p>

          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ks-color-text, #0f172a)' }}>
            {t(notice.bodyKey)}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--ks-color-surface-page, #f8fafc)', borderRadius: '0.375rem', fontSize: '0.8125rem' }}>
            <div>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>{t('notifications.publishedAt')}</span>
              <strong>{notice.publishedAt}</strong>
            </div>
            {notice.effectiveTo && (
              <div>
                <span style={{ color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>{t('notifications.validUntil')}</span>
                <strong style={{ color: isUrgent ? 'var(--ks-color-error-dark, #991b1b)' : 'inherit' }}>
                  {notice.effectiveTo}
                </strong>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

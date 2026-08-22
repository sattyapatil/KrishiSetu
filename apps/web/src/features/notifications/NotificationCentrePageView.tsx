'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { SYNTHETIC_PUBLIC_NOTICES, filterNotices, sortNoticesByPriority } from '@krishisetu/notifications';
import { PublicNoticeCard } from './PublicNoticeCard.js';
import { NotificationEmptyState } from './NotificationEmptyState.js';

export interface NotificationCentrePageViewProps {
  readonly locale: Locale;
}

type NoticeFilter = 'ALL' | 'CRITICAL' | 'SCHEME_WINDOW' | 'REVISED_FORM';

export function NotificationCentrePageView({ locale }: NotificationCentrePageViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const [filter, setFilter] = useState<NoticeFilter>('ALL');

  const activeNotices = SYNTHETIC_PUBLIC_NOTICES.filter((n) => n.status === 'ACTIVE');
  let displayNotices = sortNoticesByPriority(activeNotices);

  if (filter === 'CRITICAL') {
    displayNotices = displayNotices.filter((n) => n.priority === 'CRITICAL' || n.priority === 'HIGH');
  } else if (filter === 'SCHEME_WINDOW') {
    displayNotices = filterNotices(displayNotices, { type: 'SCHEME_WINDOW' });
  } else if (filter === 'REVISED_FORM') {
    displayNotices = filterNotices(displayNotices, { type: 'REVISED_FORM' });
  }

  return (
    <div style={{ maxWidth: '48rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.25rem 0',
          }}
        >
          {t('notifications.centreTitle')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('notifications.unreadCount', { count: activeNotices.length })}
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter Public Notices"
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {(
          [
            { id: 'ALL', label: t('notifications.filterAll') },
            { id: 'CRITICAL', label: t('notifications.filterCritical') },
            { id: 'SCHEME_WINDOW', label: t('notifications.filterSchemes') },
            { id: 'REVISED_FORM', label: t('notifications.filterForms') },
          ] as const
        ).map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                minHeight: '2.5rem',
                padding: '0.375rem 0.875rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: isSelected
                  ? 'var(--ks-color-civic-blue, #1e3a8a)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--ks-color-surface-card, #ffffff)'
                  : 'var(--ks-color-text, #0f172a)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notice List */}
      {displayNotices.length === 0 ? (
        <NotificationEmptyState locale={locale} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayNotices.map((notice) => (
            <div key={notice.id} style={{ position: 'relative' }}>
              <PublicNoticeCard
                locale={locale}
                notice={notice}
                onActionClick={() => {}}
              />
              <div style={{ marginTop: '0.375rem', textAlign: 'right' }}>
                <Link
                  href={`/${locale}/notices/${notice.id}`}
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--ks-color-civic-blue, #1e3a8a)',
                    textDecoration: 'underline',
                    fontWeight: 600,
                  }}
                >
                  {t('notifications.noticeDetailTitle')} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

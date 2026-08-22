import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { PublicNotice } from '@krishisetu/notifications';

export interface NotificationArchiveSummaryProps {
  readonly archivedNotices: readonly PublicNotice[];
  readonly locale: Locale;
  readonly isExpanded: boolean;
  readonly onToggleExpand: () => void;
  readonly className?: string;
}

export function NotificationArchiveSummary({
  archivedNotices,
  locale,
  isExpanded,
  onToggleExpand,
  className = '',
}: NotificationArchiveSummaryProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  if (archivedNotices.length === 0) {
    return <></>;
  }

  return (
    <section
      aria-label={t('notifications.archiveTitle')}
      className={`ks-notification-archive ${className}`}
      style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
        borderRadius: '0.75rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h4
            style={{
              margin: '0 0 0.25rem 0',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--ks-color-text, #0f172a)',
            }}
          >
            {t('notifications.archiveTitle')}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '0.8125rem',
              color: 'var(--ks-color-text-muted, #475569)',
            }}
          >
            {t('notifications.archiveDescription', { count: archivedNotices.length })}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded ? 'true' : 'false'}
          style={{
            minHeight: '2.75rem',
            padding: '0.375rem 0.875rem',
            backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
            border: '1px solid var(--ks-color-border, #cbd5e1)',
            borderRadius: '0.375rem',
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isExpanded
            ? t('notifications.hideArchive')
            : t('notifications.showArchive', { count: archivedNotices.length })}
        </button>
      </div>
    </section>
  );
}

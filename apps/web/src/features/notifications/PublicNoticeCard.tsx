import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { PublicNotice } from '@krishisetu/notifications';
import { StatusBadge, Button } from '@krishisetu/design-system';

export interface PublicNoticeCardProps {
  readonly notice: PublicNotice;
  readonly locale: Locale;
  readonly onActionClick?: (notice: PublicNotice) => void;
  readonly className?: string;
}

export function PublicNoticeCard({
  notice,
  locale,
  onActionClick,
  className = '',
}: PublicNoticeCardProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const getPriorityStatus = () => {
    switch (notice.priority) {
      case 'CRITICAL':
        return 'error' as const;
      case 'HIGH':
        return 'needsAction' as const;
      case 'NORMAL':
        return 'ready' as const;
      case 'LOW':
      default:
        return 'unavailable' as const;
    }
  };

  const formattedPublished = notice.publishedAt.split('T')[0] ?? '';
  const formattedExpiry = notice.effectiveTo ? (notice.effectiveTo.split('T')[0] ?? '') : null;

  return (
    <article
      aria-labelledby={`notice-title-${notice.id}`}
      className={`ks-notice-card ${className}`}
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        borderRadius: '0.75rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusBadge
            status={getPriorityStatus()}
            label={t(`notifications.priorities.${notice.priority}`)}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--ks-color-text-muted, #475569)',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
            }}
          >
            {t(`notifications.types.${notice.type}`)}
          </span>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--ks-color-text-muted, #475569)',
            fontWeight: 500,
          }}
        >
          {formattedExpiry
            ? t('notifications.effectivePeriod', { from: formattedPublished, to: formattedExpiry })
            : t('notifications.effectiveFrom', { from: formattedPublished })}
        </span>
      </header>

      <div>
        <h3
          id={`notice-title-${notice.id}`}
          style={{
            margin: '0 0 0.375rem 0',
            fontSize: '1.125rem',
            lineHeight: '1.5rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue-dark, #172554)',
          }}
        >
          {t(notice.titleKey)}
        </h3>
        <p
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
            color: 'var(--ks-color-text, #0f172a)',
          }}
        >
          {t(notice.summaryKey)}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '0.8125rem',
            lineHeight: '1.25rem',
            color: 'var(--ks-color-text-muted, #475569)',
          }}
        >
          {t(notice.bodyKey)}
        </p>
      </div>

      {notice.corrigendumOf && (
        <aside
          aria-label="Corrigendum Reference"
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--ks-color-warning-surface, #fef3c7)',
            border: '1px solid var(--ks-color-warning-border, #fde68a)',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: 'var(--ks-color-warning-text, #78350f)',
            fontWeight: 600,
          }}
        >
          {t('notifications.corrigendumNotice', { id: notice.corrigendumOf })}
        </aside>
      )}

      {notice.form && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
            border: '1px solid var(--ks-color-border, #cbd5e1)',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: 'var(--ks-color-text, #0f172a)',
          }}
        >
          <strong>{t(notice.form.formTitleKey)}</strong> • Rev {notice.form.revisionNumber} ({notice.form.releaseDate})
        </div>
      )}

      <footer
        style={{
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--ks-color-text-muted, #475569)',
          }}
        >
          {t('notifications.sourcePrefix', {
            source: t(`notifications.sources.${notice.source}`),
          })}
        </span>

        {notice.action && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onActionClick && onActionClick(notice)}
          >
            {t(notice.action.labelKey)}
          </Button>
        )}
      </footer>
    </article>
  );
}

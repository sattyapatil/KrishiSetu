import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { EmptyState } from '@krishisetu/design-system';

export interface NotificationEmptyStateProps {
  readonly locale: Locale;
  readonly onResetFilter?: () => void;
  readonly className?: string;
}

export function NotificationEmptyState({
  locale,
  onResetFilter,
  className = '',
}: NotificationEmptyStateProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <EmptyState
      title={t('notifications.emptyStateTitle')}
      description={t('notifications.emptyStateDescription')}
      actionSlot={
        onResetFilter ? (
          <button
            type="button"
            onClick={onResetFilter}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              borderRadius: '0.375rem',
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '2.75rem',
            }}
          >
            {t('notifications.filterAll')}
          </button>
        ) : undefined
      }
      className={className}
    />
  );
}

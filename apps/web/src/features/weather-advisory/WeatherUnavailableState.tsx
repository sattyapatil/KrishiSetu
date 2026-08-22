import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { EmptyState } from '@krishisetu/design-system';

export interface WeatherUnavailableStateProps {
  readonly locale: Locale;
  readonly onRetry?: () => void;
  readonly className?: string;
}

export function WeatherUnavailableState({
  locale,
  className = '',
}: WeatherUnavailableStateProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <div
      className={`ks-weather-unavailable ${className}`}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        borderRadius: '0.75rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
      }}
    >
      <EmptyState
        title={t('weather.title')}
        description={t('weather.unavailableNotice')}
      />
    </div>
  );
}

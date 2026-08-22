import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { Alert } from '@krishisetu/design-system';

export interface WeatherStaleStateProps {
  readonly locale: Locale;
  readonly asOfTime: string;
  readonly className?: string;
}

export function WeatherStaleState({
  locale,
  className = '',
}: WeatherStaleStateProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <div className={`ks-weather-stale-notice ${className}`} style={{ marginBottom: '0.75rem' }}>
      <Alert
        variant="warning"
        title={t('weather.staleNotice')}
      />
    </div>
  );
}

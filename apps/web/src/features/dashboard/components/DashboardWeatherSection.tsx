import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { DistrictWeatherSummary } from '@krishisetu/weather-advisory';
import { DistrictWeatherCard } from '../../weather-advisory/index.js';

export interface DashboardWeatherSectionProps {
  readonly locale: Locale;
  readonly weather: DistrictWeatherSummary;
}

export function DashboardWeatherSection({
  locale,
  weather,
}: DashboardWeatherSectionProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <section aria-labelledby="weather-section-heading">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <h2
          id="weather-section-heading"
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: 0,
          }}
        >
          {t('weather.title')}
        </h2>

        <Link
          href={`/${locale}/weather`}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            textDecoration: 'none',
          }}
        >
          {t('common.showDetails')} &rarr;
        </Link>
      </div>

      <DistrictWeatherCard locale={locale} weather={weather} />
    </section>
  );
}

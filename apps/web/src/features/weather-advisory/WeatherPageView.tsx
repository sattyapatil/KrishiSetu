'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { getDistrictWeather, SYNTHETIC_DISTRICT_WEATHER } from '@krishisetu/weather-advisory';
import { DistrictWeatherCard } from './DistrictWeatherCard.js';
import { ArrowLeftIcon } from '../../components/icons.js';

export interface WeatherPageViewProps {
  readonly locale: Locale;
}

export function WeatherPageView({ locale }: WeatherPageViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const districtWeather =
    getDistrictWeather('pune') ?? SYNTHETIC_DISTRICT_WEATHER[0]!;

  return (
    <div style={{ maxWidth: '48rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/dashboard`}
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
          <span>{t('navigation.dashboard')}</span>
        </Link>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.25rem 0',
          }}
        >
          {t('weather.title')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('weather.subtitle')}
        </p>
      </div>

      <DistrictWeatherCard locale={locale} weather={districtWeather} />
    </div>
  );
}

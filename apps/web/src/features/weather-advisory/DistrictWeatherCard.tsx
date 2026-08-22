import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { DistrictWeatherSummary, isWeatherDataFresh } from '@krishisetu/weather-advisory';
import { StatusBadge, Alert } from '@krishisetu/design-system';
import { FiveDayForecast } from './FiveDayForecast.js';
import { AgrometAdvisory } from './AgrometAdvisory.js';
import { WeatherStaleState } from './WeatherStaleState.js';

export interface DistrictWeatherCardProps {
  readonly weather: DistrictWeatherSummary;
  readonly locale: Locale;
  readonly asOfDate?: Date;
  readonly className?: string;
}

export function DistrictWeatherCard({
  weather,
  locale,
  asOfDate = new Date('2026-08-22T08:00:00Z'),
  className = '',
}: DistrictWeatherCardProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const isFresh = isWeatherDataFresh(weather, asOfDate, 24);

  return (
    <article
      aria-labelledby={`weather-heading-${weather.districtId}`}
      className={`ks-district-weather-card ${className}`}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        borderRadius: '0.75rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3
              id={`weather-heading-${weather.districtId}`}
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--ks-color-civic-blue-dark, #172554)',
              }}
            >
              {t(weather.districtNameKey)}
            </h3>
            {weather.talukaNameKey && (
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--ks-color-text-muted, #475569)',
                  backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--ks-color-border, #cbd5e1)',
                }}
              >
                {t(weather.talukaNameKey)}
              </span>
            )}
          </div>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.8125rem',
              color: 'var(--ks-color-text-muted, #475569)',
            }}
          >
            {t('weather.subtitle')}
          </p>
        </div>

        <StatusBadge
          status="ready"
          label={t('weather.prototypeBadge')}
        />
      </header>

      {!isFresh && (
        <WeatherStaleState locale={locale} asOfTime={weather.asOfTime} />
      )}

      {/* Warnings */}
      {weather.warnings.length > 0 && (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {weather.warnings.map((warning) => (
            <Alert
              key={warning.code}
              variant={warning.severity === 'RED' ? 'error' : 'warning'}
              title={t(warning.titleKey)}
            >
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem' }}>
                {t(warning.instructionKey)}
              </p>
            </Alert>
          ))}
        </div>
      )}

      {/* Current Conditions Metric Grid */}
      <section
        aria-label={t('weather.currentCondition')}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(8rem, 1fr))',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
          borderRadius: '0.5rem',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', marginBottom: '0.25rem' }}>
            {t('weather.currentCondition')}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
            {weather.temperatureCelsius}°C
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ks-color-text, #0f172a)' }}>
            {t(`weather.conditions.${weather.conditionCode}`)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', marginBottom: '0.25rem' }}>
            {t('weather.rainfall24h')}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
            {weather.rainfallMm24h} {t('weather.units.mm')}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', marginBottom: '0.25rem' }}>
            {t('weather.humidity')}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
            {weather.relativeHumidityPercent}%
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', marginBottom: '0.25rem' }}>
            {t('weather.windSpeed')}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
            {weather.windSpeedKmh} {t('weather.units.kmh')}
          </div>
        </div>
      </section>

      {/* 5-Day Forecast */}
      <FiveDayForecast forecast={weather.forecast} locale={locale} />

      {/* Agromet Advisory */}
      <AgrometAdvisory advisory={weather.agrometAdvisory} locale={locale} />
    </article>
  );
}

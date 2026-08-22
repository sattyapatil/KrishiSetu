import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { DailyForecast } from '@krishisetu/weather-advisory';
import { ForecastTable } from './ForecastTable.js';

export interface FiveDayForecastProps {
  readonly forecast: readonly DailyForecast[];
  readonly locale: Locale;
  readonly className?: string;
}

export function FiveDayForecast({
  forecast,
  locale,
  className = '',
}: FiveDayForecastProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');

  return (
    <div className={`ks-five-day-forecast ${className}`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue-dark, #172554)',
          }}
        >
          {t('weather.fiveDayForecast')}
        </h4>

        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            aria-pressed={viewMode === 'visual'}
            style={{
              minHeight: '2.75rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '0.375rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              backgroundColor:
                viewMode === 'visual'
                  ? 'var(--ks-color-civic-blue, #1e3a8a)'
                  : 'var(--ks-color-surface-card, #ffffff)',
              color:
                viewMode === 'visual'
                  ? 'var(--ks-color-surface-card, #ffffff)'
                  : 'var(--ks-color-text, #0f172a)',
              cursor: 'pointer',
            }}
          >
            {t('weather.viewVisual')}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            aria-pressed={viewMode === 'table'}
            style={{
              minHeight: '2.75rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '0.375rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              backgroundColor:
                viewMode === 'table'
                  ? 'var(--ks-color-civic-blue, #1e3a8a)'
                  : 'var(--ks-color-surface-card, #ffffff)',
              color:
                viewMode === 'table'
                  ? 'var(--ks-color-surface-card, #ffffff)'
                  : 'var(--ks-color-text, #0f172a)',
              cursor: 'pointer',
            }}
          >
            {t('weather.viewTable')}
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <ForecastTable forecast={forecast} locale={locale} />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(6rem, 1fr))',
            gap: '0.625rem',
          }}
        >
          {forecast.map((day) => (
            <div
              key={day.date}
              style={{
                padding: '0.75rem 0.5rem',
                backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                borderRadius: '0.5rem',
                border: '1px solid var(--ks-color-border, #cbd5e1)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--ks-color-text, #0f172a)',
                }}
              >
                {t(day.dayOfWeekKey).slice(0, 3)}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--ks-color-text-muted, #475569)',
                }}
              >
                {day.date.slice(5)}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                  margin: '0.25rem 0',
                }}
              >
                {t(`weather.conditions.${day.conditionCode}`)}
              </span>
              <div
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--ks-color-text, #0f172a)',
                }}
              >
                <strong>{day.tempMinCelsius}°</strong> / {day.tempMaxCelsius}°
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--ks-color-text-muted, #475569)',
                  backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--ks-color-border, #cbd5e1)',
                }}
              >
                {day.expectedRainfallMm} mm ({day.rainfallProbabilityPercent}%)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

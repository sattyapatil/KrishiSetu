import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { DailyForecast } from '@krishisetu/weather-advisory';

export interface ForecastTableProps {
  readonly forecast: readonly DailyForecast[];
  readonly locale: Locale;
  readonly className?: string;
}

export function ForecastTable({
  forecast,
  locale,
  className = '',
}: ForecastTableProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <div
      className={`ks-forecast-table-wrapper ${className}`}
      style={{
        overflowX: 'auto',
        borderRadius: '0.5rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          textAlign: 'left',
        }}
      >
        <caption
          style={{
            padding: '0.75rem 1rem',
            textAlign: 'left',
            fontSize: '0.8125rem',
            color: 'var(--ks-color-text-muted, #475569)',
            backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
            borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
          }}
        >
          {t('weather.forecastTableSummary')}
        </caption>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              borderBottom: '2px solid var(--ks-color-border, #cbd5e1)',
            }}
          >
            <th
              scope="col"
              style={{
                padding: '0.75rem 1rem',
                fontWeight: 700,
                color: 'var(--ks-color-text, #0f172a)',
              }}
            >
              {t('weather.tableHeaders.date')}
            </th>
            <th
              scope="col"
              style={{
                padding: '0.75rem 1rem',
                fontWeight: 700,
                color: 'var(--ks-color-text, #0f172a)',
              }}
            >
              {t('weather.tableHeaders.condition')}
            </th>
            <th
              scope="col"
              style={{
                padding: '0.75rem 1rem',
                fontWeight: 700,
                color: 'var(--ks-color-text, #0f172a)',
              }}
            >
              {t('weather.tableHeaders.temperature')}
            </th>
            <th
              scope="col"
              style={{
                padding: '0.75rem 1rem',
                fontWeight: 700,
                color: 'var(--ks-color-text, #0f172a)',
              }}
            >
              {t('weather.tableHeaders.rainfall')}
            </th>
            <th
              scope="col"
              style={{
                padding: '0.75rem 1rem',
                fontWeight: 700,
                color: 'var(--ks-color-text, #0f172a)',
              }}
            >
              {t('weather.tableHeaders.probability')}
            </th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((day) => (
            <tr
              key={day.date}
              style={{
                borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
                backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
              }}
            >
              <th
                scope="row"
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 600,
                  color: 'var(--ks-color-text, #0f172a)',
                  whiteSpace: 'nowrap',
                }}
              >
                <div>{t(day.dayOfWeekKey)}</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--ks-color-text-muted, #475569)',
                    fontWeight: 400,
                  }}
                >
                  {day.date}
                </div>
              </th>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  color: 'var(--ks-color-text, #0f172a)',
                }}
              >
                {t(`weather.conditions.${day.conditionCode}`)}
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  color: 'var(--ks-color-text, #0f172a)',
                  whiteSpace: 'nowrap',
                }}
              >
                <strong>{day.tempMinCelsius}°</strong> / {day.tempMaxCelsius}°C
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  color: 'var(--ks-color-text, #0f172a)',
                  whiteSpace: 'nowrap',
                }}
              >
                {day.expectedRainfallMm} {t('weather.units.mm')}
              </td>
              <td
                style={{
                  padding: '0.75rem 1rem',
                  color: 'var(--ks-color-text, #0f172a)',
                }}
              >
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor:
                      day.rainfallProbabilityPercent >= 70
                        ? 'var(--ks-color-civic-blue-light, #dbeafe)'
                        : 'var(--ks-color-surface-page, #f8fafc)',
                    color:
                      day.rainfallProbabilityPercent >= 70
                        ? 'var(--ks-color-civic-blue, #1e3a8a)'
                        : 'var(--ks-color-text, #0f172a)',
                    borderRadius: '0.25rem',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                >
                  {day.rainfallProbabilityPercent}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

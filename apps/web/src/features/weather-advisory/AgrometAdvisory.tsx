import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { AgrometAdvisory as AgrometData } from '@krishisetu/weather-advisory';

export interface AgrometAdvisoryProps {
  readonly advisory: AgrometData;
  readonly locale: Locale;
  readonly className?: string;
}

export function AgrometAdvisory({
  advisory,
  locale,
  className = '',
}: AgrometAdvisoryProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const formattedValidUntil = advisory.validUntil.split('T')[0] ?? '';

  return (
    <section
      aria-labelledby="agromet-advisory-title"
      className={`ks-agromet-advisory ${className}`}
      style={{
        marginTop: '1.25rem',
        padding: '1.25rem',
        backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
        borderRadius: '0.75rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.875rem',
        }}
      >
        <h4
          id="agromet-advisory-title"
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue-dark, #172554)',
          }}
        >
          {t('weather.agrometTitle')}
        </h4>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--ks-color-text-muted, #475569)',
            fontWeight: 500,
          }}
        >
          {t('weather.validUntil', { date: formattedValidUntil })}
        </span>
      </header>

      {/* General Advice */}
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderLeft: '4px solid var(--ks-color-civic-blue, #1e3a8a)',
          borderRadius: '0 0.375rem 0.375rem 0',
          borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
          borderRight: '1px solid var(--ks-color-border, #cbd5e1)',
          borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
          marginBottom: '1rem',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
            color: 'var(--ks-color-text, #0f172a)',
          }}
        >
          {t(advisory.generalAdviceKey)}
        </p>
      </div>

      {/* Crop-specific bullet points */}
      <div style={{ display: 'grid', gap: '0.625rem' }}>
        {advisory.cropBulletins.map((bulletin, idx) => (
          <div
            key={idx}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
              borderRadius: '0.5rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.375rem',
              }}
            >
              <strong
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                }}
              >
                {t(bulletin.cropNameKey)}
              </strong>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--ks-color-text-muted, #475569)',
                  backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--ks-color-border, #cbd5e1)',
                }}
              >
                {t(bulletin.stageKey)}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.8125rem',
                lineHeight: '1.25rem',
                color: 'var(--ks-color-text, #0f172a)',
              }}
            >
              {t(bulletin.advisoryKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

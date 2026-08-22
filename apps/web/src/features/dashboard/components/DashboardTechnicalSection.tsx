import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { DashboardTechnicalDetails } from '../types/dashboard-view-model.js';

export interface DashboardTechnicalSectionProps {
  readonly locale: Locale;
  readonly technicalDetails: DashboardTechnicalDetails;
}

export function DashboardTechnicalSection({
  locale,
  technicalDetails,
}: DashboardTechnicalSectionProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  return (
    <details
      style={{
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        borderRadius: 'var(--ks-radius-md, 0.5rem)',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
      }}
    >
      <summary
        style={{
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: 'var(--ks-color-text-muted, #475569)',
          outline: 'none',
        }}
      >
        {t('common.technicalDetails')} (Synthetic Verification Trace)
      </summary>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span><strong>Audit Tracking ID:</strong> {technicalDetails.auditTrackingId}</span>
          <span><strong>Consent Granted:</strong> {technicalDetails.consentGrantTime}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong>Active Scopes:</strong>
          {technicalDetails.activeScopes.map((scope) => (
            <span
              key={scope}
              style={{
                padding: '0.125rem 0.375rem',
                backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                borderRadius: '0.25rem',
                border: '1px solid var(--ks-color-border, #cbd5e1)',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              {scope}
            </span>
          ))}
        </div>

        <div>
          <strong style={{ display: 'block', marginBottom: '0.375rem' }}>Simulated Data Source Latency:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.5rem' }}>
            {technicalDetails.dataSources.map((ds) => (
              <div
                key={ds.name}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{ds.name}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ds.latencyMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

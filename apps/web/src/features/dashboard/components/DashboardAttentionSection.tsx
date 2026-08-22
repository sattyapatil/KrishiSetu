import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { StatusBadge } from '@krishisetu/design-system';
import { ArrowRightIcon } from '../../../components/icons.js';
import { DashboardActionItem } from '../types/dashboard-view-model.js';

export interface DashboardAttentionSectionProps {
  readonly locale: Locale;
  readonly actionItems: readonly DashboardActionItem[];
}

export function DashboardAttentionSection({
  locale,
  actionItems,
}: DashboardAttentionSectionProps): React.JSX.Element | null {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  if (actionItems.length === 0) return null;

  return (
    <section aria-labelledby="attention-heading">
      <h2
        id="attention-heading"
        style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          margin: '0 0 0.75rem 0',
        }}
      >
        What Needs Your Attention
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {actionItems.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
              borderRadius: 'var(--ks-radius-md, 0.5rem)',
              borderLeft: '4px solid var(--ks-color-error, #dc2626)',
              borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
              borderRight: '1px solid var(--ks-color-border, #cbd5e1)',
              borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <StatusBadge status="needsAction" label="Urgent Deadline" />
                {item.deadlineDate && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--ks-color-error-dark, #991b1b)', fontWeight: 600 }}>
                    Deadline: {item.deadlineDate}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                {t(item.titleKey)}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                {t(item.descriptionKey)}
              </p>
            </div>

            <Link
              href={`/${locale}/schemes`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                minHeight: '2.5rem',
                padding: '0.375rem 0.875rem',
                backgroundColor: 'var(--ks-color-civic-blue, #1e3a8a)',
                color: 'var(--ks-color-surface-card, #ffffff)',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <span>{t(item.actionLabelKey)}</span>
              <ArrowRightIcon size={16} aria-hidden={true} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

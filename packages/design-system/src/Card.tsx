import React from 'react';

export interface CardProps {
  readonly id?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly children: React.ReactNode;
  readonly footerSlot?: React.ReactNode;
  readonly className?: string;
}

export function Card({
  id,
  title,
  subtitle,
  children,
  footerSlot,
  className = '',
}: CardProps): React.JSX.Element {
  return (
    <div
      id={id}
      className={`ks-card ${className}`}
      style={{
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
        borderRadius: '0.75rem',
        boxShadow: 'var(--ks-shadow-card, 0 1px 2px rgb(15 23 42 / 0.08))',
        padding: '1.25rem',
        marginBottom: '1rem',
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: '1rem' }}>
          {title && (
            <h2 style={{ margin: 0, fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', lineHeight: '1.25rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div>{children}</div>
      {footerSlot && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--ks-color-border, #cbd5e1)' }}>
          {footerSlot}
        </div>
      )}
    </div>
  );
}

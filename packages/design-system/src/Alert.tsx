import React from 'react';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success';

export interface AlertProps {
  readonly variant?: AlertVariant;
  readonly title?: string;
  readonly children?: React.ReactNode;
  readonly className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  className = '',
}: AlertProps): React.JSX.Element {
  const getConfig = () => {
    switch (variant) {
      case 'warning':
        return {
          backgroundColor: 'var(--ks-color-warning-surface, #fef3c7)',
          color: 'var(--ks-color-warning-text, #78350f)',
          borderColor: 'var(--ks-color-warning-border, #fde68a)',
          icon: '⚠',
          role: 'status',
        };
      case 'error':
        return {
          backgroundColor: 'var(--ks-color-error-surface, #fef2f2)',
          color: 'var(--ks-color-error-dark, #991b1b)',
          borderColor: 'var(--ks-color-error-border, #fecaca)',
          icon: '✕',
          role: 'alert',
        };
      case 'success':
        return {
          backgroundColor: 'var(--ks-color-success-surface, #f0fdf4)',
          color: 'var(--ks-color-success-dark, #166534)',
          borderColor: 'var(--ks-color-success-border, #86efac)',
          role: 'status',
          icon: '✓',
        };
      case 'info':
      default:
        return {
          backgroundColor: 'var(--ks-color-civic-blue-light, #dbeafe)',
          color: 'var(--ks-color-civic-blue-dark, #172554)',
          borderColor: 'var(--ks-color-info-border, #bfdbfe)',
          icon: 'ℹ',
          role: 'status',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      role={config.role}
      className={`ks-alert ks-alert--${variant} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: '0.5rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: config.borderColor,
        backgroundColor: config.backgroundColor,
        color: config.color,
        marginBottom: '1rem',
      }}
    >
      <span aria-hidden="true" style={{ fontWeight: 800, fontSize: '1.125rem', marginTop: '0.125rem' }}>
        {config.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 700, color: 'inherit' }}>
            {title}
          </h3>
        )}
        <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}>{children}</div>
      </div>
    </div>
  );
}

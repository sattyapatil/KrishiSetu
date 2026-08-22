import React from 'react';

export type StatusType = 'ready' | 'needsAction' | 'unavailable' | 'error' | 'mockResult';

export interface StatusBadgeProps {
  readonly status: StatusType;
  readonly label?: string;
  readonly className?: string;
}

export function StatusBadge({
  status,
  label,
  className = '',
}: StatusBadgeProps): React.JSX.Element {
  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return {
          defaultLabel: 'Ready',
          color: 'var(--ks-color-success-dark, #166534)',
          backgroundColor: 'var(--ks-color-success-surface, #f0fdf4)',
          borderColor: 'var(--ks-color-success-border, #86efac)',
          icon: '✓',
        };
      case 'needsAction':
        return {
          defaultLabel: 'Needs Action',
          color: 'var(--ks-color-warning-text, #78350f)',
          backgroundColor: 'var(--ks-color-warning-surface, #fef3c7)',
          borderColor: 'var(--ks-color-warning-border, #fde68a)',
          icon: '!',
        };
      case 'error':
        return {
          defaultLabel: 'Blocked',
          color: 'var(--ks-color-error-dark, #991b1b)',
          backgroundColor: 'var(--ks-color-error-surface, #fef2f2)',
          borderColor: 'var(--ks-color-error-border, #fecaca)',
          icon: '✕',
        };
      case 'mockResult':
        return {
          defaultLabel: 'Mock Result',
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          backgroundColor: 'var(--ks-color-civic-blue-light, #dbeafe)',
          borderColor: 'var(--ks-color-info-border, #bfdbfe)',
          icon: 'ℹ',
        };
      case 'unavailable':
      default:
        return {
          defaultLabel: 'Unavailable',
          color: 'var(--ks-color-text-muted, #475569)',
          backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
          borderColor: 'var(--ks-color-border, #cbd5e1)',
          icon: '—',
        };
    }
  };

  const config = getStatusConfig();
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={`ks-status ks-status--${status} ${className}`}
      data-status={status}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        minHeight: '1.75rem',
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: config.borderColor,
        color: config.color,
        backgroundColor: config.backgroundColor,
        fontSize: '0.75rem',
        lineHeight: '1rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true" style={{ fontWeight: 800 }}>
        {config.icon}
      </span>
      <span>{displayLabel}</span>
    </span>
  );
}

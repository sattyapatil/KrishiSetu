import React from 'react';

export interface StepItem {
  readonly id: string;
  readonly label: string;
  readonly status: 'completed' | 'current' | 'upcoming';
}

export interface ProgressIndicatorProps {
  readonly steps: readonly StepItem[];
  readonly className?: string;
}

export function ProgressIndicator({
  steps,
  className = '',
}: ProgressIndicatorProps): React.JSX.Element {
  return (
    <nav aria-label="Progress Steps" className={`ks-progress ${className}`} style={{ margin: '1rem 0' }}>
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: '0.5rem',
        }}
      >
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <li
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent
                    ? 'var(--ks-color-civic-blue, #1e3a8a)'
                    : isCompleted
                    ? 'var(--ks-color-success-dark, #166534)'
                    : 'var(--ks-color-text-muted, #475569)',
                }}
              >
                <span
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCompleted
                      ? 'var(--ks-color-success-dark, #166534)'
                      : isCurrent
                      ? 'var(--ks-color-civic-blue, #1e3a8a)'
                      : 'var(--ks-color-surface-page, #f8fafc)',
                    color: isCompleted || isCurrent ? 'var(--ks-color-surface-card, #ffffff)' : 'var(--ks-color-text-muted, #475569)',
                    border: `2px solid ${isCompleted ? 'var(--ks-color-success-dark, #166534)' : isCurrent ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-border, #cbd5e1)'}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {isCompleted ? '✓' : idx + 1}
                </span>
                <span>{step.label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Skeleton({
  width = '100%',
  height = '1.5rem',
  borderRadius = '0.375rem',
  className = '',
}: {
  readonly width?: string;
  readonly height?: string;
  readonly borderRadius?: string;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`ks-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--ks-color-disabled-surface, #e2e8f0)',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />
  );
}

export function EmptyState({
  title,
  description,
  actionSlot,
  className = '',
}: {
  readonly title: string;
  readonly description: string;
  readonly actionSlot?: React.ReactNode;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <div
      className={`ks-empty-state ${className}`}
      style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
        borderRadius: '0.75rem',
        border: '1px dashed var(--ks-color-border, #cbd5e1)',
        margin: '1rem 0',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
        {description}
      </p>
      {actionSlot}
    </div>
  );
}

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}: {
  readonly title: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <div
      role="alert"
      className={`ks-error-state ${className}`}
      style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--ks-color-error-surface, #fef2f2)',
        borderRadius: '0.75rem',
        border: '1px solid var(--ks-color-error-border, #fecaca)',
        color: 'var(--ks-color-error-dark, #991b1b)',
        margin: '1rem 0',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 700, color: 'inherit' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'inherit' }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            minHeight: '2.75rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.375rem',
            backgroundColor: 'var(--ks-color-error-dark, #991b1b)',
            color: 'var(--ks-color-surface-card, #ffffff)',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

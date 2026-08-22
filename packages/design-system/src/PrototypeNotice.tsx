import React from 'react';

export interface PrototypeNoticeProps {
  readonly message?: string;
  readonly className?: string;
}

/**
 * Persistent prototype disclosure notice displayed on all public and authenticated routes.
 * Height: min 32px; Warning colors (Amber-50 background, Amber-900 text).
 */
export function PrototypeNotice({
  message = 'Hackathon prototype • Not a government website • All records are fictional',
  className = '',
}: PrototypeNoticeProps): React.JSX.Element {
  return (
    <div
      role="note"
      aria-label="Prototype Disclosure"
      className={`ks-prototype-notice ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '2rem',
        padding: '0.4375rem 1rem',
        color: 'var(--ks-color-warning-text, #78350f)',
        backgroundColor: 'var(--ks-color-warning-surface, #fef3c7)',
        fontSize: 'var(--ks-font-size-xs, 0.75rem)',
        lineHeight: 'var(--ks-line-height-xs, 1.125rem)',
        fontWeight: 'var(--ks-font-weight-semibold, 600)',
        textAlign: 'center',
        borderBottom: '1px solid #fde68a',
      }}
    >
      <span>{message}</span>
    </div>
  );
}

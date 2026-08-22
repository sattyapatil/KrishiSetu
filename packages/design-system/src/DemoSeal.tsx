import React from 'react';
import { BrandMark } from './BrandMark';

export interface DemoSealProps {
  readonly className?: string;
  readonly size?: number;
}

/**
 * Original DEMO trust seal for hackathon prototype mode.
 * Strictly non-official: contains NO State Emblem, Lion Capital, or Ashoka Chakra.
 */
export function DemoSeal({
  className = '',
  size = 48,
}: DemoSealProps): React.JSX.Element {
  return (
    <div
      className={`ks-header-authority-slot ${className}`}
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '0.375rem',
        border: '1px dashed var(--ks-color-border, #cbd5e1)',
        backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <BrandMark size={24} />
      <span
        style={{
          fontSize: '0.625rem',
          lineHeight: '0.75rem',
          fontWeight: 700,
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          letterSpacing: '0.05em',
          marginTop: '1px',
        }}
      >
        DEMO
      </span>
    </div>
  );
}

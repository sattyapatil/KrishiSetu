import React from 'react';
import { PrototypeNotice } from './PrototypeNotice';
import { DemoSeal } from './DemoSeal';
import { BrandLockup } from './BrandLockup';

export interface HeaderProps {
  readonly title?: string;
  readonly motto?: string;
  readonly prototypeMessage?: string;
  readonly homeHref?: string;
  readonly utilitySlot?: React.ReactNode;
  readonly className?: string;
}

/**
 * KrishiSetu standard mobile-first accessible header.
 * Conforms to UX4G 3.0 / GIGW 3.0 / WCAG 2.1 AA specifications.
 */
export function Header({
  title = 'KrishiSetu',
  motto = 'अन्नदः सर्वदश्चैव',
  prototypeMessage,
  homeHref = '/',
  utilitySlot,
  className = '',
}: HeaderProps): React.JSX.Element {
  return (
    <header className={`ks-header ${className}`} style={{ width: '100%' }}>
      {/* 1. Top persistent prototype disclosure */}
      <PrototypeNotice message={prototypeMessage} />

      {/* 2. Main brand row */}
      <div
        className="ks-header-brand-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '3.5rem minmax(0, 1fr)',
          columnGap: '0.75rem',
          alignItems: 'center',
          minHeight: '4.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
        }}
      >
        {/* Left authority slot with original DEMO seal */}
        <DemoSeal size={48} />

        {/* Right title + logo mark + Sanskrit motto cluster */}
        <BrandLockup title={title} motto={motto} homeHref={homeHref} />
      </div>

      {/* 3. Utility / Navigation row (when provided) */}
      {utilitySlot && (
        <div
          className="ks-header-utility-row"
          style={{
            minHeight: '3rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
            borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {utilitySlot}
        </div>
      )}
    </header>
  );
}

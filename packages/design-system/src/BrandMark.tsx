import React from 'react';

export interface BrandMarkProps {
  readonly size?: number | string;
  readonly className?: string;
  readonly accessibleLabel?: string;
}

/**
 * KrishiSetu minimalist SVG symbol combining:
 * 1. Civic Blue single-span bridge arch with piers
 * 2. Three circular data nodes (left, crown, right)
 * 3. Agri Green agricultural furrow/leaf curves
 */
export function BrandMark({
  size = 40,
  className = '',
  accessibleLabel,
}: BrandMarkProps): React.JSX.Element {
  const isDecorative = !accessibleLabel;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`ks-brand-mark ${className}`}
      aria-hidden={isDecorative ? 'true' : undefined}
      role={isDecorative ? 'presentation' : 'img'}
      aria-label={accessibleLabel}
      focusable="false"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Bridge Deck & Arch (Civic Blue) */}
      <path
        d="M10 34 Q32 14 54 34"
        fill="none"
        stroke="var(--ks-color-civic-blue, #1e3a8a)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 34 H54"
        fill="none"
        stroke="var(--ks-color-civic-blue, #1e3a8a)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Piers */}
      <path
        d="M18 34 V42 M46 34 V42"
        fill="none"
        stroke="var(--ks-color-civic-blue, #1e3a8a)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Data Nodes */}
      <circle cx="10" cy="34" r="3.5" fill="var(--ks-color-civic-blue, #1e3a8a)" />
      <circle cx="32" cy="19" r="3.5" fill="var(--ks-color-civic-blue, #1e3a8a)" />
      <circle cx="54" cy="34" r="3.5" fill="var(--ks-color-civic-blue, #1e3a8a)" />

      {/* Field Furrows / Leaf (Agri Green) */}
      <path
        d="M14 46 Q32 36 50 46"
        fill="none"
        stroke="var(--ks-color-agri-green, #166534)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 52 Q32 44 44 52"
        fill="none"
        stroke="var(--ks-color-agri-green, #166534)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 41 V54"
        fill="none"
        stroke="var(--ks-color-agri-green, #166534)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

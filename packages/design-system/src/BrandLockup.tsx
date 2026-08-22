import React from 'react';
import { BrandMark } from './BrandMark';

export interface BrandLockupProps {
  readonly title?: string;
  readonly motto?: string;
  readonly homeHref?: string;
  readonly className?: string;
}

export function BrandLockup({
  title = 'KrishiSetu',
  motto = 'अन्नदः सर्वदश्चैव',
  homeHref = '/',
  className = '',
}: BrandLockupProps): React.JSX.Element {
  return (
    <a
      href={homeHref}
      className={`ks-brand-lockup ${className}`}
      aria-label={`${title} - ${motto}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <span
        className="ks-brand-title-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          className="ks-brand-title"
          style={{
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            fontSize: '1.25rem',
            lineHeight: '1.75rem',
            fontWeight: 700,
          }}
        >
          {title}
        </span>
        <BrandMark size={36} />
      </span>
      <span
        className="ks-brand-motto"
        lang="sa-Deva"
        style={{
          marginTop: '2px',
          color: 'var(--ks-color-text-muted, #475569)',
          fontFamily: 'var(--ks-font-devanagari, "Noto Sans Devanagari", sans-serif)',
          fontSize: '0.75rem',
          lineHeight: '1.125rem',
          fontWeight: 400,
        }}
      >
        {motto}
      </span>
    </a>
  );
}

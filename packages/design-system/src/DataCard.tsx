import React, { useState } from 'react';
import { StatusBadge, StatusType } from './StatusBadge';

export interface DataCardProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly primaryValue: string;
  readonly unit?: string;
  readonly summary: string;
  readonly status?: StatusType;
  readonly statusLabel?: string;
  readonly showDetailsText?: string;
  readonly hideDetailsText?: string;
  readonly detailsChildren?: React.ReactNode;
  readonly footerSlot?: React.ReactNode;
  readonly className?: string;
}

export function DataCard({
  id,
  eyebrow,
  title,
  primaryValue,
  unit,
  summary,
  status = 'ready',
  statusLabel,
  showDetailsText = 'Show details',
  hideDetailsText = 'Hide details',
  detailsChildren,
  footerSlot,
  className = '',
}: DataCardProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const titleId = `${id}-title`;
  const detailsId = `${id}-details`;

  return (
    <article
      id={id}
      aria-labelledby={titleId}
      className={`ks-data-card ${className}`}
      style={{
        overflow: 'hidden',
        padding: '1rem',
        backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
        borderRadius: '0.75rem',
        boxShadow: 'var(--ks-shadow-card, 0 1px 2px rgb(15 23 42 / 0.08))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header with Eyebrow, Title, and Status Badge */}
      <header
        className="ks-data-card__header"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div>
          <p
            className="ks-data-card__eyebrow"
            style={{
              margin: '0 0 0.25rem 0',
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
              fontSize: '0.75rem',
              lineHeight: '1.125rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className="ks-data-card__title"
            style={{
              margin: 0,
              fontSize: '1.125rem',
              lineHeight: '1.6875rem',
              fontWeight: 700,
              color: 'var(--ks-color-text, #0f172a)',
            }}
          >
            {title}
          </h2>
        </div>
        <StatusBadge status={status} label={statusLabel} />
      </header>

      {/* 2. Primary Large Value */}
      <p
        className="ks-data-card__value"
        style={{
          margin: '1rem 0 0 0',
          fontSize: '1.5rem',
          lineHeight: '2.25rem',
          fontWeight: 700,
          color: 'var(--ks-color-text, #0f172a)',
        }}
      >
        {primaryValue} {unit && <span style={{ fontSize: '1rem', fontWeight: 400 }}>{unit}</span>}
      </p>

      {/* 3. Plain Language Summary */}
      <p
        className="ks-data-card__summary"
        style={{
          margin: '0.25rem 0 0.75rem 0',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          color: 'var(--ks-color-text, #0f172a)',
        }}
      >
        {summary}
      </p>

      {/* 4. Progressive Disclosure Button */}
      {detailsChildren && (
        <button
          type="button"
          aria-expanded={isExpanded ? 'true' : 'false'}
          aria-controls={detailsId}
          className="ks-disclosure"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            minHeight: '3rem',
            padding: '0.5rem 0.75rem',
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '0.25rem',
            fontFamily: 'inherit',
            fontSize: '1rem',
            lineHeight: '1.5rem',
            fontWeight: 700,
            textAlign: 'start',
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{isExpanded ? hideDetailsText : showDetailsText}</span>
          <span aria-hidden="true">{isExpanded ? '▲' : '▼'}</span>
        </button>
      )}

      {/* 5. Expanded Technical Details Region */}
      {detailsChildren && isExpanded && (
        <div
          id={detailsId}
          className="ks-data-card__details"
          style={{
            margin: '0.75rem -1rem -1rem -1rem',
            padding: '1rem',
            backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
            borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
            borderBottomLeftRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
          }}
        >
          {detailsChildren}
        </div>
      )}

      {/* 6. Card Footer Slot */}
      {footerSlot && (
        <div
          className="ks-data-card__footer"
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
          }}
        >
          {footerSlot}
        </div>
      )}
    </article>
  );
}

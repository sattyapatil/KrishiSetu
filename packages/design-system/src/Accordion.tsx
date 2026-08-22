import React, { useState } from 'react';

export interface AccordionItem {
  readonly id: string;
  readonly title: string;
  readonly content: React.ReactNode;
}

export interface AccordionProps {
  readonly items: readonly AccordionItem[];
  readonly defaultExpandedId?: string;
  readonly className?: string;
}

export function Accordion({
  items,
  defaultExpandedId,
  className = '',
}: AccordionProps): React.JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId || null);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div
      className={`ks-accordion ${className}`}
      style={{
        border: '1px solid var(--ks-color-border, #cbd5e1)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
    >
      {items.map((item, index) => {
        const isExpanded = expandedId === item.id;
        const headerId = `${item.id}-header`;
        const panelId = `${item.id}-panel`;

        return (
          <div
            key={item.id}
            style={{
              borderTop: index > 0 ? '1px solid var(--ks-color-border, #cbd5e1)' : 'none',
            }}
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isExpanded ? 'true' : 'false'}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  minHeight: '3rem',
                  padding: '0.875rem 1.25rem',
                  backgroundColor: isExpanded ? 'var(--ks-color-surface-page, #f8fafc)' : '#ffffff',
                  border: 'none',
                  textAlign: 'start',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--ks-color-text, #0f172a)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <span>{item.title}</span>
                <span aria-hidden="true" style={{ fontSize: '0.875rem' }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </button>
            </h3>
            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: '#ffffff',
                  borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: string;
  readonly isActive?: boolean;
}

export interface NavigationProps {
  readonly items: readonly NavItem[];
  readonly orientation?: 'horizontal' | 'vertical' | 'mobileBottom';
  readonly className?: string;
}

export function Navigation({
  items,
  orientation = 'horizontal',
  className = '',
}: NavigationProps): React.JSX.Element {
  if (orientation === 'mobileBottom') {
    return (
      <nav
        aria-label="Mobile Navigation"
        className={`ks-mobile-nav ${className}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: '3.5rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0.25rem 0.5rem',
          zIndex: 1000,
        }}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-current={item.isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '2.75rem',
              minHeight: '3rem',
              padding: '0.25rem',
              textDecoration: 'none',
              color: item.isActive ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-text-muted, #475569)',
              fontWeight: item.isActive ? 700 : 500,
              fontSize: '0.75rem',
            }}
          >
            {item.icon && <span aria-hidden="true" style={{ fontSize: '1.125rem' }}>{item.icon}</span>}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Main Navigation"
      className={`ks-nav ${className}`}
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: '0.5rem',
        alignItems: orientation === 'vertical' ? 'stretch' : 'center',
      }}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-current={item.isActive ? 'page' : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            minHeight: '2.75rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            color: item.isActive ? '#ffffff' : 'var(--ks-color-text, #0f172a)',
            backgroundColor: item.isActive ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'transparent',
            fontWeight: item.isActive ? 700 : 500,
            fontSize: '0.875rem',
          }}
        >
          {item.icon && <span aria-hidden="true">{item.icon}</span>}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

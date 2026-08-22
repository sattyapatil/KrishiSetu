import React from 'react';
import { ButtonVariant } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly ariaLabel: string;
  readonly icon: React.ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  ariaLabel,
  icon,
  variant = 'outline',
  size = 'md',
  disabled,
  className = '',
  style,
  ...props
}: IconButtonProps): React.JSX.Element {
  const dimension = size === 'sm' ? '2.75rem' : size === 'lg' ? '3.25rem' : '3rem';

  return (
    <button
      type={props.type || 'button'}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`ks-icon-button ks-button--${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        minWidth: '2.75rem',
        minHeight: '2.75rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--ks-color-border, #cbd5e1)',
        backgroundColor: variant === 'primary' ? 'var(--ks-color-agri-green, #166534)' : 'var(--ks-color-surface-card, #ffffff)',
        color: variant === 'primary' ? 'var(--ks-color-surface-card, #ffffff)' : 'var(--ks-color-civic-blue, #1e3a8a)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        ...style,
      }}
      {...props}
    >
      {icon}
    </button>
  );
}

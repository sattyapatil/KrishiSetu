import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly isLoading?: boolean;
  readonly loadingText?: string;
  readonly fullWidth?: boolean;
  readonly leadingIcon?: React.ReactNode;
  readonly trailingIcon?: React.ReactNode;
  readonly children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  className = '',
  style,
  ...props
}: ButtonProps): React.JSX.Element {
  const isDisabled = disabled || isLoading;

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: '#ffffff',
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          borderColor: 'var(--ks-color-civic-blue, #1e3a8a)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--ks-color-text, #0f172a)',
          borderColor: 'var(--ks-color-border, #cbd5e1)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--ks-color-error, #dc2626)',
          color: '#ffffff',
          borderColor: 'var(--ks-color-error, #dc2626)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          borderColor: 'transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--ks-color-agri-green, #166534)',
          color: '#ffffff',
          borderColor: 'var(--ks-color-agri-green, #166534)',
        };
    }
  };

  const getPaddingAndHeight = (): { minHeight: string; padding: string } => {
    switch (size) {
      case 'sm':
        return { minHeight: '2.75rem', padding: '0.5rem 1rem' };
      case 'lg':
        return { minHeight: '3.25rem', padding: '1rem 1.75rem' };
      case 'md':
      default:
        return { minHeight: '3rem', padding: '0.75rem 1.25rem' };
    }
  };

  const { minHeight, padding } = getPaddingAndHeight();

  return (
    <button
      type={props.type || 'button'}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      className={`ks-button ks-button--${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        minWidth: '2.75rem',
        minHeight,
        padding,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: '0.5rem',
        borderWidth: '2px',
        borderStyle: 'solid',
        fontSize: '1rem',
        lineHeight: '1.5rem',
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !isLoading ? 0.6 : 1,
        textDecoration: 'none',
        textAlign: 'center',
        transition: 'all 150ms ease-in-out',
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="ks-spinner"
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '1.125rem',
              height: '1.125rem',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
            }}
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
          <span>{children}</span>
          {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
        </>
      )}
    </button>
  );
}

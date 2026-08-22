import React from 'react';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly id: string;
  readonly label: string;
  readonly options: readonly SelectOption[];
  readonly helperText?: string;
  readonly errorMessage?: string;
  readonly fullWidth?: boolean;
}

export function Select({
  id,
  label,
  options,
  helperText,
  errorMessage,
  fullWidth = true,
  className = '',
  required,
  style,
  ...props
}: SelectProps): React.JSX.Element {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasError = Boolean(errorMessage);

  const describedBy = [
    helperText ? helperId : null,
    hasError ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`ks-form-group ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: fullWidth ? '100%' : 'auto',
        marginBottom: '1rem',
      }}
    >
      <label
        htmlFor={id}
        className="ks-label"
        style={{
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontWeight: 700,
          color: 'var(--ks-color-text, #0f172a)',
        }}
      >
        {label}
        {required && <span aria-hidden="true" style={{ color: 'var(--ks-color-error, #dc2626)', marginLeft: '0.25rem' }}>*</span>}
      </label>

      <select
        id={id}
        required={required}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        className={`ks-select ${hasError ? 'ks-select--error' : ''}`}
        style={{
          minHeight: '3rem',
          padding: '0.625rem 0.875rem',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          color: 'var(--ks-color-text, #0f172a)',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: hasError ? 'var(--ks-color-error, #dc2626)' : 'var(--ks-color-border, #cbd5e1)',
          borderRadius: '0.5rem',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {helperText && !hasError && (
        <span
          id={helperId}
          className="ks-helper-text"
          style={{
            fontSize: '0.75rem',
            lineHeight: '1.125rem',
            color: 'var(--ks-color-text-muted, #475569)',
          }}
        >
          {helperText}
        </span>
      )}

      {hasError && (
        <span
          id={errorId}
          role="alert"
          className="ks-error-text"
          style={{
            fontSize: '0.75rem',
            lineHeight: '1.125rem',
            fontWeight: 600,
            color: 'var(--ks-color-error-dark, #991b1b)',
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

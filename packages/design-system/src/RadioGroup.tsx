import React from 'react';

export interface RadioOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}

export interface RadioGroupProps {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly RadioOption[];
  readonly selectedValue: string;
  readonly onChange: (value: string) => void;
  readonly helperText?: string;
  readonly errorMessage?: string;
  readonly className?: string;
}

export function RadioGroup({
  name,
  legend,
  options,
  selectedValue,
  onChange,
  helperText,
  errorMessage,
  className = '',
}: RadioGroupProps): React.JSX.Element {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;
  const hasError = Boolean(errorMessage);

  return (
    <fieldset
      className={`ks-radio-group ${className}`}
      style={{
        border: 'none',
        padding: 0,
        margin: '0 0 1rem 0',
      }}
    >
      <legend
        style={{
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          fontWeight: 700,
          color: 'var(--ks-color-text, #0f172a)',
          marginBottom: '0.5rem',
        }}
      >
        {legend}
      </legend>

      {helperText && !hasError && (
        <p
          id={helperId}
          style={{
            fontSize: '0.75rem',
            lineHeight: '1.125rem',
            color: 'var(--ks-color-text-muted, #475569)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {helperText}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.map((opt) => {
          const optId = `${name}-${opt.value}`;
          const isSelected = selectedValue === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? 'var(--ks-color-civic-blue, #1e3a8a)' : 'var(--ks-color-border, #cbd5e1)',
                backgroundColor: isSelected ? 'var(--ks-color-civic-blue-light, #dbeafe)' : 'var(--ks-color-surface-card, #ffffff)',
                cursor: opt.disabled ? 'not-allowed' : 'pointer',
                opacity: opt.disabled ? 0.6 : 1,
              }}
            >
              <input
                id={optId}
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                style={{
                  marginTop: '0.125rem',
                  accentColor: 'var(--ks-color-civic-blue, #1e3a8a)',
                  cursor: opt.disabled ? 'not-allowed' : 'pointer',
                }}
              />
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ks-color-text, #0f172a)', display: 'block' }}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)', marginTop: '0.125rem', display: 'block' }}>
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {hasError && (
        <span
          id={errorId}
          role="alert"
          style={{
            fontSize: '0.75rem',
            lineHeight: '1.125rem',
            fontWeight: 600,
            color: 'var(--ks-color-error-dark, #991b1b)',
            marginTop: '0.375rem',
            display: 'block',
          }}
        >
          {errorMessage}
        </span>
      )}
    </fieldset>
  );
}

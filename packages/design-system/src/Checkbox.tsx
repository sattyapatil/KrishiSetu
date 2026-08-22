import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}

export function Checkbox({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
  className = '',
  ...props
}: CheckboxProps): React.JSX.Element {
  const descId = `${id}-desc`;

  return (
    <div
      className={`ks-checkbox-group ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        minHeight: '2.75rem',
        padding: '0.375rem 0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '1.5rem',
          minHeight: '1.5rem',
          marginTop: '0.125rem',
        }}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={description ? descId : undefined}
          className="ks-checkbox"
          style={{
            width: '1.25rem',
            height: '1.25rem',
            accentColor: 'var(--ks-color-agri-green, #166534)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          {...props}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label
          htmlFor={id}
          className="ks-checkbox-label"
          style={{
            fontSize: '1rem',
            lineHeight: '1.5rem',
            fontWeight: 600,
            color: 'var(--ks-color-text, #0f172a)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
        </label>

        {description && (
          <span
            id={descId}
            className="ks-checkbox-desc"
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              color: 'var(--ks-color-text-muted, #475569)',
              marginTop: '0.125rem',
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

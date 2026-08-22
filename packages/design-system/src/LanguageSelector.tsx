import React from 'react';
import { Locale, localeRegistry, SUPPORTED_LOCALES } from '@krishisetu/i18n';

export interface LanguageSelectorProps {
  readonly currentLocale: Locale;
  readonly onSelectLocale: (locale: Locale) => void;
  readonly className?: string;
}

export function LanguageSelector({
  currentLocale,
  onSelectLocale,
  className = '',
}: LanguageSelectorProps): React.JSX.Element {
  return (
    <div
      className={`ks-language-selector ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
    >
      <label htmlFor="ks-lang-select" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        Language / भाषा / ಭಾಷೆ
      </label>
      <select
        id="ks-lang-select"
        value={currentLocale}
        onChange={(e) => onSelectLocale(e.target.value as Locale)}
        aria-label="Select Interface Language"
        style={{
          minHeight: '2.75rem',
          minWidth: '7.5rem',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.375rem',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          color: 'var(--ks-color-civic-blue, #1e3a8a)',
          fontSize: '0.875rem',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {SUPPORTED_LOCALES.map((loc) => {
          const meta = localeRegistry.supported[loc];
          return (
            <option key={loc} value={loc} lang={meta.htmlLang}>
              {meta.nativeLabel} ({meta.label})
            </option>
          );
        })}
      </select>
    </div>
  );
}

/**
 * Authoritative Locale Registry for KrishiSetu.
 * Single source of truth for supported locales, default language, and font/direction metadata.
 */

export interface LocaleMetadata {
  readonly code: string;
  readonly label: string;
  readonly nativeLabel: string;
  readonly direction: 'ltr' | 'rtl';
  readonly font: 'latin' | 'devanagari' | 'kannada';
  readonly htmlLang: string;
}

export const localeRegistry = {
  defaultLocale: 'en',
  supported: {
    en: {
      code: 'en',
      label: 'English',
      nativeLabel: 'English',
      direction: 'ltr',
      font: 'latin',
      htmlLang: 'en',
    },
    mr: {
      code: 'mr',
      label: 'Marathi',
      nativeLabel: 'मराठी',
      direction: 'ltr',
      font: 'devanagari',
      htmlLang: 'mr',
    },
    hi: {
      code: 'hi',
      label: 'Hindi',
      nativeLabel: 'हिन्दी',
      direction: 'ltr',
      font: 'devanagari',
      htmlLang: 'hi',
    },
    kn: {
      code: 'kn',
      label: 'Kannada',
      nativeLabel: 'ಕನ್ನಡ',
      direction: 'ltr',
      font: 'kannada',
      htmlLang: 'kn',
    },
  },
  fallbackLocale: 'en',
} as const;

export type Locale = keyof typeof localeRegistry.supported;
export const SUPPORTED_LOCALES = Object.keys(localeRegistry.supported) as readonly Locale[];
export const DEFAULT_LOCALE: Locale = localeRegistry.defaultLocale;

export function isSupportedLocale(locale: string): locale is Locale {
  return Object.prototype.hasOwnProperty.call(localeRegistry.supported, locale);
}

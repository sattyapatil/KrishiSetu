import { Locale } from './locale-registry';

export const FONT_FAMILIES = {
  latin: 'var(--ks-font-latin, "Noto Sans", system-ui, sans-serif)',
  devanagari: 'var(--ks-font-devanagari, "Noto Sans Devanagari", "Noto Sans", system-ui, sans-serif)',
  kannada: 'var(--ks-font-kannada, "Noto Sans Kannada", "Noto Sans", system-ui, sans-serif)',
} as const;

export function getFontFamilyForLocale(locale: Locale): string {
  switch (locale) {
    case 'mr':
    case 'hi':
      return FONT_FAMILIES.devanagari;
    case 'kn':
      return FONT_FAMILIES.kannada;
    case 'en':
    default:
      return FONT_FAMILIES.latin;
  }
}

export function getFontClassForLocale(locale: Locale): string {
  switch (locale) {
    case 'mr':
    case 'hi':
      return 'font-devanagari';
    case 'kn':
      return 'font-kannada';
    case 'en':
    default:
      return 'font-latin';
  }
}

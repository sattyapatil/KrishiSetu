import { Locale } from './locale-registry.js';

const LOCALE_TO_INTL_MAP: Record<Locale, string> = {
  en: 'en-IN',
  mr: 'mr-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

export function formatCurrencyFromPaise(
  paise: number | bigint,
  locale: Locale = 'en',
  options: { showSymbol?: boolean; hideDecimalsIfZero?: boolean } = {}
): string {
  const intlLocale = LOCALE_TO_INTL_MAP[locale] ?? 'en-IN';
  const rupees = Number(paise) / 100;
  const showSymbol = options.showSymbol !== false;

  const formatter = new Intl.NumberFormat(intlLocale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    currencyDisplay: 'symbol',
    minimumFractionDigits: options.hideDecimalsIfZero && Number.isInteger(rupees) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(rupees);
}

export function formatHectares(
  hectares: number | string,
  locale: Locale = 'en'
): string {
  const intlLocale = LOCALE_TO_INTL_MAP[locale] ?? 'en-IN';
  const num = typeof hectares === 'string' ? Number.parseFloat(hectares) : hectares;

  const numStr = new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);

  const unitMap: Record<Locale, string> = {
    en: 'hectares',
    mr: 'हेक्टर',
    hi: 'हेक्टेयर',
    kn: 'ಹೆಕ್ಟೇರ್',
  };

  const unit = unitMap[locale] ?? 'hectares';
  return `${numStr} ${unit}`;
}

export function formatLocalizedDate(
  dateOrIso: Date | string,
  locale: Locale = 'en',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  const intlLocale = LOCALE_TO_INTL_MAP[locale] ?? 'en-IN';
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;

  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}

export function formatNumber(
  value: number,
  locale: Locale = 'en',
  options?: Intl.NumberFormatOptions
): string {
  const intlLocale = LOCALE_TO_INTL_MAP[locale] ?? 'en-IN';
  return new Intl.NumberFormat(intlLocale, options).format(value);
}

export function formatList(
  items: readonly string[],
  locale: Locale = 'en',
  type: 'conjunction' | 'disjunction' = 'conjunction'
): string {
  const intlLocale = LOCALE_TO_INTL_MAP[locale] ?? 'en-IN';
  return new Intl.ListFormat(intlLocale, { style: 'long', type }).format(items);
}

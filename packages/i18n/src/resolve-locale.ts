import { Locale, isSupportedLocale, localeRegistry } from './locale-registry.js';

export type LocaleResolutionSource =
  | 'URL_PATH'
  | 'AUTHENTICATED_PREFERENCE'
  | 'COOKIE'
  | 'ACCEPT_LANGUAGE'
  | 'CONFIGURED_DEFAULT'
  | 'SAFETY_FALLBACK';

export interface ResolvedLocale {
  readonly locale: Locale;
  readonly source: LocaleResolutionSource;
}

export interface ResolveLocaleOptions {
  readonly urlPath?: string;
  readonly userPreference?: string;
  readonly cookieValue?: string;
  readonly acceptLanguageHeader?: string;
  readonly configuredDefault?: string;
}

export function parseAcceptLanguage(header: string | undefined): Locale | null {
  if (!header || header.trim() === '') {
    return null;
  }
  const parts = header.split(',').map((part) => {
    const [lang, qPart] = part.trim().split(';q=');
    const q = qPart ? Number.parseFloat(qPart) : 1.0;
    const base = (lang ?? '').split('-')[0]?.toLowerCase() ?? '';
    return { base, q };
  });

  parts.sort((a, b) => b.q - a.q);

  for (const { base } of parts) {
    if (isSupportedLocale(base)) {
      return base;
    }
  }
  return null;
}

export function parseLocaleFromUrl(urlPath: string | undefined): Locale | null {
  if (!urlPath) return null;
  const segments = urlPath.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();
  if (firstSegment && isSupportedLocale(firstSegment)) {
    return firstSegment;
  }
  return null;
}

export function resolveLocale(options: ResolveLocaleOptions = {}): ResolvedLocale {
  // 1. Explicit supported locale in URL
  if (options.urlPath) {
    const fromUrl = parseLocaleFromUrl(options.urlPath);
    if (fromUrl) {
      return { locale: fromUrl, source: 'URL_PATH' };
    }
  }

  // 2. Authenticated user preference
  if (options.userPreference && isSupportedLocale(options.userPreference)) {
    return {
      locale: options.userPreference as Locale,
      source: 'AUTHENTICATED_PREFERENCE',
    };
  }

  // 3. Signed / stored locale cookie
  if (options.cookieValue && isSupportedLocale(options.cookieValue)) {
    return { locale: options.cookieValue as Locale, source: 'COOKIE' };
  }

  // 4. Accept-Language header matching supported
  if (options.acceptLanguageHeader) {
    const fromHeader = parseAcceptLanguage(options.acceptLanguageHeader);
    if (fromHeader) {
      return { locale: fromHeader, source: 'ACCEPT_LANGUAGE' };
    }
  }

  // 5. Configured default
  if (options.configuredDefault && isSupportedLocale(options.configuredDefault)) {
    return {
      locale: options.configuredDefault as Locale,
      source: 'CONFIGURED_DEFAULT',
    };
  }

  // 6. Hard safety fallback from registry
  return {
    locale: localeRegistry.fallbackLocale,
    source: 'SAFETY_FALLBACK',
  };
}

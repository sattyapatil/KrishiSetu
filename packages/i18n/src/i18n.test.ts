import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  localeRegistry,
  isSupportedLocale,
  resolveLocale,
  parseAcceptLanguage,
  formatCurrencyFromPaise,
  formatHectares,
  translate,
  MESSAGES,
} from './index';

describe('packages/i18n', () => {
  it('localeRegistry defines en as default and en, mr, hi, kn as supported', () => {
    assert.equal(localeRegistry.defaultLocale, 'en');
    assert.equal(localeRegistry.fallbackLocale, 'en');
    assert.ok(localeRegistry.supported.en);
    assert.ok(localeRegistry.supported.mr);
    assert.ok(localeRegistry.supported.hi);
    assert.ok(localeRegistry.supported.kn);
    assert.equal(isSupportedLocale('mr'), true);
    assert.equal(isSupportedLocale('fr'), false);
  });

  describe('resolveLocale 6-stage fallback pipeline', () => {
    it('1. resolves from URL path first', () => {
      const res = resolveLocale({
        urlPath: '/mr/dashboard',
        userPreference: 'hi',
        cookieValue: 'kn',
        acceptLanguageHeader: 'en',
      });
      assert.equal(res.locale, 'mr');
      assert.equal(res.source, 'URL_PATH');
    });

    it('2. resolves from authenticated user preference if URL has no locale', () => {
      const res = resolveLocale({
        urlPath: '/dashboard',
        userPreference: 'hi',
        cookieValue: 'kn',
      });
      assert.equal(res.locale, 'hi');
      assert.equal(res.source, 'AUTHENTICATED_PREFERENCE');
    });

    it('3. resolves from cookie if no URL or user preference', () => {
      const res = resolveLocale({
        cookieValue: 'kn',
        acceptLanguageHeader: 'en',
      });
      assert.equal(res.locale, 'kn');
      assert.equal(res.source, 'COOKIE');
    });

    it('4. resolves from Accept-Language header matching supported', () => {
      const res = resolveLocale({
        acceptLanguageHeader: 'mr-IN,mr;q=0.9,en;q=0.8',
      });
      assert.equal(res.locale, 'mr');
      assert.equal(res.source, 'ACCEPT_LANGUAGE');
    });

    it('5. resolves from configured default when available', () => {
      const res = resolveLocale({ configuredDefault: 'mr' });
      assert.equal(res.locale, 'mr');
      assert.equal(res.source, 'CONFIGURED_DEFAULT');
    });

    it('6. safety fallback to en for unknown locale or empty options', () => {
      const res = resolveLocale({
        urlPath: '/unknown/page',
        acceptLanguageHeader: 'fr-FR,fr;q=0.9',
      });
      assert.equal(res.locale, 'en');
      assert.equal(res.source, 'SAFETY_FALLBACK');
    });
  });

  describe('formatters', () => {
    it('formats currency from paise with Indian grouping', () => {
      const formatted = formatCurrencyFromPaise(4800000, 'en'); // 48,000 INR
      assert.ok(formatted.includes('48,000'));

      const mrFormatted = formatCurrencyFromPaise(4800000, 'mr');
      assert.ok(mrFormatted.length > 0);
    });

    it('formats hectares with localized unit', () => {
      assert.equal(formatHectares(0.675, 'en'), '0.675 hectares');
      assert.ok(formatHectares(0.675, 'mr').includes('हेक्टर'));
      assert.ok(formatHectares(0.675, 'hi').includes('हेक्टेयर'));
      assert.ok(formatHectares(0.675, 'kn').includes('ಹೆಕ್ಟೇರ್'));
    });
  });

  describe('message catalogs completeness', () => {
    it('all four locales have identical namespaces and keys', () => {
      const namespaces = Object.keys(MESSAGES.en) as Array<keyof typeof MESSAGES.en>;
      for (const loc of ['mr', 'hi', 'kn'] as const) {
        for (const ns of namespaces) {
          const enKeys = Object.keys(MESSAGES.en[ns]);
          const targetKeys = Object.keys(MESSAGES[loc][ns]);
          assert.deepEqual(
            targetKeys.sort(),
            enKeys.sort(),
            `Missing or mismatch keys in namespace ${ns} for locale ${loc}`
          );
        }
      }
    });

    it('translate function retrieves correct localized strings', () => {
      assert.equal(translate('brand.name', 'en'), 'KrishiSetu');
      assert.equal(translate('brand.name', 'mr'), 'कृषीसेतू');
      assert.equal(translate('brand.name', 'hi'), 'कृषिसेतु');
      assert.equal(translate('brand.name', 'kn'), 'ಕೃಷಿಸೇತು');
    });
  });
});

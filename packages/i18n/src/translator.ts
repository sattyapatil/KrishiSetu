import { Locale } from './locale-registry.js';

// Pre-imported message catalogs for in-memory synchronous lookups
import enBrand from '../messages/en/brand.json' with { type: 'json' };
import enCommon from '../messages/en/common.json' with { type: 'json' };
import enNav from '../messages/en/navigation.json' with { type: 'json' };
import enAuth from '../messages/en/auth.json' with { type: 'json' };
import enConsent from '../messages/en/consent.json' with { type: 'json' };
import enDashboard from '../messages/en/dashboard.json' with { type: 'json' };
import enLand from '../messages/en/land.json' with { type: 'json' };
import enCrops from '../messages/en/crops.json' with { type: 'json' };
import enSchemes from '../messages/en/schemes.json' with { type: 'json' };
import enCredit from '../messages/en/credit.json' with { type: 'json' };
import enApps from '../messages/en/applications.json' with { type: 'json' };
import enPrivacy from '../messages/en/privacy.json' with { type: 'json' };
import enErrors from '../messages/en/errors.json' with { type: 'json' };
import enNotifications from '../messages/en/notifications.json' with { type: 'json' };
import enWeather from '../messages/en/weather.json' with { type: 'json' };

import mrBrand from '../messages/mr/brand.json' with { type: 'json' };
import mrCommon from '../messages/mr/common.json' with { type: 'json' };
import mrNav from '../messages/mr/navigation.json' with { type: 'json' };
import mrAuth from '../messages/mr/auth.json' with { type: 'json' };
import mrConsent from '../messages/mr/consent.json' with { type: 'json' };
import mrDashboard from '../messages/mr/dashboard.json' with { type: 'json' };
import mrLand from '../messages/mr/land.json' with { type: 'json' };
import mrCrops from '../messages/mr/crops.json' with { type: 'json' };
import mrSchemes from '../messages/mr/schemes.json' with { type: 'json' };
import mrCredit from '../messages/mr/credit.json' with { type: 'json' };
import mrApps from '../messages/mr/applications.json' with { type: 'json' };
import mrPrivacy from '../messages/mr/privacy.json' with { type: 'json' };
import mrErrors from '../messages/mr/errors.json' with { type: 'json' };
import mrNotifications from '../messages/mr/notifications.json' with { type: 'json' };
import mrWeather from '../messages/mr/weather.json' with { type: 'json' };

import hiBrand from '../messages/hi/brand.json' with { type: 'json' };
import hiCommon from '../messages/hi/common.json' with { type: 'json' };
import hiNav from '../messages/hi/navigation.json' with { type: 'json' };
import hiAuth from '../messages/hi/auth.json' with { type: 'json' };
import hiConsent from '../messages/hi/consent.json' with { type: 'json' };
import hiDashboard from '../messages/hi/dashboard.json' with { type: 'json' };
import hiLand from '../messages/hi/land.json' with { type: 'json' };
import hiCrops from '../messages/hi/crops.json' with { type: 'json' };
import hiSchemes from '../messages/hi/schemes.json' with { type: 'json' };
import hiCredit from '../messages/hi/credit.json' with { type: 'json' };
import hiApps from '../messages/hi/applications.json' with { type: 'json' };
import hiPrivacy from '../messages/hi/privacy.json' with { type: 'json' };
import hiErrors from '../messages/hi/errors.json' with { type: 'json' };
import hiNotifications from '../messages/hi/notifications.json' with { type: 'json' };
import hiWeather from '../messages/hi/weather.json' with { type: 'json' };

import knBrand from '../messages/kn/brand.json' with { type: 'json' };
import knCommon from '../messages/kn/common.json' with { type: 'json' };
import knNav from '../messages/kn/navigation.json' with { type: 'json' };
import knAuth from '../messages/kn/auth.json' with { type: 'json' };
import knConsent from '../messages/kn/consent.json' with { type: 'json' };
import knDashboard from '../messages/kn/dashboard.json' with { type: 'json' };
import knLand from '../messages/kn/land.json' with { type: 'json' };
import knCrops from '../messages/kn/crops.json' with { type: 'json' };
import knSchemes from '../messages/kn/schemes.json' with { type: 'json' };
import knCredit from '../messages/kn/credit.json' with { type: 'json' };
import knApps from '../messages/kn/applications.json' with { type: 'json' };
import knPrivacy from '../messages/kn/privacy.json' with { type: 'json' };
import knErrors from '../messages/kn/errors.json' with { type: 'json' };
import knNotifications from '../messages/kn/notifications.json' with { type: 'json' };
import knWeather from '../messages/kn/weather.json' with { type: 'json' };

export const MESSAGES = {
  en: {
    brand: enBrand,
    common: enCommon,
    navigation: enNav,
    auth: enAuth,
    consent: enConsent,
    dashboard: enDashboard,
    land: enLand,
    crops: enCrops,
    schemes: enSchemes,
    credit: enCredit,
    applications: enApps,
    privacy: enPrivacy,
    errors: enErrors,
    notifications: enNotifications,
    weather: enWeather,
  },
  mr: {
    brand: mrBrand,
    common: mrCommon,
    navigation: mrNav,
    auth: mrAuth,
    consent: mrConsent,
    dashboard: mrDashboard,
    land: mrLand,
    crops: mrCrops,
    schemes: mrSchemes,
    credit: mrCredit,
    applications: mrApps,
    privacy: mrPrivacy,
    errors: mrErrors,
    notifications: mrNotifications,
    weather: mrWeather,
  },
  hi: {
    brand: hiBrand,
    common: hiCommon,
    navigation: hiNav,
    auth: hiAuth,
    consent: hiConsent,
    dashboard: hiDashboard,
    land: hiLand,
    crops: hiCrops,
    schemes: hiSchemes,
    credit: hiCredit,
    applications: hiApps,
    privacy: hiPrivacy,
    errors: hiErrors,
    notifications: hiNotifications,
    weather: hiWeather,
  },
  kn: {
    brand: knBrand,
    common: knCommon,
    navigation: knNav,
    auth: knAuth,
    consent: knConsent,
    dashboard: knDashboard,
    land: knLand,
    crops: knCrops,
    schemes: knSchemes,
    credit: knCredit,
    applications: knApps,
    privacy: knPrivacy,
    errors: knErrors,
    notifications: knNotifications,
    weather: knWeather,
  },
} as const;

export type TranslationCatalog = typeof MESSAGES.en;

function getNestedValue(obj: Record<string, unknown>, path: string[]): string | undefined {
  let current: unknown = obj;
  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function translate(
  key: string,
  locale: Locale = 'en',
  params?: Record<string, string | number>
): string {
  const parts = key.split('.');
  const localeCatalog = (MESSAGES[locale] ?? MESSAGES.en) as unknown as Record<string, unknown>;
  const fallbackCatalog = MESSAGES.en as unknown as Record<string, unknown>;

  let template = getNestedValue(localeCatalog, parts);
  if (!template && locale !== 'en') {
    template = getNestedValue(fallbackCatalog, parts);
  }

  if (!template) {
    return key;
  }

  if (params) {
    let result = template;
    for (const [paramKey, paramVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
    return result;
  }

  return template;
}

export function getMessagesForLocale(locale: Locale): typeof MESSAGES.en {
  return (MESSAGES[locale] ?? MESSAGES.en) as typeof MESSAGES.en;
}

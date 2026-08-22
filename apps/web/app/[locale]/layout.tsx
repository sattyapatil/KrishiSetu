import React from 'react';
import { SUPPORTED_LOCALES, Locale, isSupportedLocale, localeRegistry } from '@krishisetu/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const localeMeta = localeRegistry.supported[typedLocale];

  return (
    <div lang={localeMeta.htmlLang} dir={localeMeta.direction} className={`ks-locale-root ks-locale-${typedLocale}`}>
      {children}
    </div>
  );
}

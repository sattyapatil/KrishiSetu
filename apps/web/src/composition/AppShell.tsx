import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { Header, LanguageSelector, Navigation, NavItem } from '@krishisetu/design-system';

export interface AppShellProps {
  readonly locale: Locale;
  readonly onSelectLocale: (locale: Locale) => void;
  readonly currentPath?: string;
  readonly onNavigate?: (href: string) => void;
  readonly children: React.ReactNode;
}

export function AppShell({
  locale,
  onSelectLocale,
  currentPath = '/dashboard',
  children,
}: AppShellProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      href: `/${locale}/dashboard`,
      icon: '📊',
      isActive: currentPath.includes('dashboard'),
    },
    {
      id: 'applications',
      label: t('navigation.applications'),
      href: `/${locale}/applications`,
      icon: '📝',
      isActive: currentPath.includes('applications'),
    },
    {
      id: 'privacy',
      label: t('navigation.privacy'),
      href: `/${locale}/privacy`,
      icon: '🔒',
      isActive: currentPath.includes('privacy'),
    },
  ];

  return (
    <div
      className="ks-app-shell"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
        color: 'var(--ks-color-text, #0f172a)',
        fontFamily: 'inherit',
      }}
    >
      <Header
        title={t('brand.name')}
        motto={t('brand.motto')}
        prototypeMessage={t('brand.prototypeDisclosure')}
        homeHref={`/${locale}/dashboard`}
        utilitySlot={
          <>
            <Navigation items={navItems} orientation="horizontal" />
            <LanguageSelector
              currentLocale={locale}
              onSelectLocale={onSelectLocale}
            />
          </>
        }
      />

      <main
        id="main-content"
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 'var(--ks-content-max, 75rem)',
          margin: '0 auto',
          padding: '1.25rem 1rem',
        }}
      >
        {children}
      </main>

      <footer
        style={{
          padding: '1.5rem 1rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--ks-color-text-muted, #475569)',
        }}
      >
        <p style={{ margin: '0 0 0.25rem 0' }}>{t('brand.prototypeDisclosure')}</p>
        <p style={{ margin: 0 }}>
          <strong>{t('brand.name')}</strong> • {t('brand.mottoMeaning')}
        </p>
      </footer>
    </div>
  );
}

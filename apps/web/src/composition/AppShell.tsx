'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, translate } from '@krishisetu/i18n';
import { LanguageSelector, BrandMark } from '@krishisetu/design-system';
import { useJourney } from '../features/journey/index.js';
import {
  DashboardIcon,
  HomeIcon,
  SchemesIcon,
  ApplicationsIcon,
  NoticesIcon,
  WeatherIcon,
  PrivacyIcon,
} from '../components/icons.js';

export interface AppShellProps {
  readonly locale: Locale;
  readonly onSelectLocale?: (locale: Locale) => void;
  readonly currentPath?: string;
  readonly children: React.ReactNode;
}

export function AppShell({
  locale,
  onSelectLocale,
  currentPath,
  children,
}: AppShellProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const pathname = usePathname() || currentPath || `/${locale}`;
  const router = useRouter();
  const { session, logout, adapter } = useJourney();

  const handleSelectLocale = (newLocale: Locale) => {
    if (onSelectLocale) {
      onSelectLocale(newLocale);
    }
    if (newLocale === locale) return;
    if (session) void adapter.updatePreferences?.({ locale: newLocale });
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLocale;
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  const isAuthenticated = Boolean(session && session.dashboardConsentGranted);
  const isLandingMode = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isLoginScreen =
    pathname === `/${locale}/login` || pathname.endsWith('/login');
  const isAuthOrConsentScreen =
    isLandingMode ||
    pathname === `/${locale}/login` ||
    pathname === `/${locale}/consent` ||
    pathname.endsWith('/login') ||
    pathname.endsWith('/consent');

  const homeHref = isAuthenticated ? `/${locale}/dashboard` : `/${locale}`;

  const navLinks = [
    {
      id: 'dashboard',
      label: t('navigation.dashboard'),
      href: `/${locale}/dashboard`,
      icon: DashboardIcon,
      isActive: pathname.startsWith(`/${locale}/dashboard`),
    },
    {
      id: 'public-home',
      label: t('navigation.publicHome'),
      href: `/${locale}`,
      icon: HomeIcon,
      isActive: false,
    },
    {
      id: 'schemes',
      label: t('navigation.schemes'),
      href: `/${locale}/schemes`,
      icon: SchemesIcon,
      isActive: pathname.startsWith(`/${locale}/schemes`),
    },
    {
      id: 'applications',
      label: t('navigation.applications'),
      href: `/${locale}/applications`,
      icon: ApplicationsIcon,
      isActive: pathname.startsWith(`/${locale}/applications`),
    },
    {
      id: 'notifications',
      label: t('notifications.centreTitle'),
      href: `/${locale}/notifications`,
      icon: NoticesIcon,
      isActive: pathname.startsWith(`/${locale}/notifications`) || pathname.startsWith(`/${locale}/notices`),
    },
    {
      id: 'weather',
      label: t('weather.title'),
      href: `/${locale}/weather`,
      icon: WeatherIcon,
      isActive: pathname.startsWith(`/${locale}/weather`),
    },
    {
      id: 'privacy',
      label: t('navigation.privacy'),
      href: `/${locale}/privacy`,
      icon: PrivacyIcon,
      isActive: pathname.startsWith(`/${locale}/privacy`),
    },
  ];

  return (
    <div
      className="ks-app-shell"
      style={{
        minHeight: '100vh',
        height: isLoginScreen ? '100svh' : undefined,
        overflow: isLoginScreen ? 'hidden' : undefined,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
        color: 'var(--ks-color-text, #0f172a)',
        fontFamily: 'inherit',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .ks-app-shell * {
          box-sizing: border-box;
        }

        .ks-header-inner {
          max-width: 100%;
          margin: 0;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .ks-layout-wrapper {
          display: flex;
          flex: 1;
          width: 100%;
          position: relative;
          min-height: 0;
        }

        .ks-sidebar {
          width: 260px;
          flex-shrink: 0;
          background-color: var(--ks-color-surface-card, #ffffff);
          border-right: 1px solid var(--ks-color-border, #cbd5e1);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          gap: 0.5rem;
        }

        .ks-main-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          max-width: var(--ks-content-max, 75rem);
          margin: 0 auto;
          padding: 2rem 2rem 3rem 2rem;
        }

        .ks-main-content.is-landing {
          max-width: 100%;
          margin: 0;
          padding: 0;
        }

        .ks-main-content.is-login {
          max-width: 100%;
          min-height: 0;
          overflow: hidden;
          padding: clamp(0.75rem, 2.5vh, 1.5rem) 2rem;
        }

        .ks-mobile-bottom-nav {
          display: none;
        }

        /* Sidebar link base styles */
        .ks-sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ks-color-text, #0f172a);
          transition: all 0.2s ease;
        }

        .ks-sidebar-link:hover {
          background-color: var(--ks-color-surface-hover, #f1f5f9);
        }

        .ks-sidebar-link[aria-current="page"] {
          background-color: var(--ks-color-civic-blue, #1e3a8a);
          color: var(--ks-color-surface-card, #ffffff);
          font-weight: 600;
        }

        @media (max-width: 767px) {
          .ks-header-inner {
            padding: 0.75rem 1rem;
          }

          .ks-sidebar {
            display: none;
          }

          .ks-main-content {
            padding: 1.25rem 1rem 5rem 1rem; /* Reserved bottom padding for sticky bar */
          }

          .ks-main-content.is-landing {
            padding: 0;
          }

          .ks-main-content.is-login {
            padding: clamp(0.5rem, 1.75vh, 0.875rem) 1rem;
          }

          .ks-mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4.5rem;
            min-height: 4.5rem;
            background-color: var(--ks-color-surface-card, #ffffff);
            border-top: 1px solid var(--ks-color-border, #cbd5e1);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0.25rem 0.5rem;
            z-index: 900;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
          }

          .ks-mobile-nav-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 0;
            width: 20%;
            min-height: 3.5rem;
            padding: 0.25rem;
            text-decoration: none;
            color: var(--ks-color-text-muted, #475569);
            font-weight: 500;
            font-size: 0.75rem;
            gap: 0.25rem;
            transition: color 0.2s ease;
          }

          .ks-mobile-nav-link span {
            max-width: 100%;
            max-height: 2rem;
            overflow: hidden;
            line-height: 1rem;
            text-align: center;
          }

          .ks-mobile-nav-link[aria-current="page"] {
            color: var(--ks-color-civic-blue, #1e3a8a);
            font-weight: 700;
          }
        }

        @media (max-width: 479px) {
          .ks-header-inner {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 0.5rem;
          }

          .ks-header-actions {
            width: 100%;
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 0.5rem !important;
          }

          .ks-header-actions .ks-language-selector,
          .ks-header-actions select {
            width: 100%;
            min-width: 0 !important;
          }
        }
      `}} />

      {/* 1. Standardized Top Header (rendered when not in landing mode, since landing mode provides PublicHeader) */}
      {!isLandingMode && (
        <header
          className="ks-header"
          style={{
            backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
            borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
            width: '100%',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <div className="ks-header-inner">
            {/* Brand Logo and Title */}
            <Link
              href={homeHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
              aria-label={`${t('brand.name')} - ${t('brand.motto')}`}
            >
              <BrandMark size={42} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--ks-color-civic-blue, #1e3a8a)',
                    lineHeight: 1.1,
                  }}
                >
                  {t('brand.name')}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--ks-color-agri-green, #166534)',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  {t('brand.motto')}
                </span>
              </div>
            </Link>

            {/* Header Actions (Language, Profile/Logout) */}
            <div className="ks-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <LanguageSelector currentLocale={locale} onSelectLocale={handleSelectLocale} />

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push(`/${locale}`);
                  }}
                  aria-label={t('navigation.logout')}
                  style={{
                    minHeight: '2.75rem',
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: '1px solid var(--ks-color-border, #cbd5e1)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                    color: 'var(--ks-color-text, #0f172a)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {t('navigation.logout')}
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* 2. Layout Wrapper for Sidebar + Main Content */}
      <div className="ks-layout-wrapper">

        {/* Left Sidebar (Desktop Only) */}
        {isAuthenticated && !isAuthOrConsentScreen && (
          <aside className="ks-sidebar" aria-label="Desktop Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className="ks-sidebar-link"
                  aria-current={link.isActive ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden={true} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* Main Content Container */}
        <main
          id="main-content"
          className={`ks-main-content ${isLandingMode ? 'is-landing' : ''} ${isLoginScreen ? 'is-login' : ''}`}
        >
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (Visible only on mobile for authenticated users) */}
      {isAuthenticated && !isAuthOrConsentScreen && (
        <nav
          aria-label="Mobile Bottom Navigation"
          className="ks-mobile-bottom-nav"
        >
          {navLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.id}
                href={link.href}
                className="ks-mobile-nav-link"
                aria-current={link.isActive ? 'page' : undefined}
              >
                <Icon size={22} aria-hidden={true} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* 4. Accessible Footer (rendered when not in landing mode, since landing mode provides PublicFooter) */}
      {!isLandingMode && !isLoginScreen && (
        <footer
          style={{
            padding: '1.5rem 1rem',
            backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
            borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--ks-color-text-muted, #475569)',
            zIndex: 10,
          }}
        >
          <p style={{ margin: '0 0 0.25rem 0' }}>{t('brand.prototypeDisclosure')}</p>
          <p style={{ margin: 0 }}>
            <strong>{t('brand.name')}</strong> • {t('brand.mottoMeaning')}
          </p>
        </footer>
      )}
    </div>
  );
}

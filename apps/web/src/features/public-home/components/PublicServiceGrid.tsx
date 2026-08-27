'use client';

import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import type { ActiveDetailModalState } from '../public-home.types.js';
import styles from '../PublicHomeView.module.css';

export interface PublicServiceGridProps {
  readonly locale: Locale;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function PublicServiceGrid({
  locale,
  onOpenModal,
}: PublicServiceGridProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const handleOpenWeatherModal = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal({
      type: 'WEATHER',
      title: t('publicHome.services.card3Title'),
      subtitle: t('publicHome.common.syntheticDataLabel'),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ margin: 0 }}>
            {t('publicHome.services.card3Desc')}
          </p>
          <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('weather.districts.pune')} • 27°C • {t('publicHome.snapshot.moderateRain')} • 68% {t('publicHome.snapshot.rainProbabilityLabel')} • {t('publicHome.snapshot.yellowRainfallWatch')}
          </p>
        </div>
      ),
    });
  };

  const handleOpenAdvisoriesModal = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal({
      type: 'ADVISORY',
      title: t('publicHome.services.card4Title'),
      subtitle: t('publicHome.snapshot.syntheticAdvisorySource'),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {t('publicHome.snapshot.advisoryTitle')}
          </p>
          <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.snapshot.advisorySummary')}
          </p>
        </div>
      ),
    });
  };

  const services = [
    {
      id: 'schemes',
      title: t('publicHome.services.card1Title'),
      desc: t('publicHome.services.card1Desc'),
      icon: '📋',
      href: '#schemes',
      onClick: undefined,
    },
    {
      id: 'market',
      title: t('publicHome.services.card2Title'),
      desc: t('publicHome.services.card2Desc'),
      icon: '📊',
      href: '#market',
      onClick: undefined,
    },
    {
      id: 'weather',
      title: t('publicHome.services.card3Title'),
      desc: t('publicHome.services.card3Desc'),
      icon: '🌦️',
      href: undefined,
      onClick: handleOpenWeatherModal,
    },
    {
      id: 'advisories',
      title: t('publicHome.services.card4Title'),
      desc: t('publicHome.services.card4Desc'),
      icon: '🌾',
      href: undefined,
      onClick: handleOpenAdvisoriesModal,
    },
    {
      id: 'notices',
      title: t('publicHome.services.card5Title'),
      desc: t('publicHome.services.card5Desc'),
      icon: '📢',
      href: '#notices',
      onClick: undefined,
    },
    {
      id: 'help',
      title: t('publicHome.services.card6Title'),
      desc: t('publicHome.services.card6Desc'),
      icon: 'ℹ️',
      href: '#how-it-works',
      onClick: undefined,
    },
  ];

  return (
    <section id="services" className={styles.sectionWrapper} aria-labelledby="services-heading">
      <div className={styles.sectionHeader}>
        <h2 id="services-heading" className={styles.sectionTitle}>
          {t('publicHome.services.title')}
        </h2>
        <p className={styles.sectionDescription}>{t('publicHome.services.description')}</p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service) => {
          const cardContent = (
            <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className={styles.serviceIconWrap}>
                <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
                  {service.icon}
                </span>
              </div>
              <h3 className={styles.serviceCardTitle}>{service.title}</h3>
              <p className={styles.serviceCardDesc}>{service.desc}</p>
            </div>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--ks-color-civic-blue, #1e3a8a)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {t('publicHome.common.explore')} →
            </span>
            </>
          );

          if (service.onClick) {
            return (
              <button
                key={service.id}
                type="button"
                onClick={service.onClick}
                className={`${styles.serviceCard} ${styles.serviceCardButton}`}
                aria-label={`${service.title}: ${service.desc}`}
              >
                {cardContent}
              </button>
            );
          }

          return (
            <a
              key={service.id}
              href={service.href}
              className={styles.serviceCard}
              aria-label={`${service.title}: ${service.desc}`}
            >
              {cardContent}
            </a>
          );
        })}
      </div>
    </section>
  );
}

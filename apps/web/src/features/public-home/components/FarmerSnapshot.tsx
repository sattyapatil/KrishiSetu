'use client';

import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import type {
  PublicWeatherSnapshot,
  PublicMarketRow,
  ActiveDetailModalState,
  PublicWidgetStates,
} from '../public-home.types.js';
import { PublicWidgetState } from './PublicWidgetState.js';
import styles from '../PublicHomeView.module.css';

export interface FarmerSnapshotProps {
  readonly locale: Locale;
  readonly weather: PublicWeatherSnapshot;
  readonly marketRow: PublicMarketRow;
  readonly widgetStates: PublicWidgetStates;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function FarmerSnapshot({
  locale,
  weather,
  marketRow,
  widgetStates,
  onOpenModal,
}: FarmerSnapshotProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) => translate(key, locale, params);
  const weatherLocation = `${t('weather.talukas.haveli')}, ${t('weather.districts.pune')}`;
  const weatherCondition = t('publicHome.snapshot.moderateRain');
  const advisoryTitle = t('publicHome.snapshot.advisoryTitle');
  const advisorySummary = t('publicHome.snapshot.advisorySummary');
  const advisoryValidity = t('publicHome.snapshot.advisoryValidity');
  const commodityName = t(marketRow.commodityKey);

  const openWeatherModal = () => {
    onOpenModal({
      type: 'WEATHER',
      title: `${t('publicHome.snapshot.weatherCardTitle')} — ${weatherLocation}`,
      subtitle: t('publicHome.common.syntheticDataLabel'),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <strong>{t('publicHome.snapshot.conditionLabel')}:</strong> {weatherCondition}
            </div>
            <div>
              <strong>{t('publicHome.snapshot.temperatureLabel')}:</strong> {weather.temperatureCelsius}°C
            </div>
            <div>
              <strong>{t('publicHome.snapshot.rainProbabilityLabel')}:</strong> {weather.rainfallProbabilityPercent}%
            </div>
            <div>
              <strong>{t('publicHome.snapshot.rainfall24hLabel')}:</strong> {weather.rainfallMm24h} mm
            </div>
            <div>
              <strong>{t('publicHome.snapshot.humidityLabel')}:</strong> {weather.relativeHumidityPercent}%
            </div>
            <div>
              <strong>{t('publicHome.snapshot.windSpeedLabel')}:</strong> {weather.windSpeedKmh} km/h
            </div>
          </div>
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--ks-color-warning-surface, #fef3c7)',
              border: '1px solid var(--ks-color-warning-text, #78350f)',
              borderRadius: '0.375rem',
              color: 'var(--ks-color-warning-text, #78350f)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            ⚠️ {t('publicHome.snapshot.yellowRainfallWatch')}
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.common.sourceLabel')}: {t('publicHome.snapshot.mockAgrometSource')} • {t('publicHome.common.demonstrationFixture')}
          </p>
        </div>
      ),
    });
  };

  const openMarketModal = () => {
    onOpenModal({
      type: 'MARKET',
      title: `${commodityName} — ${t('publicHome.market.puneMarketYard')}`,
      subtitle: t('publicHome.market.disclaimer'),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <strong>{t('publicHome.market.commodity')}:</strong> {commodityName}
            </div>
            <div>
              <strong>{t('publicHome.market.colPrice')}:</strong> {marketRow.displayPrice}
            </div>
            <div>
              <strong>{t('publicHome.market.dayMovement')}:</strong> {marketRow.changePercent > 0 ? '+' : ''}
              {marketRow.changePercent}% ({marketRow.direction === 'UP' ? t('publicHome.market.directionUp') : t('publicHome.market.directionDown')})
            </div>
            <div>
              <strong>{t('publicHome.market.marketArrival')}:</strong> {marketRow.arrivalQuintals} {t('publicHome.market.quintals')}
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.market.freshness')}
          </p>
        </div>
      ),
    });
  };

  const openAdvisoryModal = () => {
    onOpenModal({
      type: 'ADVISORY',
      title: t('publicHome.snapshot.advisoryCardTitle'),
      subtitle: advisoryValidity,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{advisoryTitle}</p>
          <p style={{ margin: 0 }}>{advisorySummary}</p>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.common.sourceLabel')}: {t('publicHome.snapshot.syntheticAdvisorySource')} • {advisoryValidity}
          </p>
        </div>
      ),
    });
  };

  const openSchemesModal = () => {
    onOpenModal({
      type: 'SCHEME',
      title: t('publicHome.snapshot.schemesCardTitle'),
      subtitle: t('publicHome.schemes.description'),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <p style={{ margin: 0 }}>
            {t('publicHome.snapshot.openSchemesSummary')}
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <strong>{t('publicHome.schemes.dripTitle')}:</strong> {t('publicHome.schemes.dripStatus')}
            </li>
            <li>
              <strong>{t('publicHome.schemes.rotavatorTitle')}:</strong> {t('publicHome.schemes.rotavatorStatus')}
            </li>
            <li>
              <strong>{t('publicHome.schemes.kccTitle')}:</strong> {t('publicHome.snapshot.openEligibilityStatus')}
            </li>
          </ul>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.common.loginRequiredNote')}
          </p>
        </div>
      ),
    });
  };

  return (
    <section className={styles.sectionWrapper} aria-labelledby="snapshot-heading">
      <div className={styles.sectionHeader}>
        <h2 id="snapshot-heading" className={styles.sectionTitle}>
          {t('publicHome.snapshot.title')}
        </h2>
        <p className={styles.sectionDescription}>{t('publicHome.snapshot.description')}</p>
      </div>

      <div className={styles.snapshotGrid}>
        {/* Card 1: Weather */}
        <article className={styles.snapshotCard} aria-label={t('publicHome.snapshot.weatherCardTitle')}>
          <PublicWidgetState
            locale={locale}
            status={widgetStates.weather}
            label={t('publicHome.snapshot.weatherCardTitle')}
          >
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('publicHome.snapshot.weatherCardTitle')}</h3>
              <span aria-hidden="true">🌧️</span>
            </div>
            <p className={styles.cardValueLarge}>{weather.temperatureCelsius}°C</p>
            <p className={styles.cardValueText}>
              {weatherCondition} • {weather.rainfallProbabilityPercent}% {t('publicHome.snapshot.rainProbabilityLabel')}
            </p>
          </div>
          <button type="button" onClick={openWeatherModal} className={styles.cardActionBtn}>
            {t('publicHome.snapshot.viewFullWeather')}
          </button>
          </PublicWidgetState>
        </article>

        {/* Card 2: Market */}
        <article className={styles.snapshotCard} aria-label={t('publicHome.snapshot.marketCardTitle')}>
          <PublicWidgetState
            locale={locale}
            status={widgetStates.market}
            label={t('publicHome.snapshot.marketCardTitle')}
          >
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('publicHome.snapshot.marketCardTitle')}</h3>
              <span aria-hidden="true">📈</span>
            </div>
            <p className={styles.cardValueLarge}>{marketRow.displayPrice}</p>
            <p className={styles.cardValueText}>
              {commodityName}: +{marketRow.changePercent}% ({t('publicHome.market.directionUp')}) • {marketRow.arrivalQuintals} {t('publicHome.market.quintals')}
            </p>
          </div>
          <button type="button" onClick={openMarketModal} className={styles.cardActionBtn}>
            {t('publicHome.snapshot.viewFullMarket')}
          </button>
          </PublicWidgetState>
        </article>

        {/* Card 3: Crop Advisory */}
        <article className={styles.snapshotCard} aria-label={t('publicHome.snapshot.advisoryCardTitle')}>
          <PublicWidgetState
            locale={locale}
            status={widgetStates.advisory}
            label={t('publicHome.snapshot.advisoryCardTitle')}
          >
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('publicHome.snapshot.advisoryCardTitle')}</h3>
              <span aria-hidden="true">🌾</span>
            </div>
            <p className={styles.cardValueLarge} style={{ fontSize: '1.25rem', lineHeight: 1.3 }}>
              {advisoryTitle}
            </p>
            <p className={styles.cardValueText}>{advisoryValidity}</p>
          </div>
          <button type="button" onClick={openAdvisoryModal} className={styles.cardActionBtn}>
            {t('publicHome.snapshot.viewFullAdvisory')}
          </button>
          </PublicWidgetState>
        </article>

        {/* Card 4: Open Scheme Windows */}
        <article className={styles.snapshotCard} aria-label={t('publicHome.snapshot.schemesCardTitle')}>
          <PublicWidgetState
            locale={locale}
            status={widgetStates.schemes}
            label={t('publicHome.snapshot.schemesCardTitle')}
          >
          <div>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{t('publicHome.snapshot.schemesCardTitle')}</h3>
              <span aria-hidden="true">📋</span>
            </div>
            <p className={styles.cardValueLarge}>
              {t('publicHome.snapshot.openWindowsCount', { count: 3 })}
            </p>
            <p className={styles.cardValueText}>{t('publicHome.snapshot.nearestDeadline')}</p>
          </div>
          <button type="button" onClick={openSchemesModal} className={styles.cardActionBtn}>
            {t('publicHome.snapshot.viewOpenSchemes')}
          </button>
          </PublicWidgetState>
        </article>
      </div>
    </section>
  );
}

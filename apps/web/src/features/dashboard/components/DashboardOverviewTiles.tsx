import React from 'react';
import Link from 'next/link';
import type { DistrictWeatherSummary } from '@krishisetu/weather-advisory';
import { formatNumber, type Locale, translate } from '@krishisetu/i18n';
import { ArrowRightIcon, MarketIcon, WeatherIcon } from '../../../components/icons.js';
import { PUBLIC_HOME_FIXTURE } from '../../public-home/public-home.fixture.js';
import styles from './DashboardOverviewTiles.module.css';

export interface DashboardOverviewTilesProps {
  readonly locale: Locale;
  readonly weather: DistrictWeatherSummary;
}

export function DashboardOverviewTiles({
  locale,
  weather,
}: DashboardOverviewTilesProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const market = PUBLIC_HOME_FIXTURE.marketRows[0]!;
  const positive = market.direction === 'UP';

  return (
    <section className={styles.section} aria-label={t('dashboard.dailyOverview')}>
      <div className={styles.headingRow}>
        <div>
          <p className={styles.eyebrow}>{t('dashboard.todayEyebrow')}</p>
          <h2 className={styles.heading}>{t('dashboard.dailyOverview')}</h2>
        </div>
        <p className={styles.location}>
          {t(weather.districtNameKey)}{weather.talukaNameKey ? ` · ${t(weather.talukaNameKey)}` : ''}
        </p>
      </div>

      <div className={styles.grid}>
        <Link className={`${styles.tile} ${styles.weatherTile}`} href={`/${locale}/weather`}>
          <div className={styles.tileTopline}>
            <span className={styles.iconWrap}><WeatherIcon size={22} aria-hidden={true} /></span>
            <span className={styles.tileLabel}>{t('dashboard.weatherNow')}</span>
            <span className={styles.liveDot}>{t('dashboard.live')}</span>
          </div>
          <div className={styles.primaryRow}>
            <strong className={styles.primaryValue}>{weather.temperatureCelsius}°</strong>
            <div>
              <p className={styles.primaryTitle}>{t(`weather.conditions.${weather.conditionCode}`)}</p>
              <p className={styles.secondary}>{t('weather.rainfall24h')}: {weather.rainfallMm24h} mm</p>
            </div>
          </div>
          <div className={styles.stats}>
            <span><b>{weather.relativeHumidityPercent}%</b> {t('weather.humidity')}</span>
            <span><b>{weather.windSpeedKmh} km/h</b> {t('weather.windSpeed')}</span>
          </div>
          <span className={styles.cta}>{t('dashboard.openWeather')} <ArrowRightIcon size={17} aria-hidden={true} /></span>
        </Link>

        <Link className={`${styles.tile} ${styles.marketTile}`} href={`/${locale}/market`}>
          <div className={styles.tileTopline}>
            <span className={styles.iconWrap}><MarketIcon size={22} aria-hidden={true} /></span>
            <span className={styles.tileLabel}>{t('dashboard.marketSnapshot')}</span>
            <span className={styles.marketTag}>{t(weather.districtNameKey)}</span>
          </div>
          <div className={styles.primaryRow}>
            <strong className={styles.marketValue}>{market.displayPrice}</strong>
            <div>
              <p className={styles.primaryTitle}>{t(market.commodityKey)}</p>
              <p className={`${styles.change} ${positive ? styles.up : styles.down}`}>
                {positive ? '▲' : '▼'} {Math.abs(market.changePercent)}% {t('dashboard.today')}
              </p>
            </div>
          </div>
          <div className={styles.stats}>
            <span><b>{formatNumber(market.arrivalQuintals, locale)} q</b> {t('publicHome.market.arrival')}</span>
            <span><b>4</b> {t('dashboard.commoditiesTracked')}</span>
          </div>
          <span className={styles.cta}>{t('dashboard.openMarket')} <ArrowRightIcon size={17} aria-hidden={true} /></span>
        </Link>
      </div>
    </section>
  );
}

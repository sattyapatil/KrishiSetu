'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@krishisetu/i18n';
import { formatNumber, translate } from '@krishisetu/i18n';
import { ArrowLeftIcon, MarketIcon } from '../../components/icons.js';
import { PUBLIC_HOME_FIXTURE } from '../public-home/public-home.fixture.js';
import { useJourney } from '../journey/index.js';
import { getDashboardViewModel } from '../dashboard/fixtures/dashboard-fixture.js';
import styles from './MarketPageView.module.css';

export interface MarketPageViewProps { readonly locale: Locale; }

export function MarketPageView({ locale }: MarketPageViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const { session } = useJourney();
  const farmer = getDashboardViewModel(session?.farmerId ?? '27202600000001').farmer;
  const marketArea = t(farmer.districtKey);
  const rows = PUBLIC_HOME_FIXTURE.marketRows;
  const gainers = rows.filter((row) => row.direction === 'UP').length;
  const totalArrivals = rows.reduce((total, row) => total + row.arrivalQuintals, 0);
  const [selected, setSelected] = React.useState('ALL');
  const visibleRows = selected === 'ALL' ? rows : rows.filter((row) => row.commodity === selected);

  return (
    <main className={styles.page}>
      <Link className={styles.back} href={`/${locale}/dashboard`}><ArrowLeftIcon size={17} aria-hidden={true} /> {t('navigation.dashboard')}</Link>
      <header className={styles.hero}>
        <div className={styles.titleRow}>
          <span className={styles.icon}><MarketIcon size={27} aria-hidden={true} /></span>
          <div><p className={styles.eyebrow}>{marketArea}</p><h1>{t('publicHome.market.title')}</h1></div>
        </div>
        <p>{t('publicHome.market.description')}</p>
        <div className={styles.heroStats}>
          <div><span>{t('dashboard.commoditiesTracked')}</span><strong>{rows.length}</strong></div>
          <div><span>{t('publicHome.market.directionUp')}</span><strong className={styles.positive}>{gainers}</strong></div>
          <div><span>{t('publicHome.market.arrival')}</span><strong>{formatNumber(totalArrivals, locale)} q</strong></div>
        </div>
      </header>

      <section className={styles.marketPanel}>
        <div className={styles.panelHead}>
          <div><h2>{t('publicHome.market.tableLabel')}</h2><p>{t('publicHome.market.freshness')} · {t('publicHome.market.disclaimer')}</p></div>
          <label>{t('publicHome.market.commodity')}
            <select value={selected} onChange={(event) => setSelected(event.target.value)}>
              <option value="ALL">{t('publicHome.market.allCommodities')}</option>
              {rows.map((row) => <option key={row.commodity} value={row.commodity}>{t(row.commodityKey)}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>{t('publicHome.market.colCommodity')}</th><th>{t('publicHome.market.colPrice')}</th><th>{t('publicHome.market.colChange')}</th><th>{t('publicHome.market.colArrival')}</th><th>{t('publicHome.market.marketYard')}</th></tr></thead>
            <tbody>{visibleRows.map((row) => (
              <tr key={row.commodity}>
                <td><strong>{t(row.commodityKey)}</strong><small>{t('publicHome.market.unit')}</small></td>
                <td className={styles.price}>{row.displayPrice}</td>
                <td><span className={row.direction === 'UP' ? styles.up : styles.down}>{row.direction === 'UP' ? '▲' : '▼'} {Math.abs(row.changePercent)}%</span></td>
                <td>{formatNumber(row.arrivalQuintals, locale)} {t('publicHome.market.quintals')}</td>
                <td>{marketArea}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <aside className={styles.note}><strong>{t('publicHome.market.representativeNote')}</strong><p>{t('publicHome.market.disclaimer')}</p></aside>
    </main>
  );
}

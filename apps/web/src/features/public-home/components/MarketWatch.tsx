'use client';

import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import type { PublicMarketRow, ActiveDetailModalState, PublicWidgetStatus } from '../public-home.types.js';
import { PublicWidgetState } from './PublicWidgetState.js';
import styles from '../PublicHomeView.module.css';

export interface MarketWatchProps {
  readonly locale: Locale;
  readonly marketRows: readonly PublicMarketRow[];
  readonly status: PublicWidgetStatus;
  readonly onOpenModal: (modal: ActiveDetailModalState) => void;
}

export function MarketWatch({
  locale,
  marketRows,
  status,
  onOpenModal,
}: MarketWatchProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const [selectedCommodity, setSelectedCommodity] = useState('ALL');

  const filteredRows =
    selectedCommodity === 'ALL'
      ? marketRows
      : marketRows.filter((r) => r.commodity.toUpperCase() === selectedCommodity);

  const handleOpenMarketDetails = () => {
    onOpenModal({
      type: 'MARKET',
      title: `${t('publicHome.market.title')} — ${t('publicHome.market.puneMarketYard')}`,
      subtitle: t('publicHome.market.disclaimer'),
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {t('publicHome.market.freshness')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {marketRows.map((r) => (
              <div
                key={r.commodity}
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                  border: '1px solid var(--ks-color-border, #cbd5e1)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{t(r.commodityKey)}</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {t('publicHome.market.arrival')}: {r.arrivalQuintals} {t('publicHome.market.quintals')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                    {r.displayPrice}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color:
                        r.direction === 'UP'
                          ? 'var(--ks-color-success, #15803d)'
                          : 'var(--ks-color-error-dark, #991b1b)',
                    }}
                  >
                    {r.changePercent > 0 ? '+' : ''}
                    {r.changePercent}% ({r.direction === 'UP' ? t('publicHome.market.directionUp') : t('publicHome.market.directionDown')})
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            {t('publicHome.market.representativeNote')}
          </p>
        </div>
      ),
    });
  };

  return (
    <section id="market" className={styles.sectionWrapper} aria-labelledby="market-heading">
      <div className={styles.sectionHeader}>
        <h2 id="market-heading" className={styles.sectionTitle}>
          {t('publicHome.market.title')}
        </h2>
        <p className={styles.sectionDescription}>{t('publicHome.market.description')}</p>
      </div>

      <PublicWidgetState locale={locale} status={status} label={t('publicHome.market.title')}>
        <div className={styles.marketCard}>
        {/* Controls and metadata header */}
        <div className={styles.marketControlsBar}>
          <div className={styles.marketMetaGroup}>
            <p className={styles.marketDisclaimer}>{t('publicHome.market.disclaimer')}</p>
            <p className={styles.marketFreshness}>{t('publicHome.market.freshness')}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label htmlFor="commodity-filter" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {t('publicHome.market.commodity')}:
            </label>
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
              }}
            >
              <select
                id="commodity-filter"
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                style={{
                  minHeight: '2.5rem',
                  padding: '0.375rem 2.5rem 0.375rem 0.75rem',
                  border: '1px solid var(--ks-color-border, #cbd5e1)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
                  color: 'var(--ks-color-text, #0f172a)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                <option value="ALL">{t('publicHome.market.allCommodities')}</option>
                {marketRows.map((r) => (
                  <option key={r.commodity} value={r.commodity.toUpperCase()}>
                    {t(r.commodityKey)}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ks-color-text-muted, #475569)',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className={styles.marketTableWrapper}>
          <table className={styles.marketTable} aria-label={t('publicHome.market.tableLabel')}>
            <thead>
              <tr>
                <th scope="col">{t('publicHome.market.colCommodity')}</th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  {t('publicHome.market.colPrice')} ({t('publicHome.market.unit')})
                </th>
                <th scope="col" style={{ textAlign: 'center' }}>
                  {t('publicHome.market.colChange')}
                </th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  {t('publicHome.market.colArrival')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.commodity}>
                  <td style={{ fontWeight: 600 }}>{t(row.commodityKey)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                    {row.displayPrice}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={`${styles.directionTag} ${
                        row.direction === 'UP' ? styles.directionUp : styles.directionDown
                      }`}
                    >
                      <span aria-hidden="true">{row.direction === 'UP' ? '▲' : '▼'}</span>
                      <span>
                        {row.changePercent > 0 ? '+' : ''}
                        {row.changePercent}%
                      </span>
                      <span>
                        ({row.direction === 'UP' ? t('publicHome.market.directionUp') : t('publicHome.market.directionDown')})
                      </span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {row.arrivalQuintals} {t('publicHome.market.quintals')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className={styles.marketFooterActions}>
          <button
            type="button"
            onClick={handleOpenMarketDetails}
            className={styles.schemeSecondaryBtn}
          >
            {t('publicHome.market.viewDetails')}
          </button>
        </div>
        </div>
      </PublicWidgetState>
    </section>
  );
}

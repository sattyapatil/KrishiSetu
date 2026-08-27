'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { CheckIcon, FilterIcon, SchemesIcon } from '../../components/icons.js';
import { SYNTHETIC_SCHEMES_CATALOG } from './fixtures.js';
import { useJourney } from '../journey/index.js';
import { StickyApplicationBar } from '../dashboard/components/StickyApplicationBar.js';
import styles from './SchemeListView.module.css';

type SchemeFilter = 'ALL' | 'MAHADBT' | 'ULI';

export interface SchemeListViewProps { readonly locale: Locale; }

export function SchemeListView({ locale }: SchemeListViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) => translate(key, locale, params);
  const { selectedOfferings, toggleOffering } = useJourney();
  const [filter, setFilter] = React.useState<SchemeFilter>('ALL');
  const [query, setQuery] = React.useState('');

  const catalog = SYNTHETIC_SCHEMES_CATALOG.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.domain === filter;
    const haystack = `${t(item.titleKey)} ${t(item.descKey)} ${item.providerName}`.toLocaleLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLocaleLowerCase());
  });

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroIcon}><SchemesIcon size={26} aria-hidden={true} /></div>
        <div>
          <p className={styles.eyebrow}>{t('schemes.eyebrow')}</p>
          <h1>{t('schemes.pageTitle')}</h1>
          <p>{t('schemes.pageSubtitle')}</p>
        </div>
        <div className={styles.heroStat}>
          <strong>{SYNTHETIC_SCHEMES_CATALOG.length}</strong>
          <span>{t('schemes.matchedPrograms')}</span>
        </div>
      </header>

      <section className={styles.eligibilityNote} aria-label={t('schemes.eligibilityPreview')}>
        <span className={styles.shield}><CheckIcon size={18} aria-hidden={true} /></span>
        <div>
          <strong>{t('schemes.eligibilityPreview')}</strong>
          <p>{t('schemes.eligibilityPreviewDesc')}</p>
        </div>
      </section>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className={styles.srOnly}>{t('schemes.searchLabel')}</span>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('schemes.searchPlaceholder')} />
        </label>
        <div className={styles.filters} aria-label={t('schemes.filterLabel')}>
          <FilterIcon size={17} aria-hidden={true} />
          {(['ALL', 'MAHADBT', 'ULI'] as const).map((option) => (
            <button key={option} type="button" className={filter === option ? styles.activeFilter : ''} aria-pressed={filter === option} onClick={() => setFilter(option)}>
              {t(`schemes.filter${option}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultLine}>{t('schemes.showingResults', { count: catalog.length })}</div>

      <section className={styles.grid} aria-live="polite">
        {catalog.map((item) => {
          const isSelected = selectedOfferings.has(item.id);
          const isCredit = item.domain === 'ULI';
          return (
            <article key={item.id} className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
              <div className={styles.cardTop}>
                <span className={`${styles.typeBadge} ${isCredit ? styles.creditBadge : ''}`}>
                  {isCredit ? t('schemes.creditType') : t('schemes.subsidyType')}
                </span>
                <span className={styles.source}>{item.domain === 'MAHADBT' ? t('schemes.sourceMahadbt') : t('credit.sourceUli')}</span>
              </div>
              <div>
                <h2>{t(item.titleKey)}</h2>
                <p className={styles.description}>{t(item.descKey)}</p>
              </div>
              <div className={styles.benefit}>
                <span>{isCredit ? t('credit.estimatedLimit') : t('schemes.estimatedBenefit')}</span>
                <strong>{formatCurrencyFromPaise(item.estimatedBenefitPaise, locale)}</strong>
                {item.subsidyPercentage > 0 && <small>{t('schemes.subsidyRate', { percent: item.subsidyPercentage })}</small>}
              </div>
              <div className={styles.matchBlock}>
                <p><CheckIcon size={16} aria-hidden={true} /> {t('schemes.profileMatch')}</p>
                <ul>{item.reasons.slice(0, 2).map((reason) => <li key={reason}>{t(reason)}</li>)}</ul>
              </div>
              <div className={styles.cardActions}>
                <Link href={`/${locale}/schemes/${item.id}`}>{t('schemes.viewSchemeDetails')}</Link>
                <button type="button" onClick={() => toggleOffering(item.id)} aria-pressed={isSelected}>
                  {isSelected && <CheckIcon size={16} aria-hidden={true} />}
                  {isSelected ? t('schemes.alreadySelected') : t('schemes.selectOffering')}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {catalog.length === 0 && <div className={styles.empty}>{t('schemes.noResults')}</div>}
      <StickyApplicationBar locale={locale} />
    </main>
  );
}

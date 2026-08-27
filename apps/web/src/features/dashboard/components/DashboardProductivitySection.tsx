'use client';

import React from 'react';
import Link from 'next/link';
import {
  formatHectares,
  formatLocalizedDate,
  formatNumber,
  type Locale,
  translate,
} from '@krishisetu/i18n';
import { ApplicationsIcon, SchemesIcon } from '../../../components/icons.js';
import { useJourney } from '../../journey/index.js';
import { downloadSyntheticSevenTwelve } from '../../land-records/download-synthetic-seven-twelve.js';
import type { DashboardViewModel } from '../types/dashboard-view-model.js';
import styles from './DashboardProductivitySection.module.css';

export interface DashboardProductivitySectionProps {
  readonly locale: Locale;
  readonly viewModel: DashboardViewModel;
}

export function DashboardProductivitySection({
  locale,
  viewModel,
}: DashboardProductivitySectionProps): React.JSX.Element {
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { adapter } = useJourney();
  const applicationCount = adapter.listBundles().length;
  const opportunityCount = viewModel.schemes.length + viewModel.credit.length;

  const handleDownload = () => {
    downloadSyntheticSevenTwelve({
      farmerIdMasked: `••••••••••${viewModel.farmer.id.slice(-4)}`,
      farmerName: viewModel.farmer.name,
      generatedAt: formatLocalizedDate(viewModel.generatedAt, locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      totalCultivableShareHectares: formatHectares(
        viewModel.farmer.landHoldingsHectares,
        locale
      ),
      holdings: viewModel.landHoldings,
      labels: {
        documentTitle: t('land.syntheticExtractTitle'),
        prototypeNotice: t('land.syntheticExtractNotice'),
        farmerName: t('applications.fieldFarmerName'),
        farmerId: t('auth.farmerIdLabel'),
        generatedAt: t('dashboard.generatedAt'),
        totalArea: t('land.totalArea'),
        holding: t('land.holding'),
        surveyNumber: t('land.surveyNumber'),
        ulpin: t('land.ulpin'),
        village: t('land.village'),
        ownership: t('land.ownership'),
        allocatedShare: t('land.allocatedShare'),
        encumbrance: t('land.encumbrance'),
        yes: t('common.yes'),
        no: t('common.no'),
      },
    });
  };

  return (
    <section className={styles.section} aria-labelledby="farm-workspace-heading">
      <div className={styles.headingRow}>
        <div>
          <h2 id="farm-workspace-heading" className={styles.heading}>
            {t('dashboard.workspaceTitle')}
          </h2>
          <p className={styles.subtitle}>{t('dashboard.workspaceSubtitle')}</p>
        </div>
        <p className={styles.freshness}>
          {t('dashboard.generatedAt')}: {' '}
          {formatLocalizedDate(viewModel.generatedAt, locale, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>{t('dashboard.metricArea')}</span>
          <strong className={styles.metricValue}>
            {formatHectares(viewModel.farmer.landHoldingsHectares, locale)}
          </strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>{t('dashboard.metricCrops')}</span>
          <strong className={styles.metricValue}>
            {formatNumber(viewModel.cropRecords.length, locale)}
          </strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>{t('dashboard.metricOpportunities')}</span>
          <strong className={styles.metricValue}>
            {formatNumber(opportunityCount, locale)}
          </strong>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>{t('dashboard.metricApplications')}</span>
          <strong className={styles.metricValue}>
            {formatNumber(applicationCount, locale)}
          </strong>
        </div>
      </div>

      <div className={styles.actionsCard}>
        <div>
          <h3 className={styles.actionsTitle}>{t('dashboard.servicesLauncherTitle')}</h3>
          <p className={styles.subtitle}>{t('dashboard.servicesLauncherSubtitle')}</p>
        </div>
        <button
          type="button"
          className={styles.launcherButton}
          aria-expanded={servicesOpen}
          aria-controls="farmer-service-shortcuts"
          onClick={() => setServicesOpen((current) => !current)}
        >
          {servicesOpen ? t('dashboard.hideServices') : t('dashboard.showServices')}
          <span aria-hidden="true">{servicesOpen ? '−' : '+'}</span>
        </button>
      </div>

      {servicesOpen && (
        <div id="farmer-service-shortcuts" className={styles.actions}>
          <button type="button" className={styles.downloadButton} onClick={handleDownload}>
            {t('land.downloadSyntheticExtract')}
          </button>
          <Link className={styles.action} href={`/${locale}/applications`}>
            <ApplicationsIcon size={18} aria-hidden={true} />
            {t('dashboard.viewApplications')}
          </Link>
          <Link className={styles.action} href={`/${locale}/schemes`}>
            <SchemesIcon size={18} aria-hidden={true} />
            {t('dashboard.browseSchemes')}
          </Link>
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import type { Locale } from '@krishisetu/i18n';
import { translate } from '@krishisetu/i18n';
import type { ActiveDetailModalState } from './public-home.types.js';
import { PUBLIC_HOME_FIXTURE } from './public-home.fixture.js';

import { PublicHeader } from './components/PublicHeader.js';
import { PublicHero } from './components/PublicHero.js';
import { PublicAlertBand } from './components/PublicAlertBand.js';
import { FarmerSnapshot } from './components/FarmerSnapshot.js';
import { PublicServiceGrid } from './components/PublicServiceGrid.js';
import { MarketWatch } from './components/MarketWatch.js';
import { FeaturedSchemes } from './components/FeaturedSchemes.js';
import { NoticesAndUpdates } from './components/NoticesAndUpdates.js';
import { HowItWorks } from './components/HowItWorks.js';
import { PublicTrustPanel } from './components/PublicTrustPanel.js';
import { FinalLoginCta } from './components/FinalLoginCta.js';
import { PublicFooter } from './components/PublicFooter.js';
import { PublicDetailModal } from './components/PublicDetailModal.js';
import styles from './PublicHomeView.module.css';

export interface PublicHomeViewProps {
  readonly locale: Locale;
  readonly onSelectLocale?: (locale: Locale) => void;
}

export function PublicHomeView({
  locale,
  onSelectLocale,
}: PublicHomeViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const [activeModal, setActiveModal] = useState<ActiveDetailModalState | null>(null);

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleOpenModal = (modal: ActiveDetailModalState) => {
    setActiveModal(modal);
  };

  return (
    <div className={styles.landingContainer}>
      {/* 2. Public Header */}
      <PublicHeader locale={locale} onSelectLocale={onSelectLocale} />

      {/* 3. Hero Section */}
      <PublicHero locale={locale} />

      {/* 4. Important Public Alert */}
      <PublicAlertBand
        locale={locale}
        alert={PUBLIC_HOME_FIXTURE.alert}
        status={PUBLIC_HOME_FIXTURE.widgetStates.alert}
        onOpenModal={handleOpenModal}
      />

      {/* 5. Current Farmer Snapshot */}
      <FarmerSnapshot
        locale={locale}
        weather={PUBLIC_HOME_FIXTURE.weather}
        marketRow={PUBLIC_HOME_FIXTURE.marketRows[0]!}
        widgetStates={PUBLIC_HOME_FIXTURE.widgetStates}
        onOpenModal={handleOpenModal}
      />

      {/* 6. Explore Farmer Services */}
      <PublicServiceGrid locale={locale} onOpenModal={handleOpenModal} />

      {/* 7. Market Watch */}
      <MarketWatch
        locale={locale}
        marketRows={PUBLIC_HOME_FIXTURE.marketRows}
        status={PUBLIC_HOME_FIXTURE.widgetStates.market}
        onOpenModal={handleOpenModal}
      />

      {/* 8. Featured Schemes */}
      <FeaturedSchemes
        locale={locale}
        schemes={PUBLIC_HOME_FIXTURE.featuredSchemes}
        status={PUBLIC_HOME_FIXTURE.widgetStates.schemes}
        onOpenModal={handleOpenModal}
      />

      {/* 9. Public Notices and Agriculture Updates */}
      <NoticesAndUpdates
        locale={locale}
        notices={PUBLIC_HOME_FIXTURE.notices}
        updates={PUBLIC_HOME_FIXTURE.updates}
        noticeStatus={PUBLIC_HOME_FIXTURE.widgetStates.notices}
        updateStatus={PUBLIC_HOME_FIXTURE.widgetStates.updates}
        onOpenModal={handleOpenModal}
      />

      {/* 10. How KrishiSetu Works */}
      <HowItWorks locale={locale} />

      {/* 11. Privacy and Trust Panel */}
      <PublicTrustPanel locale={locale} />

      {/* 12. Final Login CTA */}
      <FinalLoginCta locale={locale} />

      {/* 13. Public Footer */}
      <PublicFooter locale={locale} onOpenModal={handleOpenModal} />

      {/* Accessible Detail Modal / Panel for Non-Dead CTAs */}
      <PublicDetailModal
        modalState={activeModal}
        onClose={handleCloseModal}
        closeLabel={t('publicHome.common.close')}
      />
    </div>
  );
}

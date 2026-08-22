import React, { useState } from 'react';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { Button, DataCard, Card, StatusBadge, Alert } from '@krishisetu/design-system';
import { PublicNotice, sortNoticesByPriority } from '@krishisetu/notifications';
import { NotificationCentre } from '../notifications/index.js';
import { DistrictWeatherCard } from '../weather-advisory/index.js';
import { DashboardViewModel } from './types/dashboard-view-model.js';
import { getDashboardViewModel } from './fixtures/dashboard-fixture.js';

export interface DashboardViewProps {
  readonly locale: Locale;
  readonly farmerId?: string;
  readonly viewModel?: DashboardViewModel;
  readonly onProceedToBundle: (selectedOfferings: string[]) => void;
  readonly onOpenNotice?: (notice: PublicNotice) => void;
}

export function DashboardView({
  locale,
  farmerId = '27202600000001',
  viewModel: initialViewModel,
  onProceedToBundle,
  onOpenNotice,
}: DashboardViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);

  const vm = initialViewModel ?? getDashboardViewModel(farmerId);
  const [selectedOfferings, setSelectedOfferings] = useState<Set<string>>(
    new Set(['offering_drip_2026', 'offering_kcc_2026'])
  );
  const [isNotificationCentreOpen, setIsNotificationCentreOpen] = useState(false);
  const [uliStatus, setUliStatus] = useState<'OK' | 'TIMEOUT'>('OK');
  const [isRefreshingUli, setIsRefreshingUli] = useState(false);

  const toggleOffering = (offeringId: string) => {
    const next = new Set(selectedOfferings);
    if (next.has(offeringId)) {
      next.delete(offeringId);
    } else {
      next.add(offeringId);
    }
    setSelectedOfferings(next);
  };

  const handleRefreshUli = () => {
    setIsRefreshingUli(true);
    setTimeout(() => {
      setUliStatus('OK');
      setIsRefreshingUli(false);
    }, 600);
  };

  const activeNotices = vm.notices.filter((n) => n.status === 'ACTIVE');
  const criticalAction = vm.actionItems.find((a) => a.priority === 'CRITICAL');
  const topThreeNotices = sortNoticesByPriority(activeNotices).slice(0, 3);

  return (
    <div className="ks-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Farmer Identity & Notification Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderRadius: '0.75rem',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
              margin: '0 0 0.25rem 0',
            }}
          >
            {vm.farmer.name}
          </h1>
          <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)', fontSize: '0.875rem' }}>
            {t('land.village')}: {vm.farmer.villageKey} • {t('auth.farmerIdLabel')}: ••••••••••{vm.farmer.id.slice(-4)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusBadge status="ready" label={t('common.verified')} />
          <StatusBadge status="mockResult" label="Prototype" />

          {/* Notification Centre Bell Trigger */}
          <button
            type="button"
            onClick={() => setIsNotificationCentreOpen(true)}
            aria-label={`${t('notifications.centreTitle')}, ${activeNotices.length} updates`}
            style={{
              minHeight: '2.75rem',
              minWidth: '2.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
            }}
          >
            <span aria-hidden="true">🔔</span>
            <span>{t('notifications.centreTitle')}</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--ks-color-civic-blue, #1e3a8a)',
                color: 'var(--ks-color-surface-card, #ffffff)',
                borderRadius: '9999px',
                padding: '0.125rem 0.375rem',
                minWidth: '1.25rem',
                textAlign: 'center',
              }}
            >
              {activeNotices.length}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Critical Action / Urgent Alert Banner */}
      {criticalAction && (
        <Alert
          variant="error"
          title={t(criticalAction.titleKey)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.375rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {t(criticalAction.descriptionKey)}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNotificationCentreOpen(true)}
            >
              {t(criticalAction.actionLabelKey)}
            </Button>
          </div>
        </Alert>
      )}

      {/* 3. Main Dashboard 8 / 4 Responsive Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left / Primary Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Source Integration Status Bar */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              borderRadius: '0.5rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ks-color-text-muted, #475569)' }}>
              {t('dashboard.overallStatus')}:
            </span>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ks-color-success-surface, #f0fdf4)', color: 'var(--ks-color-success-dark, #166534)', borderRadius: '0.25rem', border: '1px solid var(--ks-color-success-border, #86efac)' }}>
              Mahabhumi 7/12 (22ms)
            </span>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ks-color-success-surface, #f0fdf4)', color: 'var(--ks-color-success-dark, #166534)', borderRadius: '0.25rem', border: '1px solid var(--ks-color-success-border, #86efac)' }}>
              Crop Registry (18ms)
            </span>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ks-color-success-surface, #f0fdf4)', color: 'var(--ks-color-success-dark, #166534)', borderRadius: '0.25rem', border: '1px solid var(--ks-color-success-border, #86efac)' }}>
              MahaDBT (31ms)
            </span>
            {uliStatus === 'OK' ? (
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ks-color-success-surface, #f0fdf4)', color: 'var(--ks-color-success-dark, #166534)', borderRadius: '0.25rem', border: '1px solid var(--ks-color-success-border, #86efac)' }}>
                ULI Credit (36ms)
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ks-color-warning-surface, #fef3c7)', color: 'var(--ks-color-warning-text, #78350f)', borderRadius: '0.25rem', border: '1px solid var(--ks-color-warning-border, #fde68a)', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                ULI Credit (Timeout)
                <button type="button" onClick={handleRefreshUli} style={{ border: 'none', background: 'transparent', textDecoration: 'underline', color: 'var(--ks-color-warning-text, #78350f)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                  {isRefreshingUli ? '...' : t('common.retry')}
                </button>
              </span>
            )}
          </div>

          {/* Core Progressive Disclosure Data Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
              gap: '1rem',
            }}
          >
            <DataCard
              id="card-land"
              eyebrow={t('land.eyebrow')}
              title={t('land.cardTitle')}
              primaryValue={vm.farmer.landHoldingsHectares}
              unit={t('land.totalArea')}
              summary={t('land.summary')}
              status="ready"
              statusLabel={t('common.ready')}
              showDetailsText={t('common.showDetails')}
              hideDetailsText={t('common.hideDetails')}
              detailsChildren={
                <div style={{ fontSize: '0.875rem', lineHeight: '1.375rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.surveyNumber')}:</strong> 123/1A</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.ulpin')}:</strong> ••••••••••0128</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.ownership')}:</strong> 1/2 (50%)</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.allocatedShare')}:</strong> {vm.farmer.landHoldingsHectares} ha</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.encumbrance')}:</strong> {t('land.encumbrancePresent')}</p>
                  <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ks-color-text-muted, #475569)' }}>{t('land.sourceMahabhumi')}</p>
                </div>
              }
            />

            <DataCard
              id="card-crops"
              eyebrow={t('crops.eyebrow')}
              title={t('crops.cardTitle')}
              primaryValue={vm.farmer.landHoldingsHectares}
              unit="Kharif 2026"
              summary={t('crops.summary')}
              status="ready"
              statusLabel={t('common.ready')}
              showDetailsText={t('common.showDetails')}
              hideDetailsText={t('common.hideDetails')}
              detailsChildren={
                <div style={{ fontSize: '0.875rem', lineHeight: '1.375rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('crops.soybean')}:</strong> 0.5000 ha (MOCK_VERIFIED)</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('crops.pigeonPea')}:</strong> 0.1750 ha (MOCK_VERIFIED)</p>
                  <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ks-color-text-muted, #475569)' }}>{t('crops.sourceCropRegistry')}</p>
                </div>
              }
            />

            <DataCard
              id="card-bank"
              eyebrow={t('dashboard.bankSummary')}
              title={t('credit.bankReadiness')}
              primaryValue={vm.farmer.maskedAccount}
              unit={vm.farmer.bankName}
              summary={t('credit.bankReady')}
              status="ready"
              statusLabel={t('common.ready')}
              showDetailsText={t('common.showDetails')}
              hideDetailsText={t('common.hideDetails')}
              detailsChildren={
                <div style={{ fontSize: '0.875rem', lineHeight: '1.375rem' }}>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>Status:</strong> NPCI Direct Benefit Transfer Mapped</p>
                  <p style={{ margin: '0 0 0.25rem 0' }}><strong>Verification:</strong> Simulated Link Active</p>
                </div>
              }
            />
          </div>

          {/* Eligible Program Bundling Section */}
          <section aria-labelledby="eligible-offerings-heading">
            <h2
              id="eligible-offerings-heading"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--ks-color-text, #0f172a)',
                margin: '0 0 0.25rem 0',
              }}
            >
              {t('dashboard.selectOfferings')}
            </h2>
            <p style={{ color: 'var(--ks-color-text-muted, #475569)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              {t('dashboard.schemesSummary')} & {t('dashboard.creditSummary')}
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* MahaDBT Scheme Offering */}
              {vm.schemes.map((scheme) => (
                <Card
                  key={scheme.id}
                  id={scheme.id}
                  title={t(scheme.titleKey)}
                  subtitle={t(scheme.descKey)}
                  footerSlot={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedOfferings.has(scheme.id)}
                          onChange={() => toggleOffering(scheme.id)}
                          style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--ks-color-agri-green, #166534)' }}
                        />
                        <span>Include in Application</span>
                      </label>
                      <StatusBadge status="ready" label={t('schemes.likelyEligible')} />
                    </div>
                  }
                >
                  <div style={{ margin: '0.5rem 0' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-agri-green, #166534)' }}>
                      {formatCurrencyFromPaise(scheme.estimatedBenefitPaise, locale)}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                      {t('schemes.estimatedBenefit')} ({scheme.subsidyPercentage}% subsidy based on {vm.farmer.landHoldingsHectares} ha cultivable share)
                    </p>
                  </div>
                  <ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)' }}>
                    {scheme.reasons.map((r, idx) => (
                      <li key={idx}>{t(r)}</li>
                    ))}
                  </ul>
                </Card>
              ))}

              {/* ULI Credit Offering */}
              {vm.credit.map((creditItem) => (
                <Card
                  key={creditItem.id}
                  id={creditItem.id}
                  title={t(creditItem.titleKey)}
                  subtitle={t(creditItem.descKey)}
                  footerSlot={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedOfferings.has(creditItem.id)}
                          onChange={() => toggleOffering(creditItem.id)}
                          style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--ks-color-agri-green, #166534)' }}
                        />
                        <span>Include in Application</span>
                      </label>
                      <StatusBadge status="ready" label={t('credit.prequalifiedMock')} />
                    </div>
                  }
                >
                  <div style={{ margin: '0.5rem 0' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                      {formatCurrencyFromPaise(creditItem.estimatedLimitPaise, locale)}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                      {t('credit.estimatedLimit')} • {t(creditItem.interestSubventionKey)}
                    </p>
                  </div>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', fontStyle: 'italic' }}>
                    {t('credit.mockEstimateOnly')}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Technical Details & Audit Disclosure */}
          <details
            style={{
              padding: '1rem',
              backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
              borderRadius: '0.5rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              fontSize: '0.8125rem',
            }}
          >
            <summary style={{ fontWeight: 700, cursor: 'pointer', color: 'var(--ks-color-text, #0f172a)' }}>
              Technical Transparency & Audit Details
            </summary>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Audit Tracking ID:</strong> <code>{vm.technicalDetails.auditTrackingId}</code></div>
              <div><strong>Consent Granted At:</strong> {vm.technicalDetails.consentGrantTime}</div>
              <div><strong>Active Scopes:</strong> {vm.technicalDetails.activeScopes.join(', ')}</div>
              <div><strong>Session Expiry:</strong> {vm.technicalDetails.sessionExpiry}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Data Sources & Simulated Latency:</strong>
                <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem' }}>
                  {vm.technicalDetails.dataSources.map((ds, idx) => (
                    <li key={idx}>
                      {ds.name} — {ds.latencyMs}ms ({ds.status})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        </div>

        {/* Right / Secondary Sidebar Column */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* District Weather & Agromet Advisory */}
          <DistrictWeatherCard weather={vm.weather} locale={locale} />

          {/* Public Notices Feed Sidebar Card */}
          <section
            aria-labelledby="sidebar-notices-title"
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
              borderRadius: '0.75rem',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3
                id="sidebar-notices-title"
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--ks-color-civic-blue-dark, #172554)',
                }}
              >
                {t('notifications.title')}
              </h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.125rem 0.375rem',
                  backgroundColor: 'var(--ks-color-civic-blue-light, #dbeafe)',
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                  borderRadius: '9999px',
                }}
              >
                {activeNotices.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topThreeNotices.map((notice) => (
                <div
                  key={notice.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--ks-color-border, #cbd5e1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                      {t(`notifications.types.${notice.type}`)}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                      {notice.publishedAt.split('T')[0]}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.8125rem', color: 'var(--ks-color-text, #0f172a)' }}>
                    {t(notice.titleKey)}
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {t(notice.summaryKey)}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsNotificationCentreOpen(true)}
              style={{
                width: '100%',
                marginTop: '1rem',
                minHeight: '2.75rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--ks-color-civic-blue, #1e3a8a)',
                borderRadius: '0.375rem',
                color: 'var(--ks-color-civic-blue, #1e3a8a)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              {t('notifications.unreadCount', { count: activeNotices.length })} →
            </button>
          </section>
        </aside>
      </div>

      {/* 4. Sticky Bottom Bundle Application Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderRadius: '0.75rem',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          zIndex: 100,
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--ks-color-text, #0f172a)' }}>
            {selectedOfferings.size} program(s) selected
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            Single unified submission with verified digital pre-fill
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={selectedOfferings.size === 0}
          onClick={() => onProceedToBundle(Array.from(selectedOfferings))}
        >
          {t('dashboard.applySelected')}
        </Button>
      </div>

      {/* 5. Notification Centre Modal */}
      <NotificationCentre
        isOpen={isNotificationCentreOpen}
        onClose={() => setIsNotificationCentreOpen(false)}
        notices={vm.notices}
        locale={locale}
        onActionClick={(notice) => {
          setIsNotificationCentreOpen(false);
          if (onOpenNotice) onOpenNotice(notice);
        }}
      />
    </div>
  );
}

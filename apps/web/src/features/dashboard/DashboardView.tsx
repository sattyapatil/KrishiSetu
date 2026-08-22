import React, { useState } from 'react';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { Button, DataCard, Card, StatusBadge } from '@krishisetu/design-system';

export interface DashboardViewProps {
  readonly locale: Locale;
  readonly onProceedToBundle: (selectedOfferings: string[]) => void;
}

export function DashboardView({
  locale,
  onProceedToBundle,
}: DashboardViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const [selectedOfferings, setSelectedOfferings] = useState<Set<string>>(
    new Set(['offering_drip_2026', 'offering_kcc_2026'])
  );

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

  return (
    <div>
      {/* 1. Farmer Identity Header Summary */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1.25rem',
          backgroundColor: '#ffffff',
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
            {locale === 'mr' ? 'नामदेव तुकाराम शिंदे' : locale === 'hi' ? 'नामदेव तुकाराम शिंदे' : locale === 'kn' ? 'ನಾಮದೇವ ತುಕಾರಾಮ ಶಿಂಧೆ' : 'Namdev Tukaram Shinde'}
          </h1>
          <p style={{ margin: 0, color: 'var(--ks-color-text-muted, #475569)', fontSize: '0.875rem' }}>
            {t('land.village')}: {locale === 'mr' ? 'पाषाण' : locale === 'hi' ? 'पाषाण' : locale === 'kn' ? 'ಪಾಶಾಣ' : 'Pashan'} • {t('auth.farmerIdLabel')}: ••••••••••0001
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <StatusBadge status="ready" label={t('common.verified')} />
          <StatusBadge status="mockResult" label="Prototype" />
        </div>
      </div>

      {/* 2. Source Integration Status Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ks-color-text-muted, #475569)' }}>
          {t('dashboard.overallStatus')}:
        </span>
        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '0.25rem', border: '1px solid #86efac' }}>
          Mahabhumi 7/12 (22ms)
        </span>
        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '0.25rem', border: '1px solid #86efac' }}>
          Crop Registry (18ms)
        </span>
        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '0.25rem', border: '1px solid #86efac' }}>
          MahaDBT (31ms)
        </span>
        {uliStatus === 'OK' ? (
          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '0.25rem', border: '1px solid #86efac' }}>
            ULI Credit (36ms)
          </span>
        ) : (
          <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#fef3c7', color: '#78350f', borderRadius: '0.25rem', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            ULI Credit (Timeout)
            <button type="button" onClick={handleRefreshUli} style={{ border: 'none', background: 'transparent', textDecoration: 'underline', color: '#78350f', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
              {isRefreshingUli ? '...' : t('common.retry')}
            </button>
          </span>
        )}
      </div>

      {/* 3. Grid of Progressive Disclosure Data Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        {/* Land Data Card */}
        <DataCard
          id="card-land"
          eyebrow={t('land.eyebrow')}
          title={t('land.cardTitle')}
          primaryValue="0.675"
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
              <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.allocatedShare')}:</strong> 0.6750 ha</p>
              <p style={{ margin: '0 0 0.25rem 0' }}><strong>{t('land.encumbrance')}:</strong> {t('land.encumbrancePresent')}</p>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ks-color-text-muted, #475569)' }}>{t('land.sourceMahabhumi')}</p>
            </div>
          }
        />

        {/* Crops Data Card */}
        <DataCard
          id="card-crops"
          eyebrow={t('crops.eyebrow')}
          title={t('crops.cardTitle')}
          primaryValue="0.675"
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

        {/* Bank Direct Benefit Card */}
        <DataCard
          id="card-bank"
          eyebrow={t('dashboard.bankSummary')}
          title={t('credit.bankReadiness')}
          primaryValue="••••4812"
          unit="Bank of Maharashtra"
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

      {/* 4. Eligible Offerings & Bundle Selection Section */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)', marginBottom: '0.5rem' }}>
        {t('dashboard.selectOfferings')}
      </h2>
      <p style={{ color: 'var(--ks-color-text-muted, #475569)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        {t('dashboard.schemesSummary')} & {t('dashboard.creditSummary')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* MahaDBT Drip Subsidy Offering */}
        <Card
          id="offering-drip"
          title={t('schemes.dripTitle')}
          subtitle={t('schemes.dripDesc')}
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedOfferings.has('offering_drip_2026')}
                  onChange={() => toggleOffering('offering_drip_2026')}
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
              {formatCurrencyFromPaise(4800000, locale)}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              {t('schemes.estimatedBenefit')} (80% subsidy based on 0.675 ha cultivable share)
            </p>
          </div>
          <ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)' }}>
            <li>{t('schemes.reasonCultivableShare')}</li>
            <li>{t('schemes.reasonActiveCrop')}</li>
            <li>{t('schemes.reasonNoDuplicate')}</li>
          </ul>
        </Card>

        {/* ULI KCC Crop Loan Offering */}
        <Card
          id="offering-kcc"
          title={t('credit.cardTitle')}
          subtitle={t('credit.summary')}
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedOfferings.has('offering_kcc_2026')}
                  onChange={() => toggleOffering('offering_kcc_2026')}
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
              {formatCurrencyFromPaise(15750000, locale)}
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              {t('credit.estimatedLimit')} • {t('credit.interestSubvention')}
            </p>
          </div>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', fontStyle: 'italic' }}>
            {t('credit.mockEstimateOnly')}
          </p>
        </Card>
      </div>

      {/* 5. Bottom Application Bundle CTA */}
      <div
        style={{
          position: 'sticky',
          bottom: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
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
    </div>
  );
}

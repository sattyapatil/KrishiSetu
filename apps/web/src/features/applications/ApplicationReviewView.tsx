'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Locale, translate, formatCurrencyFromPaise, formatHectares } from '@krishisetu/i18n';
import { Card, Button, StatusBadge } from '@krishisetu/design-system';
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';
import { getSchemeById } from '../schemes/fixtures.js';
import { getDashboardViewModel } from '../dashboard/fixtures/dashboard-fixture.js';

export interface ApplicationReviewViewProps {
  readonly locale: Locale;
}

export function ApplicationReviewView({ locale }: ApplicationReviewViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const router = useRouter();
  const { session, selectedOfferings } = useJourney();

  const farmerId = session?.farmerId || '27202600000001';
  const vm = getDashboardViewModel(farmerId);
  const selectedList = Array.from(selectedOfferings)
    .map((id) => getSchemeById(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  if (selectedList.length === 0) {
    return (
      <div style={{ maxWidth: '44rem', margin: '2rem auto' }}>
        <Card
          title={t('applications.emptyTitle')}
          subtitle={t('schemes.pageTitle')}
          footerSlot={
            <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg">
                {t('schemes.pageTitle')}
              </Button>
            </Link>
          }
        >
          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            Please select at least one scheme or credit offering to review your application.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '48rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/schemes`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeftIcon size={16} aria-hidden={true} />
          <span>{t('schemes.backToSchemes')}</span>
        </Link>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.375rem 0',
          }}
        >
          {t('applications.newReviewTitle')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('applications.newReviewSubtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* 1. Selected Offerings Section */}
        <Card
          title={t('applications.selectedServicesTitle', { count: selectedList.length })}
          subtitle="Unified multi-scheme bundle"
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                href={`/${locale}/schemes`}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                  textDecoration: 'underline',
                }}
              >
                {t('applications.changeSection')}
              </Link>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedList.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--ks-color-border, #cbd5e1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                    {t(item.titleKey)}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {item.providerName}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                    {formatCurrencyFromPaise(item.estimatedBenefitPaise, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 2. Farmer Profile Section */}
        <Card
          title={t('applications.farmerDetailsTitle')}
          subtitle="Applicant Information"
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              <span>Source: Synthetic Identity Registry</span>
              <StatusBadge status="ready" label={t('common.verified')} />
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.75rem', fontSize: '0.9375rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Farmer Name</span>
              <strong>{vm.farmer.name}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Village & Taluka</span>
              <strong>{vm.farmer.villageKey}, Haveli</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Farmer ID</span>
              <strong>••••••••••{vm.farmer.id.slice(-4)}</strong>
            </div>
          </div>
        </Card>

        {/* 3. Land & Crops Prefill Section */}
        <Card
          title={t('applications.landDetailsTitle')}
          subtitle="Verified Agricultural Holdings"
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              <span>Source: Mahabhumi 7/12 & Digital Crop Survey</span>
              <StatusBadge status="ready" label={t('common.verified')} />
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.75rem', fontSize: '0.9375rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Cultivable Area</span>
              <strong>{formatHectares(vm.farmer.landHoldingsHectares, locale)}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Survey / Plot No.</span>
              <strong>Survey 123/1A (50% Joint Share)</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Active Crops</span>
              <strong>Soybean (0.40 Ha), Tur (0.27 Ha)</strong>
            </div>
          </div>
        </Card>

        {/* 4. Bank Mapping Section */}
        <Card
          title={t('applications.bankDetailsTitle')}
          subtitle="Direct Benefit Transfer & Loan Account"
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              <span>Source: NPCI / Bank of Maharashtra (Simulated)</span>
              <StatusBadge status="ready" label="Aadhaar Mapped" />
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '0.75rem', fontSize: '0.9375rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Bank Name</span>
              <strong>{vm.farmer.bankName}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Account</span>
              <strong>{vm.farmer.maskedAccount}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)', display: 'block' }}>Branch IFSC</span>
              <strong>MAHB0000123</strong>
            </div>
          </div>
        </Card>

        {/* Continue to Declaration CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg">
              {t('common.back')}
            </Button>
          </Link>

          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(`/${locale}/applications/new/declare`)}
          >
            <span>{t('common.continue')}</span>
            <ArrowRightIcon size={18} aria-hidden={true} />
          </Button>
        </div>
      </div>
    </div>
  );
}

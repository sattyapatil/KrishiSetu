'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, StatusBadge } from '@krishisetu/design-system';
import { ArrowRightIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';

export interface ApplicationsListViewProps {
  readonly locale: Locale;
}

type FilterStatus = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'ACTION_REQUIRED';

export function ApplicationsListView({ locale }: ApplicationsListViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { adapter } = useJourney();

  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const allBundles = adapter.listBundles();

  const filteredBundles = allBundles.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    if (filter === 'ACTION_REQUIRED') return b.status === 'PARTIAL' || b.status === 'FAILED_RETRYABLE';
    if (filter === 'ACTIVE') return b.status === 'PARTIAL' || b.status === 'COMPLETED';
    return true;
  });

  return (
    <div style={{ maxWidth: '48rem', margin: '1rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
              margin: '0 0 0.25rem 0',
            }}
          >
            {t('applications.title')}
          </h1>
          <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
            {t('applications.subtitle')}
          </p>
        </div>

        <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md">
            {t('applications.startNewApplication')}
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter Applications by Status"
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {(
          [
            { id: 'ALL', label: t('applications.filterAll') },
            { id: 'ACTIVE', label: t('applications.filterActive') },
            { id: 'COMPLETED', label: t('applications.filterCompleted') },
            { id: 'ACTION_REQUIRED', label: t('applications.filterActionRequired') },
          ] as const
        ).map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                minHeight: '2.5rem',
                padding: '0.375rem 0.875rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: isSelected
                  ? 'var(--ks-color-civic-blue, #1e3a8a)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--ks-color-surface-card, #ffffff)'
                  : 'var(--ks-color-text, #0f172a)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bundle Cards List or Empty State */}
      {filteredBundles.length === 0 ? (
        <Card title={t('applications.emptyTitle')}>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--ks-color-text-muted, #475569)', fontSize: '0.9375rem' }}>
            {t('applications.emptyDesc')}
          </p>
          <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              {t('applications.startNewApplication')}
            </Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredBundles.map((bundle) => {
            const isCompleted = bundle.status === 'COMPLETED';
            return (
              <Card
                key={bundle.bundleId}
                title={`${t('applications.bundleId')}: ${bundle.bundleId}`}
                subtitle={`${t('applications.submittedAt')}: ${bundle.submittedAt}`}
                footerSlot={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                      {bundle.children.length} {t('applications.selectedServicesTitle', { count: bundle.children.length })}
                    </span>
                    <Link
                      href={`/${locale}/applications/${bundle.bundleId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.875rem',
                        color: 'var(--ks-color-civic-blue, #1e3a8a)',
                        fontWeight: 600,
                        textDecoration: 'underline',
                      }}
                    >
                      <span>{t('applications.viewBundleDetails')}</span>
                      <ArrowRightIcon size={16} aria-hidden={true} />
                    </Link>
                  </div>
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <StatusBadge
                    status={isCompleted ? 'ready' : 'needsAction'}
                    label={isCompleted ? t('applications.statusCompleted') : t('applications.statusPartial')}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                    {bundle.idempotencyKey}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                  {bundle.children.map((c) => (
                    <div key={c.childId} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                      <span>{c.domain === 'MAHADBT' ? t('applications.childMahaDbtTitle') : t('applications.childUliTitle')}</span>
                      <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{c.providerReceipt || c.errorCode || 'PENDING'}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

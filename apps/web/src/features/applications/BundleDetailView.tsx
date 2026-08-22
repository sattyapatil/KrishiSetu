'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { ApplicationBundle } from '@krishisetu/applications';
import { Card, Button, StatusBadge, Alert } from '@krishisetu/design-system';
import { ArrowLeftIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';

export interface BundleDetailViewProps {
  readonly locale: Locale;
  readonly bundle: ApplicationBundle;
}

export function BundleDetailView({
  locale,
  bundle: initialBundle,
}: BundleDetailViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { retryChild } = useJourney();

  const [bundle, setBundle] = useState<ApplicationBundle>(initialBundle);
  const [retryingChildId, setRetryingChildId] = useState<string | null>(null);

  const handleRetry = async (childId: string) => {
    setRetryingChildId(childId);
    const result = await retryChild(bundle.bundleId, childId);
    setRetryingChildId(null);
    if (result.success && result.bundle) {
      setBundle(result.bundle);
    }
  };

  const isCompleted = bundle.status === 'COMPLETED';

  return (
    <div style={{ maxWidth: '48rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/applications`}
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
          <span>{t('applications.backToApplications')}</span>
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
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
            <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '0.875rem' }}>
              {t('applications.bundleId')}: <strong>{bundle.bundleId}</strong> • {t('applications.submittedAt')}: {bundle.submittedAt}
            </p>
          </div>

          <StatusBadge
            status={isCompleted ? 'ready' : 'needsAction'}
            label={isCompleted ? t('applications.statusCompleted') : t('applications.statusPartial')}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Prototype Statement Banner */}
        <Alert variant={isCompleted ? 'success' : 'warning'} title={isCompleted ? 'Unified Submission Processed' : 'Action Required on Simulated Submission'}>
          {t('applications.declarationPrototype')}
        </Alert>

        {/* List of Child Applications */}
        {bundle.children.map((child) => {
          const isChildAccepted = child.status === 'ACCEPTED_MOCK';
          const isRetrying = retryingChildId === child.childId;

          return (
            <Card
              key={child.childId}
              title={
                child.domain === 'MAHADBT'
                  ? t('applications.childMahaDbtTitle')
                  : t('applications.childUliTitle')
              }
              subtitle={
                child.domain === 'MAHADBT'
                  ? 'Mock agricultural benefits adapter'
                  : 'Mock ULI lending adapter'
              }
              footerSlot={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <Link
                    href={`/${locale}/applications/${bundle.bundleId}/${child.childId}`}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--ks-color-civic-blue, #1e3a8a)',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    {t('applications.viewChildDetails')}
                  </Link>

                  {child.retryable && (
                    <Button
                      variant="primary"
                      size="md"
                      isLoading={isRetrying}
                      onClick={() => handleRetry(child.childId)}
                    >
                      {t('applications.retryFailed')}
                    </Button>
                  )}
                </div>
              }
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>
                  <strong>{t('applications.providerReceipt')}:</strong>{' '}
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {child.providerReceipt || child.errorCode || 'PENDING'}
                  </span>
                </span>
                <StatusBadge
                  status={isChildAccepted ? 'ready' : 'needsAction'}
                  label={isChildAccepted ? t('applications.childStatusAccepted') : t('applications.childStatusFailed')}
                />
              </div>

              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)' }}>
                <strong>{t('applications.nextSteps')}:</strong>{' '}
                {isChildAccepted
                  ? child.domain === 'MAHADBT'
                    ? 'Application queued for taluka-level administrative lottery and verification.'
                    : 'Pre-application received by participating lending bank. Branch field officer contact simulated.'
                  : 'Simulated lending partner connection timed out. Please retry submission.'}
              </p>
            </Card>
          );
        })}

        {/* Global Return Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href={`/${locale}/applications`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg">
              {t('applications.backToApplications')}
            </Button>
          </Link>

          <Link href={`/${locale}/dashboard`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              {t('navigation.dashboard')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

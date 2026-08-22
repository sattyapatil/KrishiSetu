'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { ApplicationBundle, ChildApplicationReceipt } from '@krishisetu/applications';
import { Card, Button, StatusBadge } from '@krishisetu/design-system';
import { ArrowLeftIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';

export interface ChildDetailViewProps {
  readonly locale: Locale;
  readonly bundle: ApplicationBundle;
  readonly child: ChildApplicationReceipt;
}

export function ChildDetailView({
  locale,
  bundle,
  child: initialChild,
}: ChildDetailViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const { retryChild } = useJourney();

  const [child, setChild] = useState<ChildApplicationReceipt>(initialChild);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    const result = await retryChild(bundle.bundleId, child.childId);
    setIsRetrying(false);
    if (result.success && result.bundle) {
      const updated = result.bundle.children.find((c) => c.childId === child.childId);
      if (updated) {
        setChild(updated);
      }
    }
  };

  const isAccepted = child.status === 'ACCEPTED_MOCK';

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/applications/${bundle.bundleId}`}
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
          <span>{t('applications.viewBundleDetails')} ({bundle.bundleId})</span>
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
              {child.domain === 'MAHADBT'
                ? t('applications.childMahaDbtTitle')
                : t('applications.childUliTitle')}
            </h1>
            <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '0.875rem' }}>
              Child ID: <strong>{child.childId}</strong> • Scheme Code: {child.schemeCode}
            </p>
          </div>

          <StatusBadge
            status={isAccepted ? 'ready' : 'needsAction'}
            label={isAccepted ? t('applications.childStatusAccepted') : t('applications.childStatusFailed')}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Receipt Details Card */}
        <Card
          title={t('applications.providerReceipt')}
          subtitle={
            child.domain === 'MAHADBT'
              ? 'MahaDBT Gateway (Simulated)'
              : 'ULI Lending Gateway (Simulated)'
          }
          footerSlot={
            child.retryable && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isRetrying}
                  onClick={handleRetry}
                >
                  {t('applications.retryFailed')}
                </Button>
              </div>
            )
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)' }}>Provider Reference No:</span>
              <strong style={{ fontFamily: 'monospace' }}>
                {child.providerReceipt || child.errorCode || 'N/A'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)' }}>Parent Bundle:</span>
              <span>{bundle.bundleId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--ks-color-text-muted, #475569)' }}>Submitted Timestamp:</span>
              <span>{bundle.submittedAt}</span>
            </div>
          </div>
        </Card>

        {/* Application Timeline */}
        <Card title={t('applications.timelineTitle')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--ks-color-agri-green, #166534)', color: 'var(--ks-color-surface-card, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                ✓
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem' }}>{t('applications.timelineSubmitted')}</strong>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>{bundle.submittedAt}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--ks-color-agri-green, #166534)', color: 'var(--ks-color-surface-card, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                ✓
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem' }}>{t('applications.timelineVerified')}</strong>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>Deterministic rule evaluation completed</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: isAccepted ? 'var(--ks-color-agri-green, #166534)' : 'var(--ks-color-error, #dc2626)', color: 'var(--ks-color-surface-card, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                {isAccepted ? '✓' : '!'}
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem' }}>
                  {isAccepted ? t('applications.timelineAccepted') : t('applications.timelineTimeout')}
                </strong>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                  {isAccepted
                    ? `Receipt: ${child.providerReceipt}`
                    : 'Simulated connection timed out. Please use Retry.'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card title={t('applications.nextSteps')}>
          <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--ks-color-text, #0f172a)' }}>
            {isAccepted
              ? child.domain === 'MAHADBT'
                ? 'Application queued for taluka-level administrative lottery and verification. You will receive an SMS alert upon approval.'
                : 'Pre-application received by participating lending bank. Branch field officer contact simulated within 2 working days.'
              : 'The simulated partner connection timed out. Please click "Retry Failed Submissions" above.'}
          </p>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href={`/${locale}/applications/${bundle.bundleId}`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg">
              {t('applications.viewBundleDetails')}
            </Button>
          </Link>

          <Link href={`/${locale}/applications`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              {t('applications.backToApplications')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

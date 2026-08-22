import React, { useState } from 'react';
import { Locale, translate, formatCurrencyFromPaise } from '@krishisetu/i18n';
import { Button, Card, StatusBadge, Alert } from '@krishisetu/design-system';

export interface ApplicationsViewProps {
  readonly locale: Locale;
  readonly onReturnToDashboard: () => void;
}

export function ApplicationsView({
  locale,
  onReturnToDashboard,
}: ApplicationsViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const [bundleStatus, setBundleStatus] = useState<'COMPLETED' | 'PARTIAL'>('COMPLETED');
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryChild = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setBundleStatus('COMPLETED');
      setIsRetrying(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)', margin: '0 0 0.25rem 0' }}>
            {t('applications.title')}
          </h1>
          <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '0.875rem' }}>
            {t('applications.bundleId')}: <strong>BND-2026-000081</strong> • {t('applications.submittedAt')}: 2026-08-22 09:04 IST
          </p>
        </div>
        <StatusBadge
          status={bundleStatus === 'COMPLETED' ? 'ready' : 'needsAction'}
          label={bundleStatus === 'COMPLETED' ? t('applications.statusCompleted') : t('applications.statusPartial')}
        />
      </div>

      <Alert variant="success" title="Unified Submission Processed">
        {t('applications.declarationPrototype')}
      </Alert>

      {/* Child 1: MahaDBT Micro-Irrigation */}
      <Card
        title={t('applications.childMahaDbtTitle')}
        subtitle="Mock agricultural benefits adapter"
        footerSlot={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <span><strong>{t('applications.providerReceipt')}:</strong> MOCK-MDBT-332101</span>
            <StatusBadge status="ready" label="ACCEPTED (MOCK)" />
          </div>
        }
      >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--ks-color-agri-green, #166534)' }}>
          Benefit: {formatCurrencyFromPaise(4800000, locale)} (Drip Irrigation 80% Subsidy)
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)' }}>
          <strong>{t('applications.nextSteps')}:</strong> Application queued for taluka-level administrative lottery and verification.
        </p>
      </Card>

      {/* Child 2: ULI Kisan Credit Card */}
      <Card
        title={t('applications.childUliTitle')}
        subtitle="Mock ULI lending adapter"
        footerSlot={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <span>
              <strong>{t('applications.providerReceipt')}:</strong>{' '}
              {bundleStatus === 'COMPLETED' ? 'MOCK-ULI-771902' : 'TIMEOUT_RETRYABLE'}
            </span>
            <StatusBadge
              status={bundleStatus === 'COMPLETED' ? 'ready' : 'needsAction'}
              label={bundleStatus === 'COMPLETED' ? 'ACCEPTED (MOCK)' : 'FAILED (RETRYABLE)'}
            />
          </div>
        }
      >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
          Indicative Limit: {formatCurrencyFromPaise(15750000, locale)} (KCC Crop Loan)
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text, #0f172a)' }}>
          <strong>{t('applications.nextSteps')}:</strong>{' '}
          {bundleStatus === 'COMPLETED'
            ? 'Pre-application received by participating lending bank. Branch field officer contact simulated.'
            : 'Simulated lending partner connection timed out. Please retry submission.'}
        </p>
      </Card>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        {bundleStatus === 'PARTIAL' && (
          <Button variant="primary" size="lg" isLoading={isRetrying} onClick={handleRetryChild}>
            {t('applications.retryFailed')}
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={onReturnToDashboard}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, Alert } from '@krishisetu/design-system';
import { useJourney } from '../journey/index.js';

export interface ApplicationSubmittingViewProps {
  readonly locale: Locale;
}

export function ApplicationSubmittingView({ locale }: ApplicationSubmittingViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const router = useRouter();
  const { submitBundle } = useJourney();

  const [statusText, setStatusText] = useState('Submitting to simulated departmental gateways...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    async function performSubmit() {
      try {
        const result = await submitBundle(true, ['SUBSIDY_APPLY', 'CREDIT_PREAPPLY']);
        if (result.success && result.bundle) {
          setStatusText('Submission completed. Redirecting to confirmation...');
          router.push(`/${locale}/applications/${result.bundle.bundleId}`);
        } else {
          setErrorMessage(result.errorMessageKey ? t(result.errorMessageKey) : 'Submission unavailable.');
        }
      } catch (err) {
        setErrorMessage('Unexpected error during prototype submission.');
      }
    }

    performSubmit();
  }, [submitBundle, router, locale, t]);

  return (
    <div style={{ maxWidth: '36rem', margin: '3rem auto', textAlign: 'center' }}>
      <Card title={t('applications.newSubmittingTitle')}>
        <div
          role="status"
          aria-live="polite"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1.5rem 0' }}
        >
          {!errorMessage ? (
            <>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  border: '4px solid var(--ks-color-border, #cbd5e1)',
                  borderTopColor: 'var(--ks-color-civic-blue, #1e3a8a)',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--ks-color-text, #0f172a)' }}>
                {statusText}
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
                {t('applications.newSubmittingSubtitle')}
              </p>
            </>
          ) : (
            <>
              <Alert variant="error" title="Submission Error">
                {errorMessage}
              </Alert>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  submittedRef.current = false;
                  setErrorMessage(null);
                  router.push(`/${locale}/applications/new/declare`);
                }}
              >
                {t('common.retry')}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

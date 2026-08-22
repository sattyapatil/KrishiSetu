'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Dialog, StatusBadge } from '@krishisetu/design-system';
import { useJourney } from '../journey/index.js';

export interface PrivacyViewProps {
  readonly locale: Locale;
}

export function PrivacyView({ locale }: PrivacyViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const router = useRouter();
  const {
    session,
    simulateWithdrawal,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
  } = useJourney();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const withdrawButtonRef = useRef<HTMLButtonElement>(null);

  const consentId = `CNS-2026-${(session?.farmerId || '27202600000001').slice(-4)}`;
  const hasActiveConsent = Boolean(session?.dashboardConsentGranted);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    withdrawButtonRef.current?.focus();
  };

  const handleConfirmPurge = async () => {
    const receipt = await simulateWithdrawal(consentId);
    setIsDialogOpen(false);
    router.push(`/${locale}/privacy/withdrawal/${receipt.receiptId}`);
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {t('privacy.title')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('privacy.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Active Consent Management Card */}
        <Card
          title={t('privacy.activeConsent')}
          subtitle={`Consent Reference: ${consentId}`}
          footerSlot={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link
                href={`/${locale}/privacy/consent`}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                {t('privacy.viewConsentDetails')}
              </Link>

              {hasActiveConsent && (
                <button
                  ref={withdrawButtonRef}
                  type="button"
                  onClick={handleOpenDialog}
                  style={{
                    minHeight: '2.5rem',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--ks-color-error, #dc2626)',
                    backgroundColor: 'transparent',
                    color: 'var(--ks-color-error-dark, #991b1b)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {t('privacy.withdrawConsent')}
                </button>
              )}
            </div>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>
                <strong>{t('privacy.grantedAt')}:</strong> {session?.sessionStartedAt || '2026-08-22 09:00:00 IST'}
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                <strong>{t('privacy.validUntil')}:</strong> 30 minutes duration (Demonstration Session)
              </p>
            </div>
            <StatusBadge status={hasActiveConsent ? 'ready' : 'needsAction'} label={hasActiveConsent ? 'GRANTED' : 'REVOKED'} />
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)', margin: 0 }}>
            {t('privacy.purgeNotice')}
          </p>
        </Card>

        {/* User Accessibility Preferences */}
        <Card title={t('privacy.preferences')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)' }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 600, display: 'block' }}>{t('privacy.highContrast')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>Enhanced borders and stark contrast tokens</span>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0' }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 600, display: 'block' }}>{t('privacy.reducedMotion')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--ks-color-text-muted, #475569)' }}>Disable transitions and animated spinners</span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              />
            </label>
          </div>
        </Card>
      </div>

      {/* Focus-Managed Confirmation Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={t('privacy.withdrawConsent')}
        confirmLabel={t('privacy.withdrawConsent')}
        cancelLabel={t('common.cancel')}
        isDestructive
        onConfirm={handleConfirmPurge}
      >
        <p style={{ margin: '0 0 0.75rem 0' }}>{t('privacy.withdrawConfirm')}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--ks-color-error-dark, #991b1b)', fontWeight: 600, margin: 0 }}>
          {t('privacy.purgeNotice')}
        </p>
      </Dialog>
    </div>
  );
}

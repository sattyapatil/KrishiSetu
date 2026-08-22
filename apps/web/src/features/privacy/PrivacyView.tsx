import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { Button, Card, Dialog, Alert, StatusBadge } from '@krishisetu/design-system';

export interface PrivacyViewProps {
  readonly locale: Locale;
  readonly onRevokeConsent: () => void;
}

export function PrivacyView({
  locale,
  onRevokeConsent,
}: PrivacyViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurged, setIsPurged] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleConfirmPurge = () => {
    setIsDialogOpen(false);
    setIsPurged(true);
    onRevokeConsent();
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)', marginBottom: '0.5rem' }}>
        {t('privacy.title')}
      </h1>
      <p style={{ color: 'var(--ks-color-text-muted, #475569)', marginBottom: '1.5rem', fontSize: '1rem' }}>
        {t('privacy.subtitle')}
      </p>

      {/* Purge Receipt Banner (shown after revocation) */}
      {isPurged && (
        <Alert variant="warning" title={t('consent.withdrawalReceipt')}>
          <p style={{ margin: '0 0 0.5rem 0' }}>{t('consent.withdrawalDetails')}</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Dashboard Caches Deleted: 1</li>
            <li>Normalized Snapshots Deleted: 4</li>
            <li>Draft Bundles Deleted: 0</li>
            <li>Receipts Pseudonymized: 2</li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', fontSize: '0.75rem' }}>
            {t('privacy.syntheticFixturesRetained')}
          </p>
        </Alert>
      )}

      {/* Active Consent Management */}
      <Card
        title={t('privacy.activeConsent')}
        subtitle="Consent UUID: 9b8763f1-5d07-4c58-9f51-c7eecdbbd103"
        footerSlot={
          !isPurged && (
            <Button
              variant="danger"
              size="md"
              onClick={() => setIsDialogOpen(true)}
            >
              {t('privacy.withdrawConsent')}
            </Button>
          )
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>
              <strong>{t('privacy.grantedAt')}:</strong> 2026-08-22 09:00:00 IST
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              <strong>{t('privacy.validUntil')}:</strong> 2026-08-22 09:30:00 IST (30 min validity)
            </p>
          </div>
          <StatusBadge status={isPurged ? 'error' : 'ready'} label={isPurged ? 'REVOKED' : 'GRANTED'} />
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)', margin: 0 }}>
          {t('privacy.purgeNotice')}
        </p>
      </Card>

      {/* User Accessibility Preferences */}
      <Card title={t('privacy.preferences')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{t('privacy.highContrast')}</span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              style={{ width: '1.25rem', height: '1.25rem' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{t('privacy.reducedMotion')}</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              style={{ width: '1.25rem', height: '1.25rem' }}
            />
          </label>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={t('privacy.withdrawConsent')}
        confirmLabel="Yes, Withdraw & Purge"
        cancelLabel={t('common.cancel')}
        isDestructive
        onConfirm={handleConfirmPurge}
      >
        <p>{t('privacy.withdrawConfirm')}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--ks-color-error-dark, #991b1b)', fontWeight: 600 }}>
          {t('privacy.purgeNotice')}
        </p>
      </Dialog>
    </div>
  );
}

import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { consentScopes } from '@krishisetu/policy';
import { Button, Card, Checkbox, Alert } from '@krishisetu/design-system';

export interface ConsentViewProps {
  readonly locale: Locale;
  readonly farmerName: string;
  readonly onGrantConsent: (grantedScopes: string[]) => void;
  readonly onDenyConsent: () => void;
}

export function ConsentView({
  locale,
  farmerName,
  onGrantConsent,
  onDenyConsent,
}: ConsentViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(
    new Set(Object.keys(consentScopes))
  );

  const toggleScope = (scopeKey: string) => {
    const next = new Set(selectedScopes);
    if (next.has(scopeKey)) {
      next.delete(scopeKey);
    } else {
      next.add(scopeKey);
    }
    setSelectedScopes(next);
  };

  const handleGrant = () => {
    onGrantConsent(Array.from(selectedScopes));
  };

  return (
    <div style={{ maxWidth: '40rem', margin: '1.5rem auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)', marginBottom: '0.5rem' }}>
        {t('consent.title')}
      </h1>
      <p style={{ color: 'var(--ks-color-text-muted, #475569)', marginBottom: '1.5rem', fontSize: '1rem' }}>
        {t('consent.subtitle')} ({farmerName})
      </p>

      <Card
        title={t('consent.purposeTitle')}
        subtitle={t('consent.purposeDesc')}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '1rem 0 0.5rem 0' }}>
          {t('consent.scopesTitle')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
          <Checkbox
            id="scope-identity"
            label={t('consent.scopes.identityRead.label')}
            description={t('consent.scopes.identityRead.description')}
            checked={selectedScopes.has('IDENTITY_READ')}
            onChange={() => toggleScope('IDENTITY_READ')}
          />
          <Checkbox
            id="scope-land"
            label={t('consent.scopes.landRead.label')}
            description={t('consent.scopes.landRead.description')}
            checked={selectedScopes.has('LAND_READ')}
            onChange={() => toggleScope('LAND_READ')}
          />
          <Checkbox
            id="scope-crop"
            label={t('consent.scopes.cropRead.label')}
            description={t('consent.scopes.cropRead.description')}
            checked={selectedScopes.has('CROP_READ')}
            onChange={() => toggleScope('CROP_READ')}
          />
          <Checkbox
            id="scope-bank"
            label={t('consent.scopes.bankStatusRead.label')}
            description={t('consent.scopes.bankStatusRead.description')}
            checked={selectedScopes.has('BANK_STATUS_READ')}
            onChange={() => toggleScope('BANK_STATUS_READ')}
          />
          <Checkbox
            id="scope-subsidy"
            label={t('consent.scopes.subsidyEligibilityRead.label')}
            description={t('consent.scopes.subsidyEligibilityRead.description')}
            checked={selectedScopes.has('SUBSIDY_ELIGIBILITY_READ')}
            onChange={() => toggleScope('SUBSIDY_ELIGIBILITY_READ')}
          />
          <Checkbox
            id="scope-credit"
            label={t('consent.scopes.creditRead.label')}
            description={t('consent.scopes.creditRead.description')}
            checked={selectedScopes.has('CREDIT_READ')}
            onChange={() => toggleScope('CREDIT_READ')}
          />
        </div>

        <Alert variant="info">
          {t('consent.validityNotice')}
        </Alert>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" onClick={handleGrant}>
            {t('consent.grantConsent')}
          </Button>
          <Button variant="outline" size="lg" onClick={onDenyConsent}>
            {t('consent.denyConsent')}
          </Button>
        </div>
      </Card>
    </div>
  );
}

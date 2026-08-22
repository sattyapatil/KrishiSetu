'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Button, Card, Checkbox, Alert, StatusBadge } from '@krishisetu/design-system';
import { useJourney } from '../journey/index.js';
import { consentPurposes } from '@krishisetu/policy';
import { LockIcon, UserIcon, SchemesIcon, InfoIcon } from '../../components/icons.js';

export interface ConsentViewProps {
  readonly locale: Locale;
  readonly farmerName?: string;
  readonly onGrantConsent: (grantedScopes: string[]) => void;
  readonly onDenyConsent: () => void;
}

export function ConsentView({
  locale,
  farmerName = 'Namdev Tukaram Shinde',
  onGrantConsent,
  onDenyConsent,
}: ConsentViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const { grantDashboardConsent } = useJourney();

  const requiredDashboardScopes = consentPurposes.DASHBOARD_VIEW.requiredScopes;
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(
    new Set(requiredDashboardScopes)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleScope = (scopeKey: string) => {
    if (requiredDashboardScopes.includes(scopeKey as never)) {
      return;
    }
    setSelectedScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scopeKey)) {
        next.delete(scopeKey);
      } else {
        next.add(scopeKey);
      }
      return next;
    });
  };

  const handleGrant = async () => {
    setIsSubmitting(true);
    const scopes = Array.from(selectedScopes);
    await grantDashboardConsent(scopes);
    setIsSubmitting(false);
    onGrantConsent(scopes);
  };

  return (
    <div style={{ maxWidth: '48rem', margin: '2rem auto' }}>

      {/* Trust Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: 'var(--ks-color-civic-blue-light, #dbeafe)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
          <LockIcon size={32} aria-hidden={true} />
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {t('consent.title')}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <UserIcon size={16} aria-hidden={true} className="ks-text-muted" />
          <p style={{ color: 'var(--ks-color-text, #0f172a)', margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
            {farmerName}
          </p>
        </div>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
          {t('consent.subtitle')}
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Alert variant="info" title={t('consent.purposeTitle')}>
          {t('consent.purposeDesc')}
        </Alert>
      </div>

      <Card
        footerSlot={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button
                variant="outline"
                size="lg"
                onClick={onDenyConsent}
              >
                {t('consent.denyConsent')}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleGrant}
                isLoading={isSubmitting}
              >
                {t('consent.grantConsent')}
              </Button>
            </div>
            <div style={{ textAlign: 'center', borderTop: '1px solid var(--ks-color-border, #cbd5e1)', paddingTop: '1rem' }}>
              <Link
                href={`/${locale}/privacy`}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--ks-color-civic-blue, #1e3a8a)',
                  textDecoration: 'underline',
                }}
              >
                {t('navigation.privacy')}
              </Link>
            </div>
          </div>
        }
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)', margin: '0 0 0.25rem 0' }}>
            {t('consent.scopesTitle')}
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
            Review and select the agricultural registries you authorize KrishiSetu to access for pre-qualification.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Required Scopes Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--ks-color-border, #cbd5e1)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
                Required Authorizations
              </span>
              <StatusBadge status="ready" label="Mandatory for Dashboard" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Identity Scope */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: 'var(--ks-color-surface-page, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--ks-color-border, #cbd5e1)' }}>
                <div style={{ color: 'var(--ks-color-civic-blue, #1e3a8a)', paddingTop: '0.125rem' }}><UserIcon size={20} aria-hidden={true} /></div>
                <div style={{ flex: 1 }}>
                  <Checkbox
                    id="scope-identity"
                    label={t('consent.scopes.identityRead.label')}
                    description={t('consent.scopes.identityRead.description')}
                    checked={selectedScopes.has('IDENTITY_READ')}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div style={{ color: 'var(--ks-color-success, #15803d)' }}><LockIcon size={20} aria-hidden={true} /></div>
              </div>

              {/* Land Scope */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: 'var(--ks-color-surface-page, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--ks-color-border, #cbd5e1)' }}>
                <div style={{ color: 'var(--ks-color-agri-green, #166534)', paddingTop: '0.125rem' }}><SchemesIcon size={20} aria-hidden={true} /></div>
                <div style={{ flex: 1 }}>
                  <Checkbox
                    id="scope-land"
                    label={t('consent.scopes.landRead.label')}
                    description={t('consent.scopes.landRead.description')}
                    checked={selectedScopes.has('LAND_READ')}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div style={{ color: 'var(--ks-color-success, #15803d)' }}><LockIcon size={20} aria-hidden={true} /></div>
              </div>
            </div>
          </div>

          {/* Optional Scopes Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ks-color-text, #0f172a)' }}>
                {t('consent.scopesTitle')}
              </span>
              <StatusBadge status="ready" label="Required" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.2s', backgroundColor: selectedScopes.has('CROP_READ') ? 'var(--ks-color-success-surface, #f0fdf4)' : 'transparent', border: selectedScopes.has('CROP_READ') ? '1px solid var(--ks-color-success-border, #86efac)' : '1px solid transparent' }}>
                <Checkbox
                  id="scope-crop"
                  label={t('consent.scopes.cropRead.label')}
                  description={t('consent.scopes.cropRead.description')}
                  checked={selectedScopes.has('CROP_READ')}
                  disabled
                  onChange={() => toggleScope('CROP_READ')}
                />
              </div>

              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.2s', backgroundColor: selectedScopes.has('BANK_STATUS_READ') ? 'var(--ks-color-success-surface, #f0fdf4)' : 'transparent', border: selectedScopes.has('BANK_STATUS_READ') ? '1px solid var(--ks-color-success-border, #86efac)' : '1px solid transparent' }}>
                <Checkbox
                  id="scope-bank"
                  label={t('consent.scopes.bankStatusRead.label')}
                  description={t('consent.scopes.bankStatusRead.description')}
                  checked={selectedScopes.has('BANK_STATUS_READ')}
                  disabled
                  onChange={() => toggleScope('BANK_STATUS_READ')}
                />
              </div>

              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.2s', backgroundColor: selectedScopes.has('SUBSIDY_ELIGIBILITY_READ') ? 'var(--ks-color-success-surface, #f0fdf4)' : 'transparent', border: selectedScopes.has('SUBSIDY_ELIGIBILITY_READ') ? '1px solid var(--ks-color-success-border, #86efac)' : '1px solid transparent' }}>
                <Checkbox
                  id="scope-subsidy"
                  label={t('consent.scopes.subsidyEligibilityRead.label')}
                  description={t('consent.scopes.subsidyEligibilityRead.description')}
                  checked={selectedScopes.has('SUBSIDY_ELIGIBILITY_READ')}
                  disabled
                  onChange={() => toggleScope('SUBSIDY_ELIGIBILITY_READ')}
                />
              </div>

              <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.2s', backgroundColor: selectedScopes.has('CREDIT_READ') ? 'var(--ks-color-success-surface, #f0fdf4)' : 'transparent', border: selectedScopes.has('CREDIT_READ') ? '1px solid var(--ks-color-success-border, #86efac)' : '1px solid transparent' }}>
                <Checkbox
                  id="scope-credit"
                  label={t('consent.scopes.creditRead.label')}
                  description={t('consent.scopes.creditRead.description')}
                  checked={selectedScopes.has('CREDIT_READ')}
                  disabled
                  onChange={() => toggleScope('CREDIT_READ')}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--ks-color-surface-page, #f8fafc)', borderRadius: '0.5rem' }}>
          <div style={{ color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
            <InfoIcon size={20} aria-hidden={true} />
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)', lineHeight: 1.5 }}>
            {t('consent.validityNotice')}
          </p>
        </div>
      </Card>
    </div>
  );
}

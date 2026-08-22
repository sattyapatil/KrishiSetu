'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Locale, translate } from '@krishisetu/i18n';
import { Card, Button, Checkbox, Alert } from '@krishisetu/design-system';
import { ArrowLeftIcon, ArrowRightIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';

export interface ApplicationDeclareViewProps {
  readonly locale: Locale;
}

export function ApplicationDeclareView({ locale }: ApplicationDeclareViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const router = useRouter();
  const { selectedOfferings } = useJourney();

  // Declaration checkboxes and optional scopes start UNCHECKED!
  const [declarationAcknowledge, setDeclarationAcknowledge] = useState(false);
  const [prototypeAcknowledge, setPrototypeAcknowledge] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(new Set());

  const count = selectedOfferings.size;

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) {
        next.delete(scope);
      } else {
        next.add(scope);
      }
      return next;
    });
  };

  const isFormValid = declarationAcknowledge && prototypeAcknowledge && count > 0;

  const handleProceedToSubmit = () => {
    if (!isFormValid) return;
    router.push(`/${locale}/applications/new/submitting`);
  };

  return (
    <div style={{ maxWidth: '44rem', margin: '1rem auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href={`/${locale}/applications/new/review`}
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
          <span>{t('applications.reviewTitle')}</span>
        </Link>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: '0 0 0.375rem 0',
          }}
        >
          {t('applications.newDeclareTitle')}
        </h1>
        <p style={{ color: 'var(--ks-color-text-muted, #475569)', margin: 0, fontSize: '1rem' }}>
          {t('applications.newDeclareSubtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Alert variant="warning" title={t('applications.simulationNotice')}>
          {t('applications.declarationPrototype')}
        </Alert>

        {/* Application-Purpose Scopes */}
        <Card
          title="Application-Purpose Consent Scopes"
          subtitle="Specific authorization to dispatch pre-filled applications to respective simulated departments"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Checkbox
              id="scope-subsidy-apply"
              label={t('consent.scopes.subsidyApply.label')}
              description={t('consent.scopes.subsidyApply.description')}
              checked={selectedScopes.has('SUBSIDY_APPLY')}
              onChange={() => toggleScope('SUBSIDY_APPLY')}
            />
            <Checkbox
              id="scope-credit-preapply"
              label={t('consent.scopes.creditPreapply.label')}
              description={t('consent.scopes.creditPreapply.description')}
              checked={selectedScopes.has('CREDIT_PREAPPLY')}
              onChange={() => toggleScope('CREDIT_PREAPPLY')}
            />
          </div>
        </Card>

        {/* Farmer Declaration Checkboxes */}
        <Card title="Affirmative Self-Declaration">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Checkbox
              id="declaration-ack"
              label={t('applications.declarationAcknowledge')}
              checked={declarationAcknowledge}
              onChange={() => setDeclarationAcknowledge(!declarationAcknowledge)}
            />
            <Checkbox
              id="declaration-proto-ack"
              label={t('applications.declarationPrototypeAck')}
              checked={prototypeAcknowledge}
              onChange={() => setPrototypeAcknowledge(!prototypeAcknowledge)}
            />
          </div>
        </Card>

        {/* Final Submission Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href={`/${locale}/applications/new/review`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg">
              {t('common.back')}
            </Button>
          </Link>

          <Button
            variant="primary"
            size="lg"
            disabled={!isFormValid}
            onClick={handleProceedToSubmit}
          >
            <span>{t('applications.submitButton', { count })}</span>
            <ArrowRightIcon size={18} aria-hidden={true} />
          </Button>
        </div>
      </div>
    </div>
  );
}

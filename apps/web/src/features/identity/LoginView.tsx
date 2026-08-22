'use client';

import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { Button, TextInput, Select, Alert } from '@krishisetu/design-system';
import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';
import { useJourney } from '../journey/index.js';
import { LockIcon, UserIcon, CheckIcon } from '../../components/icons.js';

export interface LoginViewProps {
  readonly locale: Locale;
  readonly onLoginSuccess: (farmerId: string) => void;
}

export function LoginView({
  locale,
  onLoginSuccess,
}: LoginViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const { startSession } = useJourney();

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(
    SYNTHETIC_DEMO_FARMERS[0]?.farmerId || '27202600000001'
  );
  const [demoPin, setDemoPin] = useState('2468');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const personaOptions = SYNTHETIC_DEMO_FARMERS.map((f) => ({
    value: f.farmerId,
    label: `${f.name[locale] || f.name.en} (${f.village[locale] || f.village.en} - ${f.farmerId.slice(-4)})`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const result = await startSession(selectedFarmerId, demoPin);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(t('errors.identity.invalidPin'));
      return;
    }

    onLoginSuccess(selectedFarmerId);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: 'var(--ks-content-max, 75rem)',
          margin: '0 auto',
        }}
      >
      {/* Left Column: Hero & Value Proposition */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--ks-color-civic-blue, #1e3a8a)',
          color: 'var(--ks-color-surface-card, #ffffff)',
          borderRadius: '0.75rem',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--ks-shadow-card)',
        }}
      >
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            margin: '0 0 1rem 0',
          }}
        >
          {t('brand.name')}
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.9, margin: '0 0 2.5rem 0', lineHeight: 1.5 }}>
          {t('auth.subtitle')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem' }}>
              <LockIcon size={24} aria-hidden={true} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.25rem' }}>Secure & DPDP Compliant</strong>
              <span style={{ fontSize: '0.875rem', opacity: 0.85 }}>Simulated privacy-first architecture protecting your data footprint.</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem' }}>
              <UserIcon size={24} aria-hidden={true} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.25rem' }}>Unified Farmer Identity</strong>
              <span style={{ fontSize: '0.875rem', opacity: 0.85 }}>Single-sign-on integration across all state agricultural nodes.</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem' }}>
              <CheckIcon size={24} aria-hidden={true} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.25rem' }}>Single Window Access</strong>
              <span style={{ fontSize: '0.875rem', opacity: 0.85 }}>Apply for schemes, subsidies, and credit seamlessly.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
          borderRadius: '0.75rem',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--ks-shadow-card, 0 1px 2px rgb(15 23 42 / 0.08))',
        }}
      >
        <div style={{ maxWidth: '28rem', width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Alert variant="info" title="Demonstration Prototype">
              {t('auth.disclaimer')}
            </Alert>
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--ks-color-civic-blue, #1e3a8a)' }}>
              {t('auth.title')}
            </h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ks-color-text-muted, #475569)' }}>
              Please sign in to access your dashboard
            </p>
          </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <Select
                  id="demo-persona-select"
                  label={t('auth.selectDemoPersona')}
                  options={personaOptions}
                  value={selectedFarmerId}
                  onChange={(e) => {
                    setSelectedFarmerId(e.target.value);
                    setErrorMessage(null);
                  }}
                  helperText={t('auth.farmerIdHelp')}
                />

                <TextInput
                  id="farmer-id-input"
                  label={t('auth.farmerIdLabel')}
                  value={selectedFarmerId}
                  onChange={(e) => {
                    setSelectedFarmerId(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                />

                <TextInput
                  id="demo-pin-input"
                  type="password"
                  label={t('auth.demoPinLabel')}
                  value={demoPin}
                  onChange={(e) => {
                    setDemoPin(e.target.value);
                    setErrorMessage(null);
                  }}
                  helperText={t('auth.demoPinHelp')}
                  errorMessage={errorMessage || undefined}
                  required
                />

                <div style={{ marginTop: '0.5rem' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                  >
                    {t('auth.loginButton')}
                  </Button>
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
    </div>
  );
}

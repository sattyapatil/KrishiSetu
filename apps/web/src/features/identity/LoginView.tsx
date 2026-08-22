import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { Button, Card, TextInput, Select, Alert } from '@krishisetu/design-system';
import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';

export interface LoginViewProps {
  readonly locale: Locale;
  readonly onLoginSuccess: (farmerId: string) => void;
}

export function LoginView({
  locale,
  onLoginSuccess,
}: LoginViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(SYNTHETIC_DEMO_FARMERS[0]?.farmerId || '27202600000001');
  const [demoPin, setDemoPin] = useState('2468');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const personaOptions = SYNTHETIC_DEMO_FARMERS.map((f) => ({
    value: f.farmerId,
    label: `${f.name[locale] || f.name.en} (${f.village[locale] || f.village.en} - ${f.farmerId.slice(-4)})`,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      if (demoPin !== '2468') {
        setErrorMessage(t('errors.identity.invalidPin'));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      onLoginSuccess(selectedFarmerId);
    }, 400);
  };

  return (
    <div style={{ maxWidth: '32rem', margin: '2rem auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ks-color-civic-blue, #1e3a8a)', marginBottom: '0.5rem' }}>
        {t('auth.title')}
      </h1>
      <p style={{ color: 'var(--ks-color-text-muted, #475569)', marginBottom: '1.5rem', fontSize: '1rem' }}>
        {t('auth.subtitle')}
      </p>

      <Alert variant="info" title="Demonstration Prototype">
        {t('auth.disclaimer')}
      </Alert>

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <Select
            id="demo-persona-select"
            label={t('auth.selectDemoPersona')}
            options={personaOptions}
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
            helperText={t('auth.farmerIdHelp')}
          />

          <TextInput
            id="farmer-id-input"
            label={t('auth.farmerIdLabel')}
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
            required
          />

          <TextInput
            id="demo-pin-input"
            type="password"
            label={t('auth.demoPinLabel')}
            value={demoPin}
            onChange={(e) => setDemoPin(e.target.value)}
            helperText={t('auth.demoPinHelp')}
            errorMessage={errorMessage || undefined}
            required
          />

          <div style={{ marginTop: '1.5rem' }}>
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
        </form>
      </Card>
    </div>
  );
}

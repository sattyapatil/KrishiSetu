'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { Button, TextInput, Select } from '@krishisetu/design-system';
import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';
import { useJourney } from '../journey/index.js';
import { LockIcon, UserIcon, CheckIcon } from '../../components/icons.js';
import styles from './LoginView.module.css';

export interface LoginViewProps {
  readonly locale: Locale;
  readonly onLoginSuccess: (farmerId: string) => void;
}

export function LoginView({ locale, onLoginSuccess }: LoginViewProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const { startSession } = useJourney();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(
    SYNTHETIC_DEMO_FARMERS[0]?.farmerId || '27202600000001'
  );
  const [demoPin, setDemoPin] = useState('2468');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const personaOptions = SYNTHETIC_DEMO_FARMERS.map((farmer) => ({
    value: farmer.farmerId,
    label: `${farmer.name[locale] || farmer.name.en} (${farmer.village[locale] || farmer.village.en} · ${farmer.farmerId.slice(-4)})`,
  }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

  const benefits = [
    { id: 'privacy', Icon: LockIcon, title: t('auth.privacyBenefitTitle'), description: t('auth.privacyBenefitDescription') },
    { id: 'identity', Icon: UserIcon, title: t('auth.identityBenefitTitle'), description: t('auth.identityBenefitDescription') },
    { id: 'services', Icon: CheckIcon, title: t('auth.servicesBenefitTitle'), description: t('auth.servicesBenefitDescription') },
  ] as const;

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLayout}>
        <aside className={styles.valuePanel} aria-labelledby="login-value-title">
          <div>
            <p className={styles.panelEyebrow}>{t('auth.eyebrow')}</p>
            <h2 id="login-value-title" className={styles.valueTitle}>{t('auth.welcomeTitle')}</h2>
            <p className={styles.valueDescription}>{t('auth.subtitle')}</p>
          </div>

          <ul className={styles.benefitList}>
            {benefits.map(({ id, Icon, title, description }) => (
              <li key={id} className={styles.benefitItem}>
                <span className={styles.benefitIcon} aria-hidden="true"><Icon size={20} /></span>
                <span><strong>{title}</strong><span>{description}</span></span>
              </li>
            ))}
          </ul>
          <p className={styles.valueFootnote}>{t('auth.privacyNote')}</p>
        </aside>

        <section className={styles.formPanel} aria-labelledby="login-title">
          <div className={styles.formInner}>
            <div className={styles.prototypeNote} role="note">
              <span className={styles.prototypeIcon} aria-hidden="true">ℹ</span>
              <span><strong>{t('auth.prototypeLabel')}</strong><span>{t('auth.disclaimer')}</span></span>
            </div>

            <header className={styles.formHeader}>
              <p className={styles.formEyebrow}>{t('auth.eyebrow')}</p>
              <h1 id="login-title">{t('auth.title')}</h1>
              <p>{t('auth.signInDescription')}</p>
            </header>

            <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
              <Select
                id="demo-persona-select"
                label={t('auth.selectDemoPersona')}
                options={personaOptions}
                value={selectedFarmerId}
                onChange={(event) => { setSelectedFarmerId(event.target.value); setErrorMessage(null); }}
                helperText={t('auth.personaHelp')}
              />
              <TextInput
                id="farmer-id-input"
                label={t('auth.farmerIdLabel')}
                value={selectedFarmerId}
                onChange={(event) => { setSelectedFarmerId(event.target.value); setErrorMessage(null); }}
                inputMode="numeric"
                autoComplete="username"
                pattern="[0-9]{14}"
                maxLength={14}
                required
              />
              <TextInput
                id="demo-pin-input"
                type="password"
                label={t('auth.demoPinLabel')}
                value={demoPin}
                onChange={(event) => { setDemoPin(event.target.value); setErrorMessage(null); }}
                helperText={t('auth.demoPinHelp')}
                errorMessage={errorMessage || undefined}
                inputMode="numeric"
                autoComplete="current-password"
                maxLength={4}
                required
              />
              <Button type="submit" variant="primary" size="md" fullWidth isLoading={isLoading} loadingText={t('auth.signingIn')}>
                {t('auth.loginButton')}
              </Button>
            </form>

            <Link href={`/${locale}`} className={styles.backLink}>← {t('auth.backToPublicHome')}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

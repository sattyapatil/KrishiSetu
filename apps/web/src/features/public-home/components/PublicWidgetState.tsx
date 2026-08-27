import React from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import type { PublicWidgetStatus } from '../public-home.types.js';
import styles from '../PublicHomeView.module.css';

export interface PublicWidgetStateProps {
  readonly locale: Locale;
  readonly status: PublicWidgetStatus;
  readonly label: string;
  readonly children: React.ReactNode;
}

export function PublicWidgetState({
  locale,
  status,
  label,
  children,
}: PublicWidgetStateProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);

  if (status === 'UNAVAILABLE') {
    return (
      <div className={styles.widgetUnavailable} role="status" aria-live="polite">
        <strong>{label}</strong>
        <p>{t('publicHome.common.unavailableDataMessage')}</p>
      </div>
    );
  }

  return (
    <>
      {status === 'STALE' ? (
        <div className={styles.widgetStale} role="status">
          <span aria-hidden="true">⚠️</span>
          <span>{t('publicHome.common.staleDataMessage')}</span>
        </div>
      ) : null}
      {children}
    </>
  );
}

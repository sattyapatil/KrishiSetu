import React, { useEffect, useRef } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import { PublicNotice } from '@krishisetu/notifications';
import { PublicNoticeList } from './PublicNoticeList.js';

export interface NotificationCentreProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly notices: readonly PublicNotice[];
  readonly locale: Locale;
  readonly onActionClick?: (notice: PublicNotice) => void;
  readonly className?: string;
}

export function NotificationCentre({
  isOpen,
  onClose,
  notices,
  locale,
  onActionClick,
  className = '',
}: NotificationCentreProps): React.JSX.Element | null {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeCount = notices.filter((n) => n.status === 'ACTIVE').length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="ks-notification-centre-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 9999,
      }}
    >
      {/* Polite Live Region for screen readers */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        {t('notifications.unreadCount', { count: activeCount })}
      </div>

      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-centre-title"
        className={`ks-notification-centre ${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '42rem',
          maxHeight: '90vh',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderRadius: '0.75rem',
          border: '1px solid var(--ks-color-border, #cbd5e1)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h2
              id="notification-centre-title"
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--ks-color-civic-blue-dark, #172554)',
              }}
            >
              {t('notifications.centreTitle')}
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.125rem 0.5rem',
                backgroundColor: 'var(--ks-color-civic-blue-light, #dbeafe)',
                color: 'var(--ks-color-civic-blue, #1e3a8a)',
                borderRadius: '9999px',
                border: '1px solid var(--ks-color-info-border, #bfdbfe)',
              }}
            >
              {activeCount}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('notifications.actions.close')}
            style={{
              minWidth: '2.75rem',
              minHeight: '2.75rem',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--ks-color-border, #cbd5e1)',
              borderRadius: '0.375rem',
              color: 'var(--ks-color-text, #0f172a)',
              fontSize: '1.125rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </header>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          <PublicNoticeList
            notices={notices}
            locale={locale}
            onActionClick={onActionClick}
          />
        </div>
      </section>
    </div>
  );
}

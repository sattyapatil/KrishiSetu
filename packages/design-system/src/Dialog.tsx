import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

export interface DialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly confirmLabel?: string;
  readonly onConfirm?: () => void;
  readonly cancelLabel?: string;
  readonly isDestructive?: boolean;
  readonly className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  onConfirm,
  cancelLabel = 'Cancel',
  isDestructive = false,
  className = '',
}: DialogProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

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
      className="ks-dialog-backdrop"
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
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`ks-dialog ${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '32rem',
          backgroundColor: 'var(--ks-color-surface-card, #ffffff)',
          borderRadius: '0.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ks-color-border, #cbd5e1)' }}>
          <h2 id="dialog-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--ks-color-text, #0f172a)' }}>
            {title}
          </h2>
        </div>

        <div style={{ padding: '1.5rem', fontSize: '1rem', lineHeight: '1.5rem', color: 'var(--ks-color-text, #0f172a)' }}>
          {children}
        </div>

        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--ks-color-surface-page, #f8fafc)',
            borderTop: '1px solid var(--ks-color-border, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant={isDestructive ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

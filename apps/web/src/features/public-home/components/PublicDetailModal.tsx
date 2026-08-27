'use client';

import React from 'react';
import { Dialog } from '@krishisetu/design-system';
import type { ActiveDetailModalState } from '../public-home.types.js';

export interface PublicDetailModalProps {
  readonly modalState: ActiveDetailModalState | null;
  readonly onClose: () => void;
  readonly closeLabel?: string;
}

export function PublicDetailModal({
  modalState,
  onClose,
  closeLabel = 'Close',
}: PublicDetailModalProps): React.JSX.Element | null {
  if (!modalState || !modalState.type) {
    return null;
  }

  return (
    <Dialog
      isOpen={Boolean(modalState)}
      onClose={onClose}
      title={modalState.title}
      cancelLabel={closeLabel}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {modalState.subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--ks-color-civic-blue, #1e3a8a)',
            }}
          >
            {modalState.subtitle}
          </p>
        )}
        <div style={{ fontSize: '0.9375rem', lineHeight: 1.5, color: 'var(--ks-color-text, #0f172a)' }}>
          {modalState.content}
        </div>
      </div>
    </Dialog>
  );
}

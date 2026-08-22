import React from 'react';
import type { Locale } from '@krishisetu/i18n';
import { ApplicationReviewView } from './ApplicationReviewView.js';

export interface ApplicationDeclareViewProps {
  readonly locale: Locale;
}

export function ApplicationDeclareView({ locale }: ApplicationDeclareViewProps): React.JSX.Element {
  return <ApplicationReviewView locale={locale} />;
}

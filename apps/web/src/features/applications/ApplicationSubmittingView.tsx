import React from 'react';
import type { Locale } from '@krishisetu/i18n';
import { ApplicationReviewView } from './ApplicationReviewView.js';

export interface ApplicationSubmittingViewProps {
  readonly locale: Locale;
}

export function ApplicationSubmittingView({ locale }: ApplicationSubmittingViewProps): React.JSX.Element {
  return <ApplicationReviewView locale={locale} />;
}

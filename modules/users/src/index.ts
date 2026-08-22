import { Locale } from '@krishisetu/i18n';

export interface UserPreferences {
  readonly locale: Locale;
  readonly highContrast: boolean;
  readonly reducedMotion: boolean;
  readonly textScale: 'default' | 'large';
}

export interface UserProfile {
  readonly userId: string;
  readonly principalId: string;
  readonly preferences: UserPreferences;
}

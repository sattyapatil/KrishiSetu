export interface CreditOffering {
  readonly offeringId: string;
  readonly domain: 'ULI';
  readonly schemeCode: 'KCC_CROP_LOAN';
  readonly titleKey: string;
  readonly outcome: 'PREQUALIFIED_MOCK' | 'SOURCE_UNAVAILABLE';
  readonly estimatedLimitPaise: number;
  readonly reasonKeys: readonly string[];
  readonly requiredScopes: readonly string[];
  readonly selectable: boolean;
  readonly prototypeData: true;
}

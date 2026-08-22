export interface SchemeOffering {
  readonly offeringId: string;
  readonly domain: 'MAHADBT';
  readonly schemeCode: string;
  readonly titleKey: string;
  readonly outcome: 'LIKELY_ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  readonly estimatedBenefitPaise: number;
  readonly reasonKeys: readonly string[];
  readonly requiredScopes: readonly string[];
  readonly selectable: boolean;
  readonly prototypeData: true;
}

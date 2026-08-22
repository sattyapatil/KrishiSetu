export interface FarmerSummary {
  readonly farmerIdMasked: string;
  readonly displayName: { readonly en: string; readonly mr: string; readonly hi: string; readonly kn: string };
  readonly village: { readonly en: string; readonly mr: string; readonly hi: string; readonly kn: string };
  readonly district: string;
  readonly identityStatus: 'MOCK_VERIFIED';
}

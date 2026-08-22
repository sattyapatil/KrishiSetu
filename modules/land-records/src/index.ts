export interface LandHoldingSummary {
  readonly ulpinMasked: string;
  readonly surveyNumber: string;
  readonly village: string;
  readonly bucketId: string;
  readonly shareLabel: string;
  readonly allocatedCultivableHectares: string;
  readonly encumbrancePresent: boolean;
}

export interface LandRecordsSummary {
  readonly totalCultivableShareHectares: string;
  readonly holdings: readonly LandHoldingSummary[];
}

export interface CropItem {
  readonly code: string;
  readonly nameKey: string;
  readonly areaHectares: string;
  readonly verification: 'MOCK_VERIFIED';
}

export interface CropRegistrySummary {
  readonly season: 'KHARIF' | 'RABI' | 'SUMMER';
  readonly year: number;
  readonly items: readonly CropItem[];
}

import { PublicNotice } from '@krishisetu/notifications';
import { DistrictWeatherSummary } from '@krishisetu/weather-advisory';

export interface DashboardFarmerProfile {
  readonly id: string;
  readonly name: string;
  readonly districtKey: string;
  readonly talukaKey: string;
  readonly villageKey: string;
  readonly landHoldingsHectares: string;
  readonly cropCount: number;
  readonly verifiedLand: boolean;
  readonly verifiedCrops: boolean;
  readonly bankMapped: boolean;
  readonly bankName: string;
  readonly maskedAccount: string;
}

export interface DashboardLandHolding {
  readonly ulpinMasked: string;
  readonly surveyNumber: string;
  readonly village: string;
  readonly shareLabel: string;
  readonly allocatedCultivableHectares: string;
  readonly encumbrancePresent: boolean;
}

export interface DashboardCropRecord {
  readonly code: string;
  readonly nameKey: string;
  readonly areaHectares: string;
  readonly season: string;
  readonly year: number;
}

export interface DashboardActionItem {
  readonly id: string;
  readonly priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly actionLabelKey: string;
  readonly targetUrl: string;
  readonly deadlineDate?: string;
}

export interface DashboardSchemeOffering {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly estimatedBenefitPaise: number;
  readonly subsidyPercentage: number;
  readonly reasons: readonly string[];
  readonly status: 'LIKELY_ELIGIBLE' | 'ACTION_REQUIRED';
}

export interface DashboardCreditOffering {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly estimatedLimitPaise: number;
  readonly interestSubventionKey: string;
  readonly prequalified: boolean;
}

export interface DataSourceHealth {
  readonly name: string;
  readonly latencyMs: number;
  readonly status: 'HEALTHY' | 'DEGRADED' | 'TIMEOUT';
}

export interface DashboardTechnicalDetails {
  readonly auditTrackingId: string;
  readonly consentGrantTime: string;
  readonly activeScopes: readonly string[];
  readonly dataSources: readonly DataSourceHealth[];
  readonly sessionExpiry: string;
}

export interface DashboardViewModel {
  readonly farmer: DashboardFarmerProfile;
  readonly landHoldings: readonly DashboardLandHolding[];
  readonly cropRecords: readonly DashboardCropRecord[];
  readonly generatedAt: string;
  readonly actionItems: readonly DashboardActionItem[];
  readonly schemes: readonly DashboardSchemeOffering[];
  readonly credit: readonly DashboardCreditOffering[];
  readonly notices: readonly PublicNotice[];
  readonly weather: DistrictWeatherSummary;
  readonly technicalDetails: DashboardTechnicalDetails;
  readonly prototypeData: true;
}

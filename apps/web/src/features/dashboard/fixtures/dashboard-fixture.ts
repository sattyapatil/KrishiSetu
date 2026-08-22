import { DashboardViewModel } from '../types/dashboard-view-model.js';
import { SYNTHETIC_PUBLIC_NOTICES } from '@krishisetu/notifications';
import { SYNTHETIC_DISTRICT_WEATHER, getDistrictWeather } from '@krishisetu/weather-advisory';

const DEFAULT_WEATHER = SYNTHETIC_DISTRICT_WEATHER[0] ?? {
  districtId: 'pune',
  districtNameKey: 'weather.districts.pune',
  talukaNameKey: 'weather.talukas.haveli',
  asOfTime: '2026-08-22T06:00:00Z',
  temperatureCelsius: '28.5',
  conditionCode: 'MODERATE_RAIN' as const,
  rainfallMm24h: '14.2',
  relativeHumidityPercent: 82,
  windSpeedKmh: '18.5',
  forecast: [],
  warnings: [],
  agrometAdvisory: {
    validUntil: '2026-08-26T23:59:59Z',
    generalAdviceKey: 'weather.agromet.generalMonsoonAdvice',
    cropBulletins: [],
  },
  source: 'MOCK_AGROMET' as const,
  prototypeData: true as const,
};

export const SYNTHETIC_DASHBOARD_FIXTURES: Record<string, DashboardViewModel> = {
  '27202600000001': {
    farmer: {
      id: '27202600000001',
      name: 'Namdev Tukaram Shinde',
      districtKey: 'weather.districts.pune',
      talukaKey: 'weather.talukas.haveli',
      villageKey: 'Pashan',
      landHoldingsHectares: '0.6750',
      cropCount: 2,
      verifiedLand: true,
      verifiedCrops: true,
      bankMapped: true,
      bankName: 'Bank of Maharashtra',
      maskedAccount: '••••4812',
    },
    actionItems: [
      {
        id: 'act-001',
        priority: 'CRITICAL',
        titleKey: 'notifications.notices.solarDeadline.title',
        descriptionKey: 'notifications.notices.solarDeadline.summary',
        actionLabelKey: 'notifications.actions.applyNow',
        targetUrl: '/applications/solar-pump',
        deadlineDate: '2026-08-31',
      },
    ],
    schemes: [
      {
        id: 'offering_drip_2026',
        titleKey: 'schemes.dripTitle',
        descKey: 'schemes.dripDesc',
        estimatedBenefitPaise: 4800000,
        subsidyPercentage: 80,
        reasons: [
          'schemes.reasonCultivableShare',
          'schemes.reasonActiveCrop',
          'schemes.reasonNoDuplicate',
        ],
        status: 'LIKELY_ELIGIBLE',
      },
    ],
    credit: [
      {
        id: 'offering_kcc_2026',
        titleKey: 'credit.cardTitle',
        descKey: 'credit.summary',
        estimatedLimitPaise: 15750000,
        interestSubventionKey: 'credit.interestSubvention',
        prequalified: true,
      },
    ],
    notices: SYNTHETIC_PUBLIC_NOTICES,
    weather: getDistrictWeather('pune') ?? DEFAULT_WEATHER,
    technicalDetails: {
      auditTrackingId: 'AUDIT-KS-20260822-094182',
      consentGrantTime: '2026-08-22T08:00:00Z',
      activeScopes: ['LAND_READ', 'CROP_READ', 'SUBSIDY_ELIGIBILITY_READ', 'CREDIT_READ'],
      dataSources: [
        { name: 'Mahabhumi 7/12', latencyMs: 22, status: 'HEALTHY' },
        { name: 'Crop Registry', latencyMs: 18, status: 'HEALTHY' },
        { name: 'MahaDBT Gateway', latencyMs: 31, status: 'HEALTHY' },
        { name: 'ULI Unified Lending Interface', latencyMs: 36, status: 'HEALTHY' },
      ],
      sessionExpiry: '2026-08-22T09:00:00Z',
    },
    prototypeData: true,
  },
  '27202600000002': {
    farmer: {
      id: '27202600000002',
      name: 'Savitri Bai Patil',
      districtKey: 'weather.districts.baramati',
      talukaKey: 'weather.talukas.baramati',
      villageKey: 'Malegaon',
      landHoldingsHectares: '1.2000',
      cropCount: 1,
      verifiedLand: true,
      verifiedCrops: true,
      bankMapped: true,
      bankName: 'State Bank of India',
      maskedAccount: '••••8923',
    },
    actionItems: [
      {
        id: 'act-002',
        priority: 'HIGH',
        titleKey: 'notifications.notices.dripWindow.title',
        descriptionKey: 'notifications.notices.dripWindow.summary',
        actionLabelKey: 'notifications.actions.viewScheme',
        targetUrl: '/schemes/pmksy-drip',
        deadlineDate: '2026-09-30',
      },
    ],
    schemes: [
      {
        id: 'offering_drip_2026',
        titleKey: 'schemes.dripTitle',
        descKey: 'schemes.dripDesc',
        estimatedBenefitPaise: 8200000,
        subsidyPercentage: 80,
        reasons: ['schemes.reasonCultivableShare', 'schemes.reasonActiveCrop'],
        status: 'LIKELY_ELIGIBLE',
      },
    ],
    credit: [
      {
        id: 'offering_kcc_2026',
        titleKey: 'credit.cardTitle',
        descKey: 'credit.summary',
        estimatedLimitPaise: 24000000,
        interestSubventionKey: 'credit.interestSubvention',
        prequalified: true,
      },
    ],
    notices: SYNTHETIC_PUBLIC_NOTICES,
    weather: getDistrictWeather('baramati') ?? DEFAULT_WEATHER,
    technicalDetails: {
      auditTrackingId: 'AUDIT-KS-20260822-094183',
      consentGrantTime: '2026-08-22T08:05:00Z',
      activeScopes: ['LAND_READ', 'CROP_READ', 'SUBSIDY_ELIGIBILITY_READ', 'CREDIT_READ'],
      dataSources: [
        { name: 'Mahabhumi 7/12', latencyMs: 24, status: 'HEALTHY' },
        { name: 'Crop Registry', latencyMs: 19, status: 'HEALTHY' },
        { name: 'MahaDBT Gateway', latencyMs: 29, status: 'HEALTHY' },
        { name: 'ULI Unified Lending Interface', latencyMs: 41, status: 'HEALTHY' },
      ],
      sessionExpiry: '2026-08-22T09:05:00Z',
    },
    prototypeData: true,
  },
  '27202600000003': {
    farmer: {
      id: '27202600000003',
      name: 'Ramesh Vithal Ghadge',
      districtKey: 'weather.districts.pune',
      talukaKey: 'weather.talukas.haveli',
      villageKey: 'Khed Shivapur',
      landHoldingsHectares: '0.4500',
      cropCount: 1,
      verifiedLand: true,
      verifiedCrops: true,
      bankMapped: true,
      bankName: 'Pune District Central Co-op Bank',
      maskedAccount: '••••1129',
    },
    actionItems: [],
    schemes: [
      {
        id: 'offering_drip_2026',
        titleKey: 'schemes.dripTitle',
        descKey: 'schemes.dripDesc',
        estimatedBenefitPaise: 3200000,
        subsidyPercentage: 80,
        reasons: ['schemes.reasonCultivableShare'],
        status: 'LIKELY_ELIGIBLE',
      },
    ],
    credit: [
      {
        id: 'offering_kcc_2026',
        titleKey: 'credit.cardTitle',
        descKey: 'credit.summary',
        estimatedLimitPaise: 11000000,
        interestSubventionKey: 'credit.interestSubvention',
        prequalified: true,
      },
    ],
    notices: SYNTHETIC_PUBLIC_NOTICES,
    weather: getDistrictWeather('pune') ?? DEFAULT_WEATHER,
    technicalDetails: {
      auditTrackingId: 'AUDIT-KS-20260822-094184',
      consentGrantTime: '2026-08-22T08:10:00Z',
      activeScopes: ['LAND_READ', 'CROP_READ', 'SUBSIDY_ELIGIBILITY_READ', 'CREDIT_READ'],
      dataSources: [
        { name: 'Mahabhumi 7/12', latencyMs: 20, status: 'HEALTHY' },
        { name: 'Crop Registry', latencyMs: 17, status: 'HEALTHY' },
        { name: 'MahaDBT Gateway', latencyMs: 33, status: 'HEALTHY' },
        { name: 'ULI Unified Lending Interface', latencyMs: 38, status: 'HEALTHY' },
      ],
      sessionExpiry: '2026-08-22T09:10:00Z',
    },
    prototypeData: true,
  },
};

export function getDashboardViewModel(farmerId: string): DashboardViewModel {
  return SYNTHETIC_DASHBOARD_FIXTURES[farmerId] ?? SYNTHETIC_DASHBOARD_FIXTURES['27202600000001']!;
}

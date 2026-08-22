import { translate, type Locale } from '@krishisetu/i18n';
import type { CompositeDashboardModel } from '@krishisetu/dashboard';
import type { DashboardViewModel, DataSourceHealth } from './types/dashboard-view-model.js';
import { getDashboardViewModel } from './fixtures/dashboard-fixture.js';

const SOURCE_LABEL_KEYS = {
  mahabhumi: 'land.sourceMahabhumi',
  cropRegistry: 'crops.sourceCropRegistry',
  mahadbt: 'schemes.sourceMahadbt',
  uli: 'credit.sourceUli',
} as const;

function sourceHealth(
  sourceStatus: CompositeDashboardModel['sourceStatus'],
  locale: Locale
): readonly DataSourceHealth[] {
  return Object.entries(sourceStatus).map(([key, source]) => ({
    name: translate(SOURCE_LABEL_KEYS[key as keyof typeof SOURCE_LABEL_KEYS], locale),
    latencyMs: source.durationMs,
    status:
      source.status === 'OK' ? 'HEALTHY' : source.status === 'TIMEOUT' ? 'TIMEOUT' : 'DEGRADED',
  }));
}

export function mapDashboardApiToViewModel(input: {
  readonly model: CompositeDashboardModel;
  readonly farmerId: string;
  readonly locale: Locale;
  readonly activeScopes: readonly string[];
}): DashboardViewModel {
  const fallback = getDashboardViewModel(input.farmerId);
  const localizedName = input.model.farmer.displayName[input.locale] ?? input.model.farmer.displayName.en;
  const localizedVillage = input.model.farmer.village[input.locale] ?? input.model.farmer.village.en;
  const schemes = input.model.offerings
    .filter((offering) => offering.domain === 'MAHADBT' && offering.selectable)
    .map((offering) => ({
      id: offering.schemeCode === 'MAHADBT_DRIP' ? 'offering_drip_2026' : 'offering_rotavator_2026',
      titleKey: offering.schemeCode === 'MAHADBT_DRIP' ? 'schemes.dripTitle' : 'schemes.rotavatorTitle',
      descKey: offering.schemeCode === 'MAHADBT_DRIP' ? 'schemes.dripDesc' : 'schemes.rotavatorDesc',
      estimatedBenefitPaise: 'estimatedBenefitPaise' in offering ? offering.estimatedBenefitPaise : 0,
      subsidyPercentage: offering.schemeCode === 'MAHADBT_DRIP' ? 80 : 50,
      reasons: offering.reasonKeys.map((reason) => {
        if (reason === 'eligibility.cultivableShare') return 'schemes.reasonCultivableShare';
        if (reason === 'eligibility.activeCrop') return 'schemes.reasonActiveCrop';
        if (reason === 'eligibility.noDuplicate') return 'schemes.reasonNoDuplicate';
        return reason;
      }),
      status: offering.selectable ? 'LIKELY_ELIGIBLE' as const : 'ACTION_REQUIRED' as const,
    }));
  const credit = input.model.offerings
    .filter((offering) => offering.domain === 'ULI')
    .map((offering) => ({
      id: 'offering_kcc_2026',
      titleKey: 'credit.cardTitle',
      descKey: 'credit.summary',
      estimatedLimitPaise: 'estimatedLimitPaise' in offering ? offering.estimatedLimitPaise : 0,
      interestSubventionKey: 'credit.interestSubvention',
      prequalified: offering.selectable,
    }));

  return {
    ...fallback,
    farmer: {
      ...fallback.farmer,
      id: input.farmerId,
      name: localizedName,
      villageKey: localizedVillage,
      landHoldingsHectares: input.model.land.totalCultivableShareHectares,
      cropCount: input.model.crops.items.length,
      verifiedLand: input.model.readiness.land === 'READY',
      verifiedCrops: input.model.readiness.crop === 'READY',
      bankMapped: input.model.readiness.bank === 'READY',
    },
    landHoldings: input.model.land.holdings.map((holding) => ({
      ulpinMasked: holding.ulpinMasked,
      surveyNumber: holding.surveyNumber,
      village: holding.village,
      shareLabel: holding.shareLabel,
      allocatedCultivableHectares: holding.allocatedCultivableHectares,
      encumbrancePresent: holding.encumbrancePresent,
    })),
    cropRecords: input.model.crops.items.map((crop) => ({
      code: crop.code,
      nameKey: crop.nameKey,
      areaHectares: crop.areaHectares,
      season: input.model.crops.season,
      year: input.model.crops.year,
    })),
    generatedAt: input.model.metadata.generatedAt,
    schemes,
    credit,
    technicalDetails: {
      auditTrackingId: input.model.metadata.correlationId,
      consentGrantTime: input.model.metadata.generatedAt,
      activeScopes: input.activeScopes,
      dataSources: sourceHealth(input.model.sourceStatus, input.locale),
      sessionExpiry: input.model.metadata.consentValidUntil,
    },
  };
}

import type { CompositeDashboardModel } from '@krishisetu/dashboard';
import type { DashboardViewModel } from '../dashboard/types/dashboard-view-model.js';
import type { SchemeDetailItem } from './fixtures.js';

export interface SchemeEligibilityDecision {
  readonly eligible: boolean;
  readonly outcome: 'ELIGIBLE' | 'NEEDS_REVIEW' | 'INELIGIBLE';
  readonly reasonKey?: string;
}

const API_SCHEME_CODES: Readonly<Record<string, string>> = {
  offering_drip_2026: 'MAHADBT_DRIP',
  offering_rotavator_2026: 'SMAM_ROTAVATOR',
  offering_kcc_2026: 'KCC_CROP_LOAN',
};

/** Mirrors the provider rules so the pre-check and final submission cannot disagree. */
export function evaluateSchemeEligibility(
  scheme: SchemeDetailItem,
  viewModel: DashboardViewModel,
  dashboardSnapshot?: CompositeDashboardModel | null
): SchemeEligibilityDecision {
  const identityReady = Boolean(viewModel.farmer.id && viewModel.farmer.name);
  const areaHectares = Number(viewModel.farmer.landHoldingsHectares);
  const landReady = viewModel.farmer.verifiedLand && areaHectares > 0;
  const cropCodes = new Set(viewModel.cropRecords.map((crop) => crop.code));
  const cropReady = viewModel.farmer.verifiedCrops && cropCodes.size > 0;
  const jointOwnership = viewModel.landHoldings.some((holding) => {
    const denominator = holding.shareLabel.split('/')[1];
    return denominator !== undefined && denominator !== '1';
  });

  if (!identityReady || !landReady || !cropReady) {
    return { eligible: false, outcome: 'INELIGIBLE', reasonKey: 'schemes.recordsRequirementNotMet' };
  }

  if (scheme.id === 'offering_rotavator_2026') {
    if (areaHectares < 0.5) {
      return { eligible: false, outcome: 'INELIGIBLE', reasonKey: 'schemes.rotavatorAreaRequirement' };
    }
    if (!cropCodes.has('SUGARCANE')) {
      return { eligible: false, outcome: 'INELIGIBLE', reasonKey: 'schemes.rotavatorCropRequirement' };
    }
    if (jointOwnership) {
      return { eligible: false, outcome: 'NEEDS_REVIEW', reasonKey: 'schemes.rotavatorOwnershipReview' };
    }
  }

  if (
    scheme.id === 'offering_drip_2026' &&
    (areaHectares < 0.1 || (!cropCodes.has('SOYBEAN') && !cropCodes.has('PIGEON_PEA')))
  ) {
    return { eligible: false, outcome: 'INELIGIBLE', reasonKey: 'schemes.dripRequirementNotMet' };
  }

  if (scheme.domain === 'ULI' && !viewModel.farmer.bankMapped) {
    return { eligible: false, outcome: 'INELIGIBLE', reasonKey: 'schemes.bankRequirementNotMet' };
  }

  const authoritativeOffering = dashboardSnapshot?.offerings.find(
    (offering) => offering.schemeCode === API_SCHEME_CODES[scheme.id]
  );
  if (authoritativeOffering && !authoritativeOffering.selectable) {
    return {
      eligible: false,
      outcome: authoritativeOffering.outcome === 'NEEDS_REVIEW' ? 'NEEDS_REVIEW' : 'INELIGIBLE',
      reasonKey: 'schemes.providerEligibilityRequirementNotMet',
    };
  }

  return { eligible: true, outcome: 'ELIGIBLE' };
}

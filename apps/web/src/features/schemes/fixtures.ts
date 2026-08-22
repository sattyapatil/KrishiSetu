export interface SchemeDetailItem {
  readonly id: string;
  readonly domain: 'MAHADBT' | 'ULI';
  readonly schemeCode: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly estimatedBenefitPaise: number;
  readonly subsidyPercentage: number;
  readonly reasons: readonly string[];
  readonly requiredScopes: readonly string[];
  readonly guidelines: string;
  readonly providerName: string;
  readonly prototypeData: true;
}

export const SYNTHETIC_SCHEMES_CATALOG: readonly SchemeDetailItem[] = [
  {
    id: 'offering_drip_2026',
    domain: 'MAHADBT',
    schemeCode: 'drip_irrigation_2026',
    titleKey: 'schemes.dripTitle',
    descKey: 'schemes.dripDesc',
    estimatedBenefitPaise: 4800000,
    subsidyPercentage: 80,
    reasons: [
      'schemes.reasonCultivableShare',
      'schemes.reasonActiveCrop',
      'schemes.reasonNoDuplicate',
    ],
    requiredScopes: ['LAND_READ', 'CROP_READ', 'SUBSIDY_ELIGIBILITY_READ', 'SUBSIDY_APPLY'],
    guidelines:
      'Capital subsidy for automated drip irrigation installation on cultivable land under PMKSY. 80% subsidy for small and marginal farmers.',
    providerName: 'Mock MahaDBT agricultural benefits adapter',
    prototypeData: true,
  },
  {
    id: 'offering_rotavator_2026',
    domain: 'MAHADBT',
    schemeCode: 'rotavator_smam_2026',
    titleKey: 'schemes.rotavatorTitle',
    descKey: 'schemes.rotavatorDesc',
    estimatedBenefitPaise: 3500000,
    subsidyPercentage: 50,
    reasons: ['schemes.reasonCultivableShare', 'schemes.reasonActiveCrop'],
    requiredScopes: ['LAND_READ', 'CROP_READ', 'SUBSIDY_ELIGIBILITY_READ', 'SUBSIDY_APPLY'],
    guidelines:
      'Machinery subsidy on tractor-mounted rotary tiller equipment under Sub-Mission on Agricultural Mechanization (SMAM).',
    providerName: 'Mock MahaDBT agricultural benefits adapter',
    prototypeData: true,
  },
  {
    id: 'offering_kcc_2026',
    domain: 'ULI',
    schemeCode: 'kcc_crop_loan_2026',
    titleKey: 'credit.cardTitle',
    descKey: 'credit.summary',
    estimatedBenefitPaise: 15750000,
    subsidyPercentage: 0,
    reasons: ['credit.interestSubvention', 'credit.preapprovedNotice'],
    requiredScopes: ['LAND_READ', 'CROP_READ', 'CREDIT_READ', 'CREDIT_PREAPPLY'],
    guidelines:
      'Kisan Credit Card short term crop loan scale of finance limit at 4% effective interest with 3% prompt repayment subvention.',
    providerName: 'Mock ULI lending adapter',
    prototypeData: true,
  },
] as const;

export function getSchemeById(id: string): SchemeDetailItem | undefined {
  return SYNTHETIC_SCHEMES_CATALOG.find(
    (s) => s.id === id || s.schemeCode === id
  );
}

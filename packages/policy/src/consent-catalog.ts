/**
 * Authoritative Consent Purposes, Scopes, and Retention Policy for KrishiSetu.
 * Used by consent middleware, UI checkboxes, OpenAPI enums, and purge executors.
 */

export const consentScopes = {
  IDENTITY_READ: {
    code: 'IDENTITY_READ',
    labelKey: 'consent.scopes.identityRead.label',
    descriptionKey: 'consent.scopes.identityRead.description',
    category: 'IDENTITY',
    isSensitive: true,
  },
  LAND_READ: {
    code: 'LAND_READ',
    labelKey: 'consent.scopes.landRead.label',
    descriptionKey: 'consent.scopes.landRead.description',
    category: 'AGRICULTURAL',
    isSensitive: false,
  },
  CROP_READ: {
    code: 'CROP_READ',
    labelKey: 'consent.scopes.cropRead.label',
    descriptionKey: 'consent.scopes.cropRead.description',
    category: 'AGRICULTURAL',
    isSensitive: false,
  },
  BANK_STATUS_READ: {
    code: 'BANK_STATUS_READ',
    labelKey: 'consent.scopes.bankStatusRead.label',
    descriptionKey: 'consent.scopes.bankStatusRead.description',
    category: 'FINANCIAL',
    isSensitive: true,
  },
  SUBSIDY_ELIGIBILITY_READ: {
    code: 'SUBSIDY_ELIGIBILITY_READ',
    labelKey: 'consent.scopes.subsidyEligibilityRead.label',
    descriptionKey: 'consent.scopes.subsidyEligibilityRead.description',
    category: 'BENEFITS',
    isSensitive: false,
  },
  CREDIT_READ: {
    code: 'CREDIT_READ',
    labelKey: 'consent.scopes.creditRead.label',
    descriptionKey: 'consent.scopes.creditRead.description',
    category: 'FINANCIAL',
    isSensitive: true,
  },
  SUBSIDY_APPLY: {
    code: 'SUBSIDY_APPLY',
    labelKey: 'consent.scopes.subsidyApply.label',
    descriptionKey: 'consent.scopes.subsidyApply.description',
    category: 'BENEFITS',
    isSensitive: false,
  },
  CREDIT_PREAPPLY: {
    code: 'CREDIT_PREAPPLY',
    labelKey: 'consent.scopes.creditPreapply.label',
    descriptionKey: 'consent.scopes.creditPreapply.description',
    category: 'FINANCIAL',
    isSensitive: true,
  },
} as const;

export type ConsentScopeCode = keyof typeof consentScopes;

export const consentPurposes = {
  DASHBOARD_VIEW: {
    code: 'DASHBOARD_VIEW',
    version: '1.0',
    titleKey: 'consent.purposes.dashboardView.title',
    descriptionKey: 'consent.purposes.dashboardView.description',
    defaultDurationSeconds: 1800, // 30 minutes
    requiredScopes: [
      'IDENTITY_READ',
      'LAND_READ',
      'CROP_READ',
      'BANK_STATUS_READ',
      'SUBSIDY_ELIGIBILITY_READ',
      'CREDIT_READ',
    ] as const,
  },
  MULTI_SCHEME_APPLICATION: {
    code: 'MULTI_SCHEME_APPLICATION',
    version: '1.0',
    titleKey: 'consent.purposes.multiSchemeApplication.title',
    descriptionKey: 'consent.purposes.multiSchemeApplication.description',
    defaultDurationSeconds: 1800, // 30 minutes
    requiredScopes: [
      'IDENTITY_READ',
      'LAND_READ',
      'CROP_READ',
      'BANK_STATUS_READ',
      'SUBSIDY_ELIGIBILITY_READ',
      'CREDIT_READ',
      'SUBSIDY_APPLY',
      'CREDIT_PREAPPLY',
    ] as const,
  },
} as const;

export type ConsentPurposeCode = keyof typeof consentPurposes;

export const retentionPolicies = {
  dashboardCache: {
    onRevocation: 'DELETE_IMMEDIATELY',
    description: 'Derived multi-domain read model caches',
  },
  normalizedSnapshots: {
    onRevocation: 'DELETE_IMMEDIATELY',
    description: 'Temporary provider query snapshots',
  },
  draftBundles: {
    onRevocation: 'DELETE_IMMEDIATELY',
    description: 'Unsubmitted application drafts',
  },
  incompleteApplications: {
    onRevocation: 'DELETE_IMMEDIATELY',
    description: 'Partially submitted application records',
  },
  temporaryAttachments: {
    onRevocation: 'DELETE_IMMEDIATELY',
    description: 'Temporary file artifacts',
  },
  completedReceipts: {
    onRevocation: 'PSEUDONYMIZE_OR_DELETE',
    description: 'Submitted application receipt references and counts',
  },
  syntheticFixtures: {
    onRevocation: 'RETAIN_SYNTHETIC',
    description: 'Committed fictional demo fixture data',
  },
  auditTombstone: {
    onRevocation: 'RETAIN_MINIMAL_AUDIT',
    description: 'Sanitized operation record with zero payload',
  },
} as const;

/**
 * Authoritative Module Registry for KrishiSetu.
 * Controls module availability, required vs optional lifecycle, and required consent scopes.
 */

export interface ModuleDefinition {
  readonly enabled: boolean;
  readonly required?: boolean;
  readonly requiredScopes?: readonly string[];
  readonly descriptionKey?: string;
}

export const moduleRegistry = {
  identity: {
    enabled: true,
    required: true,
    descriptionKey: 'modules.identity.description',
  },
  users: {
    enabled: true,
    required: true,
    descriptionKey: 'modules.users.description',
  },
  consent: {
    enabled: true,
    required: true,
    descriptionKey: 'modules.consent.description',
  },
  farmerProfile: {
    enabled: true,
    required: true,
    descriptionKey: 'modules.farmerProfile.description',
  },
  landRecords: {
    enabled: true,
    requiredScopes: ['LAND_READ'],
    descriptionKey: 'modules.landRecords.description',
  },
  cropRegistry: {
    enabled: true,
    requiredScopes: ['CROP_READ'],
    descriptionKey: 'modules.cropRegistry.description',
  },
  schemes: {
    enabled: true,
    requiredScopes: ['SUBSIDY_ELIGIBILITY_READ'],
    descriptionKey: 'modules.schemes.description',
  },
  credit: {
    enabled: true,
    requiredScopes: ['CREDIT_READ'],
    descriptionKey: 'modules.credit.description',
  },
  applications: {
    enabled: true,
    requiredScopes: ['SUBSIDY_APPLY', 'CREDIT_PREAPPLY'],
    descriptionKey: 'modules.applications.description',
  },
  notifications: {
    enabled: false,
    descriptionKey: 'modules.notifications.description',
  },
  weatherAdvisory: {
    enabled: false,
    descriptionKey: 'modules.weatherAdvisory.description',
  },
  audit: {
    enabled: true,
    required: true,
    descriptionKey: 'modules.audit.description',
  },
  dashboard: {
    enabled: true,
    required: true,
    descriptionKey: 'modules.dashboard.description',
  },
} as const satisfies Record<string, ModuleDefinition>;

export type ModuleId = keyof typeof moduleRegistry;
export type ModuleRegistry = typeof moduleRegistry;

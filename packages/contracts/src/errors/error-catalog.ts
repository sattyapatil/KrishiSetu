/**
 * Authoritative Error Catalog for KrishiSetu.
 * Maps error codes to message keys, retryability, and default HTTP status codes.
 */

export interface ErrorDefinition {
  readonly code: string;
  readonly messageKey: string;
  readonly defaultStatus: number;
  readonly retryable: boolean;
  readonly defaultFallbackMessage: string;
}

export const errorCatalog = {
  CONSENT_REQUIRED: {
    code: 'CONSENT_REQUIRED',
    messageKey: 'errors.consent.required',
    defaultStatus: 403,
    retryable: false,
    defaultFallbackMessage: 'Active consent is required to access this service.',
  },
  CONSENT_SCOPE_MISSING: {
    code: 'CONSENT_SCOPE_MISSING',
    messageKey: 'errors.consent.scopeMissing',
    defaultStatus: 403,
    retryable: false,
    defaultFallbackMessage: 'Required permission scope is missing from current consent.',
  },
  CONSENT_REVOKED: {
    code: 'CONSENT_REVOKED',
    messageKey: 'errors.consent.revoked',
    defaultStatus: 403,
    retryable: false,
    defaultFallbackMessage: 'Consent has been withdrawn. No source system was contacted.',
  },
  CONSENT_EXPIRED: {
    code: 'CONSENT_EXPIRED',
    messageKey: 'errors.consent.expired',
    defaultStatus: 403,
    retryable: false,
    defaultFallbackMessage: 'Consent validity has expired. Please grant consent again.',
  },
  DEMO_FARMER_NOT_FOUND: {
    code: 'DEMO_FARMER_NOT_FOUND',
    messageKey: 'errors.identity.demoFarmerNotFound',
    defaultStatus: 404,
    retryable: false,
    defaultFallbackMessage: 'Synthetic Farmer ID was not found in the demo allowlist.',
  },
  INVALID_DEMO_PIN: {
    code: 'INVALID_DEMO_PIN',
    messageKey: 'errors.identity.invalidPin',
    defaultStatus: 401,
    retryable: true,
    defaultFallbackMessage: 'Invalid demo PIN. Use the demo PIN 2468 for testing.',
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    messageKey: 'errors.identity.rateLimitExceeded',
    defaultStatus: 429,
    retryable: true,
    defaultFallbackMessage: 'Too many failed attempts. Please wait 60 seconds.',
  },
  IDEMPOTENCY_CONFLICT: {
    code: 'IDEMPOTENCY_CONFLICT',
    messageKey: 'errors.applications.idempotencyConflict',
    defaultStatus: 409,
    retryable: false,
    defaultFallbackMessage: 'Idempotency key was reused with a different request payload.',
  },
  SOURCE_TEMPORARILY_UNAVAILABLE: {
    code: 'SOURCE_TEMPORARILY_UNAVAILABLE',
    messageKey: 'sources.common.temporarilyUnavailable',
    defaultStatus: 503,
    retryable: true,
    defaultFallbackMessage: 'A simulated data source is temporarily unavailable.',
  },
  DASHBOARD_UNAVAILABLE: {
    code: 'DASHBOARD_UNAVAILABLE',
    messageKey: 'errors.dashboard.unavailable',
    defaultStatus: 503,
    retryable: true,
    defaultFallbackMessage: 'All agricultural data sources are currently unavailable.',
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    messageKey: 'errors.common.validationError',
    defaultStatus: 400,
    retryable: false,
    defaultFallbackMessage: 'Request validation failed. Please check the input parameters.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    messageKey: 'errors.common.internalError',
    defaultStatus: 500,
    retryable: false,
    defaultFallbackMessage: 'An internal server error occurred.',
  },
} as const satisfies Record<string, ErrorDefinition>;

export type ErrorCode = keyof typeof errorCatalog;

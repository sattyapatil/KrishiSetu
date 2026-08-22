/**
 * Authoritative Data Classification Taxonomy for KrishiSetu.
 * Guides logging, redaction, and persistence.
 */

export const dataClasses = {
  PUBLIC: {
    name: 'PUBLIC',
    description: 'Design tokens, scheme descriptions, static notice text',
    loggingAllowed: true,
    storageLocation: 'REPOSITORY_OR_PUBLIC',
  },
  SYNTHETIC_RESTRICTED: {
    name: 'SYNTHETIC_RESTRICTED',
    description: 'Fictional names, Farmer IDs, parcels, crops, bank mock status',
    loggingAllowed: false,
    storageLocation: 'SQLITE_FIXTURES',
  },
  SECRET: {
    name: 'SECRET',
    description: 'Session secrets, consent signing JWK, CSRF tokens',
    loggingAllowed: false,
    storageLocation: 'ENVIRONMENT_SECRETS',
  },
  DERIVED_EPHEMERAL: {
    name: 'DERIVED_EPHEMERAL',
    description: 'Dashboard cache, temporary normalized snapshots, draft bundles',
    loggingAllowed: false,
    storageLocation: 'SQLITE_WITH_CONSENT_ID',
  },
  MINIMAL_AUDIT: {
    name: 'MINIMAL_AUDIT',
    description: 'Request/correlation ID, state transition, timestamps, category counts',
    loggingAllowed: true,
    storageLocation: 'SQLITE_AUDIT_TABLE',
  },
} as const;

export type DataClass = keyof typeof dataClasses;

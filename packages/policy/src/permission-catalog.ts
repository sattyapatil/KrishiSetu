/**
 * Authoritative Permission Catalog for KrishiSetu.
 */

export const permissions = {
  FARMER_SELF_READ: 'FARMER_SELF_READ',
  FARMER_SELF_WRITE: 'FARMER_SELF_WRITE',
  CONSENT_MANAGE: 'CONSENT_MANAGE',
  APPLICATION_SUBMIT: 'APPLICATION_SUBMIT',
  ADMIN_READ: 'ADMIN_READ',
  DEMO_RESET: 'DEMO_RESET',
} as const;

export type Permission = (typeof permissions)[keyof typeof permissions];

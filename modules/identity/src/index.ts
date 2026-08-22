/**
 * Public Application API for Identity Module.
 * Strict Boundary: internal repositories, adapters, and SQL tables are private.
 */

export interface SessionPrincipal {
  readonly principalId: string;
  readonly farmerId: string;
  readonly expiresAt: string;
  readonly csrfToken: string;
}

export interface IdentityService {
  validateSession(token: string): Promise<SessionPrincipal | null>;
}

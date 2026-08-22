import { DomainError, Result, err, ok } from './result.js';

export type Branded<T, B> = T & { readonly __brand: B };

export type FarmerId = Branded<string, 'FarmerId'>;
export type Ulpin = Branded<string, 'Ulpin'>;
export type ConsentId = Branded<string, 'ConsentId'>;
export type BundleId = Branded<string, 'BundleId'>;
export type UserId = Branded<string, 'UserId'>;
export type PrincipalId = Branded<string, 'PrincipalId'>;

const SYNTHETIC_FARMER_ID_REGEX = /^272026\d{8}$/;
const ULPIN_REGEX = /^\d{14}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseFarmerId(raw: string): Result<FarmerId, DomainError> {
  const trimmed = raw.trim();
  if (!SYNTHETIC_FARMER_ID_REGEX.test(trimmed)) {
    return err({
      code: 'INVALID_FARMER_ID',
      messageKey: 'errors.identity.invalidFarmerIdFormat',
      details: { input: raw },
      retryable: false,
    });
  }
  return ok(trimmed as FarmerId);
}

export function parseUlpin(raw: string): Result<Ulpin, DomainError> {
  const trimmed = raw.trim();
  if (!ULPIN_REGEX.test(trimmed)) {
    return err({
      code: 'INVALID_ULPIN',
      messageKey: 'errors.land.invalidUlpinFormat',
      details: { input: raw },
      retryable: false,
    });
  }
  return ok(trimmed as Ulpin);
}

export function parseConsentId(raw: string): Result<ConsentId, DomainError> {
  const trimmed = raw.trim();
  if (!UUID_REGEX.test(trimmed)) {
    return err({
      code: 'INVALID_CONSENT_ID',
      messageKey: 'errors.consent.invalidIdFormat',
      details: { input: raw },
      retryable: false,
    });
  }
  return ok(trimmed as ConsentId);
}

export function maskIdentifier(identifier: string, visibleSuffixLength = 4): string {
  if (!identifier || identifier.length <= visibleSuffixLength) {
    return identifier;
  }
  const prefixLength = identifier.length - visibleSuffixLength;
  const maskedPrefix = '•'.repeat(Math.min(prefixLength, 10));
  const suffix = identifier.slice(-visibleSuffixLength);
  return `${maskedPrefix}${suffix}`;
}

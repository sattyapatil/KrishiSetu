/**
 * Standard API Envelopes and Response DTOs for KrishiSetu.
 */

export interface ApiErrorResponse {
  readonly error: {
    readonly code: string;
    readonly messageKey: string;
    readonly message: string;
    readonly details?: Readonly<Record<string, unknown>>;
    readonly retryable: boolean;
    readonly requestId?: string;
  };
}

export interface ApiSuccessEnvelope<T> {
  readonly data: T;
  readonly metadata?: {
    readonly correlationId?: string;
    readonly generatedAt?: string;
    readonly prototypeData: true;
  };
}

export interface StandardHeaders {
  readonly 'Cookie'?: string;
  readonly 'X-CSRF-Token'?: string;
  readonly 'X-Consent-Id'?: string;
  readonly 'Idempotency-Key'?: string;
  readonly 'X-Request-Id'?: string;
  readonly 'X-Correlation-Id'?: string;
  readonly 'Accept-Language'?: string;
}

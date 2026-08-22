/**
 * Universal Result and DomainError types for KrishiSetu.
 * Free of UI, database, or external provider dependencies.
 */

export interface DomainError {
  readonly code: string;
  readonly messageKey: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly retryable?: boolean;
}

export type Result<T, E extends DomainError = DomainError> =
  | { readonly success: true; readonly value: T; readonly error?: never }
  | { readonly success: false; readonly error: E; readonly value?: never };

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function err<E extends DomainError>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isOk<T, E extends DomainError>(
  result: Result<T, E>
): result is { readonly success: true; readonly value: T; readonly error?: never } {
  return result.success;
}

export function isErr<T, E extends DomainError>(
  result: Result<T, E>
): result is { readonly success: false; readonly error: E; readonly value?: never } {
  return !result.success;
}

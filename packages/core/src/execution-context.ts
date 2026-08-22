import { Clock } from './clock';
import { ConsentId, PrincipalId, UserId } from './identifiers';

export interface ExecutionContext {
  readonly requestId: string;
  readonly correlationId: string;
  readonly principalId?: PrincipalId;
  readonly userId?: UserId;
  readonly consentId?: ConsentId;
  readonly locale: string;
  readonly clock: Clock;
  readonly permissions: ReadonlySet<string>;
  readonly dataScopes: ReadonlySet<string>;
}

export function createExecutionContext(params: {
  requestId: string;
  correlationId: string;
  clock: Clock;
  locale?: string;
  principalId?: PrincipalId;
  userId?: UserId;
  consentId?: ConsentId;
  permissions?: Iterable<string>;
  dataScopes?: Iterable<string>;
}): ExecutionContext {
  return {
    requestId: params.requestId,
    correlationId: params.correlationId,
    clock: params.clock,
    locale: params.locale ?? 'en',
    principalId: params.principalId,
    userId: params.userId,
    consentId: params.consentId,
    permissions: new Set(params.permissions ?? []),
    dataScopes: new Set(params.dataScopes ?? []),
  };
}

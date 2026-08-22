export interface AuditRecord {
  readonly id: string;
  readonly category: 'ACCESS' | 'CONSENT' | 'APPLICATION' | 'PURGE';
  readonly occurredAt: string;
  readonly correlationId: string;
  readonly principalIdMasked?: string;
  readonly action: string;
  readonly summary: string;
}

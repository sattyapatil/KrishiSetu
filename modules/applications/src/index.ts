export interface ChildApplicationReceipt {
  readonly childId: string;
  readonly domain: 'MAHADBT' | 'ULI';
  readonly schemeCode: string;
  readonly status: 'ACCEPTED_MOCK' | 'FAILED_RETRYABLE' | 'REJECTED_MOCK';
  readonly providerReceipt?: string;
  readonly nextStepKey?: string;
  readonly errorCode?: string;
  readonly messageKey?: string;
  readonly retryable?: boolean;
}

export interface ApplicationBundle {
  readonly bundleId: string;
  readonly status: 'COMPLETED' | 'PARTIAL' | 'FAILED_RETRYABLE';
  readonly submittedAt: string;
  readonly idempotencyKey: string;
  readonly children: readonly ChildApplicationReceipt[];
  readonly prototypeData: true;
}

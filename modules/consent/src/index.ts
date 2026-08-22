import { ConsentPurposeCode, ConsentScopeCode } from '@krishisetu/policy';

export interface ConsentRecord {
  readonly consentId: string;
  readonly farmerId: string;
  readonly purposeCode: ConsentPurposeCode;
  readonly scopes: readonly ConsentScopeCode[];
  readonly status: 'GRANTED' | 'REVOKED' | 'EXPIRED';
  readonly grantedAt: string;
  readonly validUntil: string;
}

export interface ConsentValidator {
  validate(params: {
    consentId: string;
    farmerId: string;
    requiredScopes: readonly string[];
  }): Promise<boolean>;
}

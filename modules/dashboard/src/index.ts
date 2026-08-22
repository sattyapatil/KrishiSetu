import { FarmerSummary } from '@krishisetu/farmer-profile';
import { LandRecordsSummary } from '@krishisetu/land-records';
import { CropRegistrySummary } from '@krishisetu/crop-registry';
import { SchemeOffering } from '@krishisetu/schemes';
import { CreditOffering } from '@krishisetu/credit';

export interface SourceStatusItem {
  readonly status: 'OK' | 'TIMEOUT' | 'ERROR';
  readonly durationMs: number;
  readonly asOf?: string;
  readonly messageKey?: string;
}

export interface CompositeDashboardModel {
  readonly metadata: {
    readonly correlationId: string;
    readonly generatedAt: string;
    readonly overallStatus: 'COMPLETE' | 'PARTIAL';
    readonly consentId: string;
    readonly consentValidUntil: string;
    readonly prototypeData: true;
  };
  readonly farmer: FarmerSummary;
  readonly readiness: {
    readonly land: 'READY' | 'UNKNOWN';
    readonly crop: 'READY' | 'UNKNOWN';
    readonly bank: 'READY' | 'UNKNOWN';
    readonly blockingIssues: readonly string[];
  };
  readonly land: LandRecordsSummary;
  readonly crops: CropRegistrySummary;
  readonly offerings: readonly (SchemeOffering | CreditOffering)[];
  readonly sourceStatus: {
    readonly mahabhumi: SourceStatusItem;
    readonly cropRegistry: SourceStatusItem;
    readonly mahadbt: SourceStatusItem;
    readonly uli: SourceStatusItem;
  };
}

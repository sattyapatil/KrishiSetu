export type NoticeType =
  | 'SCHEME_WINDOW'
  | 'APPLICATION_DEADLINE'
  | 'REVISED_FORM'
  | 'CORRIGENDUM'
  | 'SERVICE_ADVISORY'
  | 'GENERAL_ANNOUNCEMENT';

export type NoticeStatus = 'ACTIVE' | 'UPCOMING' | 'EXPIRED' | 'SUPERSEDED' | 'ARCHIVED';

export type NoticePriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type NoticeAudience =
  | 'ALL'
  | 'SMALL_MARGINAL'
  | 'WOMEN_FARMERS'
  | 'DRYLAND'
  | 'IRRIGATED';

export type NoticeSource =
  | 'MAHADBT_SCHEMES'
  | 'AGRI_DEPT'
  | 'REVENUE_DEPT'
  | 'KRISHISETU_SYSTEM';

export interface NoticeAction {
  readonly labelKey: string;
  readonly targetUrl: string;
  readonly isExternal?: boolean;
}

export interface NoticeForm {
  readonly formId: string;
  readonly formTitleKey: string;
  readonly revisionNumber: string;
  readonly releaseDate: string;
}

export interface PublicNotice {
  readonly id: string;
  readonly slug: string;
  readonly type: NoticeType;
  readonly status: NoticeStatus;
  readonly priority: NoticePriority;
  readonly audience: NoticeAudience;
  readonly titleKey: string;
  readonly summaryKey: string;
  readonly bodyKey: string;
  readonly source: NoticeSource;
  readonly publishedAt: string;
  readonly effectiveFrom: string;
  readonly effectiveTo?: string;
  readonly corrigendumOf?: string;
  readonly form?: NoticeForm;
  readonly action?: NoticeAction;
  readonly prototypeData: true;
}

export interface NoticeFilters {
  readonly type?: NoticeType;
  readonly status?: NoticeStatus;
  readonly audience?: NoticeAudience;
  readonly priority?: NoticePriority;
  readonly searchQuery?: string;
}

export interface PublicProvenance {
  readonly mode: 'SYNTHETIC';
  readonly updatedAt: string;
  readonly displayUpdatedAt: string;
  readonly labelKey: string;
}

export type PublicWidgetStatus = 'AVAILABLE' | 'STALE' | 'UNAVAILABLE';

export interface PublicWidgetStates {
  readonly alert: PublicWidgetStatus;
  readonly weather: PublicWidgetStatus;
  readonly market: PublicWidgetStatus;
  readonly advisory: PublicWidgetStatus;
  readonly schemes: PublicWidgetStatus;
  readonly notices: PublicWidgetStatus;
  readonly updates: PublicWidgetStatus;
}

export interface PublicWeatherSnapshot {
  readonly districtId: string;
  readonly districtLabel: string;
  readonly talukaLabel: string;
  readonly temperatureCelsius: number;
  readonly condition: string;
  readonly conditionCode: string;
  readonly rainfallProbabilityPercent: number;
  readonly rainfallMm24h: number;
  readonly relativeHumidityPercent: number;
  readonly windSpeedKmh: number;
  readonly warning: string;
  readonly sourceLabel: string;
  readonly prototypeData: true;
}

export interface PublicAdvisory {
  readonly title: string;
  readonly summary: string;
  readonly validity: string;
  readonly source: string;
  readonly prototypeData: true;
}

export interface PublicMarketRow {
  readonly commodity: string;
  readonly commodityKey: string;
  readonly modalPricePaise: number;
  readonly displayPrice: string;
  readonly changePercent: number;
  readonly direction: 'UP' | 'DOWN';
  readonly arrivalQuintals: number;
}

export interface PublicSchemeCard {
  readonly schemeId: string;
  readonly schemeCode: string;
  readonly titleKey: string;
  readonly fallbackTitle: string;
  readonly benefitKey: string;
  readonly fallbackBenefit: string;
  readonly audienceKey: string;
  readonly fallbackAudience: string;
  readonly stateKey: string;
  readonly fallbackState: string;
  readonly returnToPath: string;
  readonly prototypeData: true;
}

export interface PublicNoticeItem {
  readonly id: string;
  readonly priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  readonly date: string;
  readonly dateKey: string;
  readonly titleKey: string;
  readonly fallbackTitle: string;
  readonly summaryKey: string;
  readonly fallbackSummary: string;
  readonly source: string;
  readonly prototypeData: true;
}

export interface PublicAgricultureUpdate {
  readonly id: string;
  readonly titleKey: string;
  readonly fallbackTitle: string;
  readonly dateKey: string;
  readonly fallbackDate: string;
  readonly categoryKey: string;
  readonly fallbackCategory: string;
  readonly summaryKey: string;
  readonly fallbackSummary: string;
  readonly source: string;
  readonly prototypeData: true;
}

export interface PublicAlert {
  readonly noticeId: string;
  readonly labelKey: string;
  readonly titleKey: string;
  readonly fallbackTitle: string;
  readonly metaKey: string;
  readonly fallbackMeta: string;
  readonly actionKey: string;
}

export interface PublicHomeViewModel {
  readonly provenance: PublicProvenance;
  readonly widgetStates: PublicWidgetStates;
  readonly alert: PublicAlert;
  readonly weather: PublicWeatherSnapshot;
  readonly advisory: PublicAdvisory;
  readonly marketRows: readonly PublicMarketRow[];
  readonly featuredSchemes: readonly PublicSchemeCard[];
  readonly notices: readonly PublicNoticeItem[];
  readonly updates: readonly PublicAgricultureUpdate[];
}

export type DetailModalType =
  | 'ALERT'
  | 'WEATHER'
  | 'ADVISORY'
  | 'MARKET'
  | 'SCHEME'
  | 'NOTICE'
  | 'UPDATE'
  | null;

export interface ActiveDetailModalState {
  readonly type: DetailModalType;
  readonly id?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly content: React.ReactNode;
}

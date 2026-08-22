export type WeatherConditionCode =
  | 'CLEAR'
  | 'PARTLY_CLOUDY'
  | 'CLOUDY'
  | 'LIGHT_RAIN'
  | 'MODERATE_RAIN'
  | 'HEAVY_RAIN'
  | 'THUNDERSTORM'
  | 'FOG';

export type WeatherWarningSeverity = 'YELLOW' | 'ORANGE' | 'RED';

export interface DailyForecast {
  readonly date: string;
  readonly dayOfWeekKey: string;
  readonly conditionCode: WeatherConditionCode;
  readonly tempMinCelsius: string;
  readonly tempMaxCelsius: string;
  readonly expectedRainfallMm: string;
  readonly rainfallProbabilityPercent: number;
}

export interface WeatherWarning {
  readonly code: string;
  readonly severity: WeatherWarningSeverity;
  readonly titleKey: string;
  readonly instructionKey: string;
}

export interface CropAgrometBulletin {
  readonly cropNameKey: string;
  readonly stageKey: string;
  readonly advisoryKey: string;
}

export interface AgrometAdvisory {
  readonly validUntil: string;
  readonly generalAdviceKey: string;
  readonly cropBulletins: readonly CropAgrometBulletin[];
}

export interface DistrictWeatherSummary {
  readonly districtId: string;
  readonly districtNameKey: string;
  readonly talukaNameKey?: string;
  readonly asOfTime: string;
  readonly temperatureCelsius: string;
  readonly conditionCode: WeatherConditionCode;
  readonly rainfallMm24h: string;
  readonly relativeHumidityPercent: number;
  readonly windSpeedKmh: string;
  readonly forecast: readonly DailyForecast[];
  readonly warnings: readonly WeatherWarning[];
  readonly agrometAdvisory: AgrometAdvisory;
  readonly source: 'MOCK_AGROMET';
  readonly prototypeData: true;
}

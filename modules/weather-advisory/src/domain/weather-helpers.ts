import { DistrictWeatherSummary, WeatherWarning, WeatherWarningSeverity } from './weather-types.js';

export function isWeatherDataFresh(
  summary: DistrictWeatherSummary,
  asOfDate: Date = new Date('2026-08-22T08:00:00Z'),
  maxAgeHours = 24
): boolean {
  const asOfTimeMs = asOfDate.getTime();
  const summaryTimeMs = new Date(summary.asOfTime).getTime();
  if (Number.isNaN(summaryTimeMs)) return false;

  const ageHours = (asOfTimeMs - summaryTimeMs) / (1000 * 60 * 60);
  return ageHours >= 0 && ageHours <= maxAgeHours;
}

const SEVERITY_RANK: Record<WeatherWarningSeverity, number> = {
  RED: 3,
  ORANGE: 2,
  YELLOW: 1,
};

export function getWorstWarningSeverity(
  warnings: readonly WeatherWarning[]
): WeatherWarningSeverity | null {
  if (warnings.length === 0) return null;

  let worst: WeatherWarningSeverity = 'YELLOW';
  let maxRank = 0;

  for (const warning of warnings) {
    const rank = SEVERITY_RANK[warning.severity];
    if (rank > maxRank) {
      maxRank = rank;
      worst = warning.severity;
    }
  }

  return worst;
}

export function getRainfallIntensity(rainfallMmStr: string): 'NONE' | 'LIGHT' | 'MODERATE' | 'HEAVY' {
  const val = Number.parseFloat(rainfallMmStr);
  if (Number.isNaN(val) || val <= 0) return 'NONE';
  if (val < 7.5) return 'LIGHT';
  if (val < 35.5) return 'MODERATE';
  return 'HEAVY';
}

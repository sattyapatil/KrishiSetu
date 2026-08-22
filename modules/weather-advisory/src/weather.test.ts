import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SYNTHETIC_DISTRICT_WEATHER,
  getDistrictWeather,
  isWeatherDataFresh,
  getWorstWarningSeverity,
  getRainfallIntensity,
} from './index.js';

describe('modules/weather-advisory', () => {
  it('SYNTHETIC_DISTRICT_WEATHER defines valid synthetic weather summaries', () => {
    assert.ok(SYNTHETIC_DISTRICT_WEATHER.length >= 2);
    for (const w of SYNTHETIC_DISTRICT_WEATHER) {
      assert.equal(w.source, 'MOCK_AGROMET');
      assert.equal(w.prototypeData, true);
      assert.equal(typeof w.temperatureCelsius, 'string');
      assert.equal(typeof w.rainfallMm24h, 'string');
      assert.ok(w.forecast.length === 5);
      assert.ok(w.agrometAdvisory.cropBulletins.length > 0);
    }
  });

  it('getDistrictWeather returns Pune by default or exact match', () => {
    const pune = getDistrictWeather('pune');
    assert.equal(pune?.districtId, 'pune');
    assert.equal(pune?.temperatureCelsius, '28.5');

    const baramati = getDistrictWeather('baramati');
    assert.equal(baramati?.districtId, 'baramati');
  });

  it('isWeatherDataFresh validates freshness against asOf timestamp', () => {
    const pune = getDistrictWeather('pune')!;
    const freshAsOf = new Date('2026-08-22T10:00:00Z');
    assert.equal(isWeatherDataFresh(pune, freshAsOf, 24), true);

    const staleAsOf = new Date('2026-08-25T00:00:00Z');
    assert.equal(isWeatherDataFresh(pune, staleAsOf, 24), false);
  });

  it('getWorstWarningSeverity correctly ranks RED > ORANGE > YELLOW', () => {
    const pune = getDistrictWeather('pune')!;
    assert.equal(getWorstWarningSeverity(pune.warnings), 'YELLOW');

    const multiple = [
      { code: 'W1', severity: 'YELLOW' as const, titleKey: 't1', instructionKey: 'i1' },
      { code: 'W2', severity: 'RED' as const, titleKey: 't2', instructionKey: 'i2' },
      { code: 'W3', severity: 'ORANGE' as const, titleKey: 't3', instructionKey: 'i3' },
    ];
    assert.equal(getWorstWarningSeverity(multiple), 'RED');
    assert.equal(getWorstWarningSeverity([]), null);
  });

  it('getRainfallIntensity categorizes rain ranges correctly', () => {
    assert.equal(getRainfallIntensity('0.0'), 'NONE');
    assert.equal(getRainfallIntensity('5.2'), 'LIGHT');
    assert.equal(getRainfallIntensity('18.4'), 'MODERATE');
    assert.equal(getRainfallIntensity('45.0'), 'HEAVY');
  });
});

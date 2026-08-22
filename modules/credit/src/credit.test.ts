import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateKccLimit } from './index.js';

describe('modules/credit', () => {
  it('calculates the illustrative KCC limit entirely in integer paise', () => {
    assert.equal(calculateKccLimit({ SOYBEAN: 5_000, PIGEON_PEA: 1_750 }), 15_750_001);
    assert.ok(Number.isInteger(calculateKccLimit({ SOYBEAN: 5_000 })));
  });

  it('rejects fractional area units', () => {
    assert.throws(() => calculateKccLimit({ SOYBEAN: 0.5 }));
  });
});

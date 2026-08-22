import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { allocateCultivableArea } from './index.js';

describe('modules/land-records', () => {
  it('allocates only the joint owner share using integer area units', () => {
    assert.equal(allocateCultivableArea(13_500, 1, 2), 6_750);
    assert.equal(allocateCultivableArea(20_000, 1, 1), 20_000);
  });

  it('rejects invalid ownership fractions', () => {
    assert.throws(() => allocateCultivableArea(10_000, 2, 1));
    assert.throws(() => allocateCultivableArea(10_000, 0, 1));
  });
});

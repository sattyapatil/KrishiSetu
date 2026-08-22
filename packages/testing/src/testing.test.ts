import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SYNTHETIC_DEMO_FARMERS, isAllowlistedFarmerId } from './index';

describe('packages/testing', () => {
  it('SYNTHETIC_DEMO_FARMERS defines allowlisted personas with synthetic: true', () => {
    assert.equal(SYNTHETIC_DEMO_FARMERS.length, 3);
    for (const farmer of SYNTHETIC_DEMO_FARMERS) {
      assert.equal(farmer.synthetic, true);
      assert.equal(farmer.demoPin, '2468');
      assert.ok(farmer.farmerId.startsWith('272026'));
      assert.ok(isAllowlistedFarmerId(farmer.farmerId));
    }
  });

  it('rejects unseeded Farmer IDs', () => {
    assert.equal(isAllowlistedFarmerId('27202699999999'), false);
    assert.equal(isAllowlistedFarmerId('12345678901234'), false);
  });
});

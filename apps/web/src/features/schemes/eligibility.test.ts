import assert from 'node:assert/strict';
import test from 'node:test';
import { getDashboardViewModel } from '../dashboard/fixtures/dashboard-fixture.js';
import { evaluateSchemeEligibility } from './eligibility.js';
import { getSchemeById } from './fixtures.js';

function requireScheme(id: string) {
  const scheme = getSchemeById(id);
  assert.ok(scheme);
  return scheme;
}

test('Namdev is not eligible for Rotavator without an active sugarcane crop', () => {
  const result = evaluateSchemeEligibility(
    requireScheme('offering_rotavator_2026'),
    getDashboardViewModel('27202600000001')
  );

  assert.equal(result.eligible, false);
  assert.equal(result.outcome, 'INELIGIBLE');
  assert.equal(result.reasonKey, 'schemes.rotavatorCropRequirement');
});

test('Savitri is eligible for Rotavator with sufficient land, sugarcane, and sole ownership', () => {
  const result = evaluateSchemeEligibility(
    requireScheme('offering_rotavator_2026'),
    getDashboardViewModel('27202600000002')
  );

  assert.equal(result.eligible, true);
});

test('Namdev remains eligible for the drip irrigation subsidy', () => {
  const result = evaluateSchemeEligibility(
    requireScheme('offering_drip_2026'),
    getDashboardViewModel('27202600000001')
  );

  assert.equal(result.eligible, true);
});

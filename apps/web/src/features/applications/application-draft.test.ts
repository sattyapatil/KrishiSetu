import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EMPTY_APPLICATION_DRAFT,
  parseApplicationDraft,
  removeDraftOffering,
  startApplicationDraft,
} from './application-draft.js';

test('starting an application moves unique selections into a clean staged draft', () => {
  const draft = startApplicationDraft(['offering_drip_2026', 'offering_drip_2026']);
  assert.deepEqual(draft.offeringIds, ['offering_drip_2026']);
  assert.equal(draft.currentStep, 0);
  assert.equal(draft.profileFetched, false);
  assert.equal(draft.landFetched, false);
  assert.equal(draft.readinessFetched, false);
});

test('a resumable draft clamps invalid steps and ignores malformed offering IDs', () => {
  const draft = parseApplicationDraft(JSON.stringify({
    offeringIds: ['offering_kcc_2026', 12],
    currentStep: 99,
    profileFetched: true,
  }));
  assert.deepEqual(draft.offeringIds, ['offering_kcc_2026']);
  assert.equal(draft.currentStep, 4);
  assert.equal(draft.profileFetched, true);
});

test('removing the final offering creates an empty draft that can clear persisted state', () => {
  const draft = removeDraftOffering(startApplicationDraft(['offering_drip_2026']), 'offering_drip_2026');
  assert.deepEqual(draft.offeringIds, []);
  assert.notEqual(draft, EMPTY_APPLICATION_DRAFT);
});

import { InMemoryPrototypeJourneyAdapter } from '@krishisetu/testing';
import type { PrototypeJourneyAdapter } from '@krishisetu/testing';
import { ApiPrototypeJourneyAdapter } from './prototype-journey-adapter.js';

/**
 * The web shell depends only on this adapter interface. The deployed
 * hackathon experience deliberately uses browser-only synthetic state, while
 * the API adapter remains available for local and full-stack environments.
 */
export type JourneyAdapterMode = 'browser-demo' | 'api';

export function createJourneyAdapter(mode: JourneyAdapterMode): PrototypeJourneyAdapter {
  if (mode === 'api') {
    return new ApiPrototypeJourneyAdapter();
  }

  return new InMemoryPrototypeJourneyAdapter();
}

/**
 * Default for the public hackathon deployment: no network request is made to
 * the backend. State exists only for the current browser session.
 */
export const defaultJourneyAdapter = createJourneyAdapter('browser-demo');

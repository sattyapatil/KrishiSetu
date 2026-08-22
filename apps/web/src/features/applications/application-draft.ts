export interface ApplicationDraft {
  readonly offeringIds: readonly string[];
  readonly currentStep: number;
  readonly profileFetched: boolean;
  readonly landFetched: boolean;
  readonly readinessFetched: boolean;
}

export const APPLICATION_DRAFT_STORAGE_KEY = 'ks_application_draft';

export const EMPTY_APPLICATION_DRAFT: ApplicationDraft = {
  offeringIds: [],
  currentStep: 0,
  profileFetched: false,
  landFetched: false,
  readinessFetched: false,
};

export function parseApplicationDraft(serialized: string | null): ApplicationDraft {
  if (!serialized) return EMPTY_APPLICATION_DRAFT;
  try {
    const parsed = JSON.parse(serialized) as Partial<ApplicationDraft>;
    if (!Array.isArray(parsed.offeringIds)) return EMPTY_APPLICATION_DRAFT;
    return {
      offeringIds: parsed.offeringIds.filter((value): value is string => typeof value === 'string'),
      currentStep: Math.min(4, Math.max(0, Number(parsed.currentStep ?? 0))),
      profileFetched: Boolean(parsed.profileFetched),
      landFetched: Boolean(parsed.landFetched),
      readinessFetched: Boolean(parsed.readinessFetched),
    };
  } catch {
    return EMPTY_APPLICATION_DRAFT;
  }
}

export function startApplicationDraft(offeringIds: readonly string[]): ApplicationDraft {
  return { ...EMPTY_APPLICATION_DRAFT, offeringIds: [...new Set(offeringIds)] };
}

export function removeDraftOffering(
  draft: ApplicationDraft,
  offeringId: string
): ApplicationDraft {
  return { ...draft, offeringIds: draft.offeringIds.filter((id) => id !== offeringId) };
}

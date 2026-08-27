'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  formatCurrencyFromPaise,
  formatHectares,
  formatLocalizedDate,
  formatNumber,
  type Locale,
  translate,
} from '@krishisetu/i18n';
import { Button, Checkbox, StatusBadge } from '@krishisetu/design-system';
import { consentPurposes } from '@krishisetu/policy';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';
import { getSchemeById, type SchemeDetailItem } from '../schemes/fixtures.js';
import { evaluateSchemeEligibility } from '../schemes/eligibility.js';
import { getDashboardViewModel } from '../dashboard/fixtures/dashboard-fixture.js';
import { mapDashboardApiToViewModel } from '../dashboard/dashboard-api-mapper.js';
import { downloadSyntheticSevenTwelve } from '../land-records/download-synthetic-seven-twelve.js';
import {
  APPLICATION_DRAFT_STORAGE_KEY,
  EMPTY_APPLICATION_DRAFT,
  parseApplicationDraft,
  removeDraftOffering,
  startApplicationDraft,
  type ApplicationDraft,
} from './application-draft.js';
import styles from './ApplicationReviewView.module.css';

export interface ApplicationReviewViewProps {
  readonly locale: Locale;
}

type FetchDomain = 'profile' | 'land' | 'readiness';

const STEP_KEYS = [
  'applications.stepSelectLabel',
  'applications.stepFarmerLabel',
  'applications.stepLandLabel',
  'applications.stepReadinessLabel',
  'applications.stepReviewLabel',
] as const;

function readDraft(): ApplicationDraft {
  if (typeof window === 'undefined') return EMPTY_APPLICATION_DRAFT;
  return parseApplicationDraft(window.sessionStorage.getItem(APPLICATION_DRAFT_STORAGE_KEY));
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function ApplicationReviewView({ locale }: ApplicationReviewViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
  const router = useRouter();
  const {
    session,
    selectedOfferings,
    clearOfferings,
    dashboardSnapshot,
    reducedMotion,
    submitBundle,
  } = useJourney();
  const [draft, setDraft] = useState<ApplicationDraft>(EMPTY_APPLICATION_DRAFT);
  const [draftReady, setDraftReady] = useState(false);
  const [fetching, setFetching] = useState<FetchDomain | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [dispatchAllowed, setDispatchAllowed] = useState(false);
  const [prototypeAcknowledged, setPrototypeAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const farmerId = session?.farmerId ?? '27202600000001';
  const viewModel = dashboardSnapshot
    ? mapDashboardApiToViewModel({
        model: dashboardSnapshot,
        farmerId,
        locale,
        activeScopes: session?.dashboardConsentScopes ?? [],
      })
    : getDashboardViewModel(farmerId);

  useEffect(() => {
    setDraft(readDraft());
    setDraftReady(true);
  }, []);

  useEffect(() => {
    if (selectedOfferings.size === 0) return;
    const incoming = [...selectedOfferings];
    setDraft((current) => {
      const unchanged =
        current.offeringIds.length === incoming.length &&
        current.offeringIds.every((id) => incoming.includes(id));
      if (unchanged) return current;
      return startApplicationDraft(incoming);
    });
    setDraftReady(true);
    clearOfferings();
  }, [selectedOfferings, clearOfferings]);

  useEffect(() => {
    if (!draftReady) return;
    try {
      if (draft.offeringIds.length === 0) {
        window.sessionStorage.removeItem(APPLICATION_DRAFT_STORAGE_KEY);
        return;
      }
      window.sessionStorage.setItem(APPLICATION_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // The resumable draft is a browser convenience; in-memory progress remains available.
    }
  }, [draft, draftReady]);

  const selectedList = useMemo(
    () =>
      draft.offeringIds
        .map((id) => getSchemeById(id))
        .filter((scheme): scheme is SchemeDetailItem => scheme !== undefined)
        .map((scheme) => ({
          ...scheme,
          estimatedBenefitPaise:
            scheme.domain === 'ULI'
              ? viewModel.credit.find((offering) => offering.id === scheme.id)?.estimatedLimitPaise ??
                scheme.estimatedBenefitPaise
              : viewModel.schemes.find((offering) => offering.id === scheme.id)?.estimatedBenefitPaise ??
                scheme.estimatedBenefitPaise,
        })),
    [draft.offeringIds, viewModel.credit, viewModel.schemes]
  );

  const localizeDataKey = (value: string) => (value.includes('.') ? t(value) : value);

  const invalidSelection = selectedList
    .map((scheme) => ({ scheme, decision: evaluateSchemeEligibility(scheme, viewModel, dashboardSnapshot) }))
    .find(({ decision }) => !decision.eligible);

  const updateDraft = (patch: Partial<ApplicationDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrorKey(null);
  };

  const fetchDomain = async (domain: FetchDomain) => {
    setFetching(domain);
    setErrorKey(null);
    await delay(reducedMotion ? 50 : 750);
    if (domain === 'profile') updateDraft({ profileFetched: true });
    if (domain === 'land') updateDraft({ landFetched: true });
    if (domain === 'readiness') updateDraft({ readinessFetched: true });
    setFetching(null);
  };

  const removeOffering = (offeringId: string) => {
    setDraft((current) => removeDraftOffering(current, offeringId));
    setErrorKey(null);
  };

  const goToStep = (step: number) => updateDraft({ currentStep: step });

  const continueEnabled =
    (draft.currentStep === 0 && selectedList.length > 0) ||
    (draft.currentStep === 1 && draft.profileFetched) ||
    (draft.currentStep === 2 && draft.landFetched) ||
    (draft.currentStep === 3 && draft.readinessFetched);

  const goForward = () => {
    if (!continueEnabled || draft.currentStep >= 4) return;
    goToStep(draft.currentStep + 1);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleDownload = () => {
    downloadSyntheticSevenTwelve({
      farmerIdMasked: `••••••••••${farmerId.slice(-4)}`,
      farmerName: viewModel.farmer.name,
      generatedAt: formatLocalizedDate(viewModel.generatedAt, locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      totalCultivableShareHectares: formatHectares(
        viewModel.farmer.landHoldingsHectares,
        locale
      ),
      holdings: viewModel.landHoldings,
      labels: {
        documentTitle: t('land.syntheticExtractTitle'),
        prototypeNotice: t('land.syntheticExtractNotice'),
        farmerName: t('applications.fieldFarmerName'),
        farmerId: t('auth.farmerIdLabel'),
        generatedAt: t('dashboard.generatedAt'),
        totalArea: t('land.totalArea'),
        holding: t('land.holding'),
        surveyNumber: t('land.surveyNumber'),
        ulpin: t('land.ulpin'),
        village: t('land.village'),
        ownership: t('land.ownership'),
        allocatedShare: t('land.allocatedShare'),
        encumbrance: t('land.encumbrance'),
        yes: t('common.yes'),
        no: t('common.no'),
      },
    });
  };

  const handleSubmit = async () => {
    if (invalidSelection) {
      setErrorKey(invalidSelection.decision.reasonKey ?? 'schemes.providerEligibilityRequirementNotMet');
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    if (!reviewed || !dispatchAllowed || !prototypeAcknowledged) {
      setErrorKey('applications.reviewValidationError');
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setSubmitting(true);
    setErrorKey(null);
    const result = await submitBundle(
      true,
      [...consentPurposes.MULTI_SCHEME_APPLICATION.requiredScopes],
      undefined,
      draft.offeringIds
    );
    if (result.success && result.bundle) {
      try { window.sessionStorage.removeItem(APPLICATION_DRAFT_STORAGE_KEY); } catch {}
      router.push(`/${locale}/applications/${result.bundle.bundleId}`);
      return;
    }
    setSubmitting(false);
    setErrorKey(result.errorMessageKey ?? 'applications.submissionUnavailable');
    window.setTimeout(() => errorRef.current?.focus(), 0);
  };

  const renderFetchPanel = (
    domain: FetchDomain,
    sourceKey: string,
    explanationKey: string,
    fetchLabelKey: string,
    fetchingLabelKey: string
  ) => (
    <div className={styles.fetchPanel}>
      <div className={styles.sourceBadge}>{t(sourceKey)}</div>
      {fetching === domain ? (
        <div role="status" aria-live="polite">
          <div className={styles.loader} aria-hidden="true" />
          <strong>{t(fetchingLabelKey)}</strong>
          <p>{t('applications.fetchingSecurely')}</p>
        </div>
      ) : (
        <>
          <p>{t(explanationKey)}</p>
          <Button variant="secondary" size="lg" onClick={() => void fetchDomain(domain)}>
            {t(fetchLabelKey)}
          </Button>
        </>
      )}
    </div>
  );

  if (!draftReady) {
    return (
      <div className={styles.container} role="status" aria-live="polite">
        <h1 className={styles.title}>{t('applications.wizardTitle')}</h1>
        <p className={styles.panelDescription}>{t('common.loading')}</p>
      </div>
    );
  }

  if (selectedList.length === 0 && draft.offeringIds.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.panel}>
          <h1 className={styles.title}>{t('applications.emptyDraftTitle')}</h1>
          <p className={styles.panelDescription}>{t('applications.emptyDraftDescription')}</p>
          <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">{t('schemes.pageTitle')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href={`/${locale}/dashboard`}>
        <ArrowLeftIcon size={18} aria-hidden={true} />
        {t('common.returnHome')}
      </Link>

      <h1 className={styles.title}>{t('applications.wizardTitle')}</h1>
      <p className={styles.subtitle}>{t('applications.wizardSubtitle')}</p>

      <ol className={styles.stepper} aria-label={t('applications.progressLabel')}>
        {STEP_KEYS.map((labelKey, index) => {
          const isCurrent = draft.currentStep === index;
          const isComplete = draft.currentStep > index;
          const className = [
            styles.step,
            isCurrent ? styles.stepCurrent : '',
            isComplete ? styles.stepComplete : '',
          ].filter(Boolean).join(' ');
          return (
            <li
              key={labelKey}
              className={className}
              data-step={formatNumber(index + 1, locale)}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className={styles.stepLabel}>{t(labelKey)}</span>
              <span className={styles.srOnly}>
                {isComplete
                  ? t('applications.stepCompleted')
                  : isCurrent
                    ? t('applications.stepCurrent')
                    : t('applications.stepPending')}
              </span>
            </li>
          );
        })}
      </ol>

      <p className={styles.stepCaption}>
        {t('applications.stepOf', {
          current: formatNumber(draft.currentStep + 1, locale),
          total: formatNumber(STEP_KEYS.length, locale),
        })}
      </p>

      <section className={styles.panel} aria-labelledby={`application-step-${draft.currentStep}`}>
        {draft.currentStep === 0 && (
          <>
            <h2 id="application-step-0" className={styles.panelTitle}>
              {t('applications.selectStepTitle')}
            </h2>
            <p className={styles.panelDescription}>{t('applications.selectStepDescription')}</p>
            <div className={styles.selectionList}>
              {selectedList.map((scheme) => (
                <article key={scheme.id} className={styles.selectionCard}>
                  <div>
                    <h3 className={styles.selectionTitle}>{t(scheme.titleKey)}</h3>
                    <p className={styles.selectionMeta}>
                      {scheme.domain === 'ULI' ? t('credit.sourceUli') : t('schemes.sourceMahadbt')}
                      {' • '}
                      {formatCurrencyFromPaise(scheme.estimatedBenefitPaise, locale)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeOffering(scheme.id)}
                  >
                    {t('schemes.removeOffering')}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {draft.currentStep === 1 && (
          <>
            <h2 id="application-step-1" className={styles.panelTitle}>
              {t('applications.farmerStepTitle')}
            </h2>
            <p className={styles.panelDescription}>{t('applications.farmerStepDescription')}</p>
            {!draft.profileFetched ? (
              renderFetchPanel(
                'profile',
                'applications.sourceFarmerRegistry',
                'applications.profileFetchExplanation',
                'applications.fetchProfile',
                'applications.fetchingProfile'
              )
            ) : (
              <>
                <div className={styles.sourceBadge}>
                  <CheckIcon size={16} aria-hidden={true} />
                  {t('applications.profileFetched')}
                </div>
                <dl className={styles.detailsGrid}>
                  <div className={styles.detail}>
                    <dt>{t('applications.fieldFarmerName')}</dt>
                    <dd>{viewModel.farmer.name}</dd>
                  </div>
                  <div className={styles.detail}>
                    <dt>{t('auth.farmerIdLabel')}</dt>
                    <dd>••••••••••{farmerId.slice(-4)}</dd>
                  </div>
                  <div className={styles.detail}>
                    <dt>{t('land.village')}</dt>
                    <dd>{localizeDataKey(viewModel.farmer.villageKey)}</dd>
                  </div>
                  <div className={styles.detail}>
                    <dt>{t('applications.fieldTaluka')}</dt>
                    <dd>{localizeDataKey(viewModel.farmer.talukaKey)}</dd>
                  </div>
                </dl>
                <p className={styles.maskedNotice}>{t('applications.maskedDataNotice')}</p>
              </>
            )}
          </>
        )}

        {draft.currentStep === 2 && (
          <>
            <h2 id="application-step-2" className={styles.panelTitle}>
              {t('applications.landStepTitle')}
            </h2>
            <p className={styles.panelDescription}>{t('applications.landStepDescription')}</p>
            {!draft.landFetched ? (
              renderFetchPanel(
                'land',
                'applications.sourceLandCropRegistry',
                'applications.landFetchExplanation',
                'applications.fetchLandCrops',
                'applications.fetchingLandCrops'
              )
            ) : (
              <>
                <div className={styles.sourceBadge}>
                  <CheckIcon size={16} aria-hidden={true} />
                  {t('applications.landFetched')}
                </div>
                {viewModel.landHoldings.map((holding, index) => (
                  <article className={styles.holding} key={`${holding.surveyNumber}-${index}`}>
                    <h3 className={styles.holdingTitle}>
                      {t('land.holding')} {formatNumber(index + 1, locale)}
                    </h3>
                    <dl className={styles.detailsGrid}>
                      <div className={styles.detail}>
                        <dt>{t('land.surveyNumber')}</dt>
                        <dd>{holding.surveyNumber}</dd>
                      </div>
                      <div className={styles.detail}>
                        <dt>{t('land.ulpin')}</dt>
                        <dd>{holding.ulpinMasked}</dd>
                      </div>
                      <div className={styles.detail}>
                        <dt>{t('land.ownership')}</dt>
                        <dd>{holding.shareLabel}</dd>
                      </div>
                      <div className={styles.detail}>
                        <dt>{t('land.allocatedShare')}</dt>
                        <dd>{formatHectares(holding.allocatedCultivableHectares, locale)}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
                <article className={styles.holding}>
                  <h3 className={styles.holdingTitle}>{t('applications.cropDetailsTitle')}</h3>
                  <dl className={styles.detailsGrid}>
                    {viewModel.cropRecords.map((crop) => (
                      <div className={styles.detail} key={crop.code}>
                        <dt>{t(crop.nameKey)}</dt>
                        <dd>
                          {formatHectares(crop.areaHectares, locale)} • {crop.season} {crop.year}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
                <p className={styles.maskedNotice}>{t('applications.maskedDataNotice')}</p>
                <button type="button" className={styles.downloadButton} onClick={handleDownload}>
                  {t('land.downloadSyntheticExtract')}
                </button>
              </>
            )}
          </>
        )}

        {draft.currentStep === 3 && (
          <>
            <h2 id="application-step-3" className={styles.panelTitle}>
              {t('applications.readinessStepTitle')}
            </h2>
            <p className={styles.panelDescription}>{t('applications.readinessStepDescription')}</p>
            {!draft.readinessFetched ? (
              renderFetchPanel(
                'readiness',
                'applications.sourceReadinessAdapters',
                'applications.readinessFetchExplanation',
                'applications.fetchReadiness',
                'applications.fetchingReadiness'
              )
            ) : (
              <>
                <div className={styles.sourceBadge}>
                  <CheckIcon size={16} aria-hidden={true} />
                  {t('applications.readinessFetched')}
                </div>
                <dl className={styles.detailsGrid}>
                  <div className={styles.detail}>
                    <dt>{t('applications.fieldBankName')}</dt>
                    <dd>{viewModel.farmer.bankName}</dd>
                  </div>
                  <div className={styles.detail}>
                    <dt>{t('applications.fieldBankAccount')}</dt>
                    <dd>{viewModel.farmer.maskedAccount}</dd>
                  </div>
                  <div className={styles.detail}>
                    <dt>{t('applications.fieldBenefitReadiness')}</dt>
                    <dd><StatusBadge status="ready" label={t('common.ready')} /></dd>
                  </div>
                  <div className={styles.detail}>
                    <dt>{t('applications.fieldSelectedServices')}</dt>
                    <dd>{formatNumber(selectedList.length, locale)}</dd>
                  </div>
                </dl>
                <p className={styles.maskedNotice}>{t('applications.readinessDisclaimer')}</p>
              </>
            )}
          </>
        )}

        {draft.currentStep === 4 && (
          <>
            <h2 id="application-step-4" className={styles.panelTitle}>
              {t('applications.reviewStepTitle')}
            </h2>
            <p className={styles.panelDescription}>{t('applications.reviewStepDescription')}</p>

            {invalidSelection && !errorKey && (
              <div className={styles.errorSummary} role="alert">
                <strong>{t('schemes.eligibilityChangedTitle')}</strong>
                <p style={{ marginBottom: 0 }}>
                  {t(invalidSelection.decision.reasonKey ?? 'schemes.providerEligibilityRequirementNotMet')}
                </p>
              </div>
            )}

            {errorKey && (
              <div className={styles.errorSummary} role="alert" tabIndex={-1} ref={errorRef}>
                <strong>{t(errorKey.startsWith('schemes.') ? 'schemes.eligibilityChangedTitle' : 'applications.reviewErrorTitle')}</strong>
                <p style={{ marginBottom: 0 }}>{t(errorKey)}</p>
              </div>
            )}

            <div className={styles.reviewStack}>
              <section className={styles.reviewSection}>
                <div className={styles.reviewHeader}>
                  <h3 className={styles.reviewTitle}>{t('applications.selectedServicesTitle', { count: selectedList.length })}</h3>
                  <button type="button" className={styles.changeButton} onClick={() => goToStep(0)}>
                    {t('applications.changeSection')}
                  </button>
                </div>
                {selectedList.map((scheme) => (
                  <p key={scheme.id}>{t(scheme.titleKey)} — {formatCurrencyFromPaise(scheme.estimatedBenefitPaise, locale)}</p>
                ))}
              </section>

              <section className={styles.reviewSection}>
                <div className={styles.reviewHeader}>
                  <h3 className={styles.reviewTitle}>{t('applications.farmerDetailsTitle')}</h3>
                  <button type="button" className={styles.changeButton} onClick={() => goToStep(1)}>
                    {t('applications.changeSection')}
                  </button>
                </div>
                <p>{viewModel.farmer.name} • ••••••••••{farmerId.slice(-4)} • {localizeDataKey(viewModel.farmer.villageKey)}</p>
              </section>

              <section className={styles.reviewSection}>
                <div className={styles.reviewHeader}>
                  <h3 className={styles.reviewTitle}>{t('applications.landDetailsTitle')} &amp; {t('applications.cropDetailsTitle')}</h3>
                  <button type="button" className={styles.changeButton} onClick={() => goToStep(2)}>
                    {t('applications.changeSection')}
                  </button>
                </div>
                <p>
                  {formatHectares(viewModel.farmer.landHoldingsHectares, locale)} • {' '}
                  {formatNumber(viewModel.cropRecords.length, locale)} {t('applications.fieldCrops')}
                </p>
              </section>

              <section className={styles.reviewSection}>
                <div className={styles.reviewHeader}>
                  <h3 className={styles.reviewTitle}>{t('applications.bankDetailsTitle')}</h3>
                  <button type="button" className={styles.changeButton} onClick={() => goToStep(3)}>
                    {t('applications.changeSection')}
                  </button>
                </div>
                <p>{viewModel.farmer.bankName} • {viewModel.farmer.maskedAccount}</p>
              </section>
            </div>

            <section className={styles.consentBox} aria-labelledby="application-consent-heading">
              <h3 id="application-consent-heading">{t('applications.applicationConsentTitle')}</h3>
              <p>{t('applications.applicationConsentDescription')}</p>
              <div className={styles.checkboxes}>
                <Checkbox
                  id="application-reviewed"
                  label={t('applications.declarationAcknowledge')}
                  checked={reviewed}
                  onChange={() => setReviewed((value) => !value)}
                />
                <Checkbox
                  id="application-dispatch-consent"
                  label={t('applications.dispatchConsentLabel')}
                  description={t('applications.dispatchConsentDescription')}
                  checked={dispatchAllowed}
                  onChange={() => setDispatchAllowed((value) => !value)}
                />
                <Checkbox
                  id="application-prototype-acknowledgement"
                  label={t('applications.declarationPrototypeAck')}
                  checked={prototypeAcknowledged}
                  onChange={() => setPrototypeAcknowledged((value) => !value)}
                />
              </div>
            </section>
          </>
        )}

        <div className={styles.actions}>
          {draft.currentStep > 0 ? (
            <Button variant="outline" size="lg" onClick={() => goToStep(draft.currentStep - 1)} disabled={submitting}>
              <ArrowLeftIcon size={18} aria-hidden={true} />
              {t('common.back')}
            </Button>
          ) : (
            <Link href={`/${locale}/schemes`} style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg">{t('applications.changeSection')}</Button>
            </Link>
          )}

          {draft.currentStep < 4 ? (
            <Button
              variant="primary"
              size="lg"
              disabled={!continueEnabled || fetching !== null}
              onClick={goForward}
            >
              {t('common.continue')}
              <ArrowRightIcon size={18} aria-hidden={true} />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              isLoading={submitting}
              disabled={Boolean(invalidSelection)}
              loadingText={t('applications.submissionInProgress')}
              onClick={() => void handleSubmit()}
            >
              {t('applications.submitButton', { count: selectedList.length })}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

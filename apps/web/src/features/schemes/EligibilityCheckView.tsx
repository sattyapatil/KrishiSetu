'use client';

import React from 'react';
import Link from 'next/link';
import type { Locale } from '@krishisetu/i18n';
import { translate } from '@krishisetu/i18n';
import { AlertCircleIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, LockIcon } from '../../components/icons.js';
import { useJourney } from '../journey/index.js';
import { APPLICATION_DRAFT_STORAGE_KEY, type ApplicationDraft } from '../applications/application-draft.js';
import { getSchemeById, type SchemeDetailItem } from './fixtures.js';
import { getDashboardViewModel } from '../dashboard/fixtures/dashboard-fixture.js';
import { mapDashboardApiToViewModel } from '../dashboard/dashboard-api-mapper.js';
import { evaluateSchemeEligibility } from './eligibility.js';
import styles from './EligibilityCheckView.module.css';

export interface EligibilityCheckViewProps { readonly locale: Locale; }

export function EligibilityCheckView({ locale }: EligibilityCheckViewProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) => translate(key, locale, params);
  const { selectedOfferings, reducedMotion, session, dashboardSnapshot } = useJourney();
  const [state, setState] = React.useState<'READY' | 'CHECKING' | 'COMPLETE'>('READY');
  const [activeRecord, setActiveRecord] = React.useState(-1);
  const [checkedRecords, setCheckedRecords] = React.useState(0);
  const selected = [...selectedOfferings]
    .map((id) => getSchemeById(id))
    .filter((item): item is SchemeDetailItem => Boolean(item));

  const farmerId = session?.farmerId ?? '27202600000001';
  const viewModel = dashboardSnapshot
    ? mapDashboardApiToViewModel({
        model: dashboardSnapshot,
        farmerId,
        locale,
        activeScopes: session?.dashboardConsentScopes ?? [],
      })
    : getDashboardViewModel(farmerId);

  const recordChecks = {
    identity: Boolean(viewModel.farmer.id && viewModel.farmer.name),
    land: viewModel.farmer.verifiedLand && Number(viewModel.farmer.landHoldingsHectares) > 0,
    crop: viewModel.farmer.verifiedCrops && viewModel.farmer.cropCount > 0,
    bank: viewModel.farmer.bankMapped,
  };
  const eligibilityResults = selected.map((item) => ({
    item,
    ...evaluateSchemeEligibility(item, viewModel, dashboardSnapshot),
  }));

  const runEligibilityCheck = async () => {
    setState('CHECKING');
    setCheckedRecords(0);

    for (let index = 0; index < 4; index += 1) {
      setActiveRecord(index);
      await new Promise<void>((resolve) => window.setTimeout(resolve, reducedMotion ? 80 : 700));
      setCheckedRecords(index + 1);
    }

    setActiveRecord(-1);
    if (allEligible) {
      const draft: ApplicationDraft = {
        offeringIds: selected.map((item) => item.id),
        currentStep: 4,
        profileFetched: true,
        landFetched: true,
        readinessFetched: true,
      };
      try { window.sessionStorage.setItem(APPLICATION_DRAFT_STORAGE_KEY, JSON.stringify(draft)); } catch {}
    }
    setState('COMPLETE');
  };

  if (selected.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>?</div>
          <h1>{t('schemes.noSelectionTitle')}</h1>
          <p>{t('schemes.noSelectionDesc')}</p>
          <Link className={styles.primaryButton} href={`/${locale}/schemes`}>
            <ArrowLeftIcon size={18} aria-hidden={true} /> {t('schemes.backToSchemes')}
          </Link>
        </div>
      </main>
    );
  }

  const records = [
    ['schemes.identityRecord', 'Aadhaar-linked farmer ID', recordChecks.identity],
    ['schemes.landRecord', 'Mahabhumi 7/12', recordChecks.land],
    ['schemes.cropRecord', 'Digital Crop Survey', recordChecks.crop],
    ['schemes.bankRecord', 'DBT bank mapping', recordChecks.bank],
  ] as const;
  const allEligible = eligibilityResults.every((result) => result.eligible);

  return (
    <main className={styles.page}>
      <Link className={styles.back} href={`/${locale}/schemes`}><ArrowLeftIcon size={17} aria-hidden={true} /> {t('schemes.changeSelection')}</Link>
      <header className={styles.header}>
        <span className={styles.lockIcon}><LockIcon size={26} aria-hidden={true} /></span>
        <div>
          <p className={styles.eyebrow}>PRE-APPLICATION CHECK</p>
          <h1>{t('schemes.eligibilityCheckTitle')}</h1>
          <p>{t('schemes.eligibilityCheckSubtitle')}</p>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <span>1</span><div><h2>{t('schemes.selectedPrograms')}</h2><p>{selected.length} {t('schemes.matchedPrograms')}</p></div>
          </div>
          <div className={styles.programs}>
            {eligibilityResults.map(({ item, eligible, reasonKey }) => (
              <div className={`${styles.program} ${state === 'COMPLETE' ? (eligible ? styles.eligibleProgram : styles.ineligibleProgram) : ''}`} key={item.id}>
                <span>{item.domain === 'MAHADBT' ? t('schemes.subsidyType') : t('schemes.creditType')}</span>
                <strong>{t(item.titleKey)}</strong>
                {state === 'READY' && <em className={styles.needsCheck}>{t('schemes.needsCheck')}</em>}
                {state === 'CHECKING' && <em className={styles.checkingProgram}><span className={styles.miniSpinner} aria-hidden="true" /> {t('schemes.checkInProgress')}</em>}
                {state === 'COMPLETE' && (
                  <>
                    <em>
                      {eligible ? <CheckIcon size={15} aria-hidden={true} /> : <AlertCircleIcon size={15} aria-hidden={true} />}
                      {eligible ? t('schemes.eligible') : t('schemes.notEligible')}
                    </em>
                    {!eligible && reasonKey && <small className={styles.eligibilityReason}>{t(reasonKey)}</small>}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <span>2</span><div><h2>{t('schemes.recordsChecked')}</h2><p>{t('schemes.consentNote')}</p></div>
          </div>
          <div className={styles.records}>
            {records.map(([label, source, passed], index) => {
              const isFetching = state === 'CHECKING' && activeRecord === index;
              const isFetched = state === 'COMPLETE' || checkedRecords > index;
              const status = state === 'READY'
                ? t('schemes.needsCheck')
                : isFetching
                  ? t('schemes.fetching')
                  : isFetched
                    ? (state === 'COMPLETE' ? (passed ? t('schemes.verified') : t('schemes.notVerified')) : t('schemes.fetched'))
                    : t('schemes.waiting');

              return (
              <div className={`${styles.record} ${isFetching ? styles.fetchingRecord : ''} ${isFetched ? styles.fetchedRecord : ''}`} key={label} style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}>
                <span className={styles.recordCheck}>
                  {isFetching ? <span className={styles.spinner} aria-hidden="true" /> : isFetched ? (passed ? <CheckIcon size={16} aria-hidden={true} /> : <AlertCircleIcon size={16} aria-hidden={true} />) : index + 1}
                </span>
                <div><strong>{t(label)}</strong><small>{source}</small></div>
                <b>{status}</b>
              </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className={`${styles.result} ${state === 'COMPLETE' ? styles.complete : ''}`} aria-live="polite">
        {state === 'COMPLETE' ? (
          <>
            <span className={styles.resultIcon}><CheckIcon size={25} aria-hidden={true} /></span>
            <div><h2>{t('schemes.checkComplete')}</h2><p>{allEligible ? t('schemes.eligibleForAll') : t('schemes.notEligibleForSome')}</p></div>
            {allEligible ? (
              <Link className={styles.primaryButton} href={`/${locale}/applications/new/review`}>
                {t('schemes.proceedToApplication')} <ArrowRightIcon size={18} aria-hidden={true} />
              </Link>
            ) : (
              <Link className={styles.secondaryButton} href={`/${locale}/schemes`}>{t('schemes.changeSelection')}</Link>
            )}
          </>
        ) : (
          <>
            <span className={styles.resultIcon}>{state === 'CHECKING' ? <span className={styles.largeSpinner} aria-hidden="true" /> : <LockIcon size={23} aria-hidden={true} />}</span>
            <div>
              <h2>{state === 'CHECKING' && activeRecord >= 0 ? t('schemes.fetchingRecord', { record: t(records[activeRecord]![0]) }) : t('schemes.runCheck')}</h2>
              <p>{state === 'CHECKING' ? t('schemes.fetchProgress', { current: checkedRecords + 1, total: records.length }) : t('schemes.consentNote')}</p>
              {state === 'CHECKING' && <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${(checkedRecords / records.length) * 100}%` }} /></div>}
            </div>
            <button className={styles.primaryButton} type="button" disabled={state === 'CHECKING'} onClick={() => void runEligibilityCheck()}>
              {state === 'CHECKING' ? t('schemes.checking') : t('schemes.runCheck')} <ArrowRightIcon size={18} aria-hidden={true} />
            </button>
          </>
        )}
      </section>
    </main>
  );
}

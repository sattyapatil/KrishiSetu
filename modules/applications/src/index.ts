import { createHash } from 'node:crypto';
import type { Clock, EventPublisher, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface ChildApplicationReceipt {
  readonly childId: string;
  readonly domain: 'MAHADBT' | 'ULI';
  readonly schemeCode: string;
  readonly offeringId?: string;
  readonly status: 'QUEUED' | 'ACCEPTED_MOCK' | 'FAILED_RETRYABLE' | 'REJECTED_MOCK';
  readonly providerReceipt?: string;
  readonly acceptedAt?: string;
  readonly nextStepKey?: string;
  readonly errorCode?: string;
  readonly messageKey?: string;
  readonly retryable?: boolean;
}

export interface ApplicationBundle {
  readonly bundleId: string;
  readonly status: 'QUEUED' | 'COMPLETED' | 'PARTIAL' | 'FAILED_RETRYABLE';
  readonly submittedAt: string;
  readonly idempotencyKey: string;
  readonly correlationId?: string;
  readonly consentId?: string;
  readonly children: readonly ChildApplicationReceipt[];
  readonly prototypeData: true;
}

export interface ApplicationSelection {
  readonly offeringId: string;
  readonly domain: 'MAHADBT' | 'ULI';
  readonly schemeCode: string;
}

export interface CreateBundleInput {
  readonly farmerId: string;
  readonly consentId: string;
  readonly correlationId: string;
  readonly idempotencyKey: string;
  readonly selections: readonly ApplicationSelection[];
  readonly declarations: {
    readonly reviewedPrefilledData: boolean;
    readonly understandsPrototype: boolean;
  };
}

export interface ApplicationPurgeCounts {
  readonly incompleteApplicationsDeleted: number;
  readonly completedReceiptsPseudonymized: number;
}

export interface ApplicationsService {
  submit(input: CreateBundleInput): Promise<ApplicationBundle>;
  get(bundleId: string, farmerId: string): ApplicationBundle | null;
  list(farmerId: string): readonly ApplicationBundle[];
  retry(bundleId: string, farmerId: string, correlationId: string): Promise<ApplicationBundle>;
  purgeByConsent(consentId: string): ApplicationPurgeCounts;
}

export const applicationsMigrations: readonly ModuleMigration[] = [
  {
    module: 'applications',
    version: 1,
    name: 'bundle saga, children, and idempotency',
    sql: `
      CREATE TABLE applications_bundles (
        bundle_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        consent_id TEXT NOT NULL,
        correlation_id TEXT NOT NULL,
        idempotency_key TEXT NOT NULL UNIQUE,
        request_hash TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('QUEUED', 'COMPLETED', 'PARTIAL', 'FAILED_RETRYABLE')),
        submitted_at TEXT NOT NULL
      ) STRICT;
      CREATE INDEX applications_bundles_owner_idx ON applications_bundles(farmer_id);
      CREATE INDEX applications_bundles_consent_idx ON applications_bundles(consent_id);
      CREATE TABLE applications_children (
        child_id TEXT PRIMARY KEY,
        bundle_id TEXT NOT NULL,
        domain TEXT NOT NULL CHECK (domain IN ('MAHADBT', 'ULI')),
        scheme_code TEXT NOT NULL,
        offering_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('QUEUED', 'ACCEPTED_MOCK', 'FAILED_RETRYABLE', 'REJECTED_MOCK')),
        provider_receipt TEXT,
        accepted_at TEXT,
        error_code TEXT,
        message_key TEXT,
        retryable INTEGER NOT NULL CHECK (retryable IN (0, 1)),
        UNIQUE (bundle_id, domain),
        FOREIGN KEY (bundle_id) REFERENCES applications_bundles(bundle_id) ON DELETE CASCADE
      ) STRICT;
    `,
  },
];

function requestHash(input: CreateBundleInput): string {
  const normalized = {
    farmerId: input.farmerId,
    consentId: input.consentId,
    selections: [...input.selections]
      .map((item) => ({
        offeringId: item.offeringId,
        domain: item.domain,
        schemeCode: item.schemeCode,
      }))
      .sort((left, right) => left.domain.localeCompare(right.domain)),
    declarations: input.declarations,
  };
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

export function createApplicationsService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
  events: EventPublisher;
  revalidate(input: {
    farmerId: string;
    consentId: string;
    correlationId: string;
  }): Promise<ReadonlySet<string>>;
  submitSubsidy(input: {
    farmerId: string;
    offeringId: string;
    consentId: string;
    correlationId: string;
  }): Promise<{ receipt: string; acceptedAt: string }>;
  submitCredit(input: {
    farmerId: string;
    offeringId: string;
    consentId: string;
    correlationId: string;
  }): Promise<{ receipt: string; acceptedAt: string }>;
}): ApplicationsService {
  const inFlight = new Map<string, { hash: string; promise: Promise<ApplicationBundle> }>();

  const mapBundle = (bundleId: string, farmerId: string): ApplicationBundle | null => {
    const bundle = input.database
      .prepare(
        `SELECT bundle_id AS bundleId, status, submitted_at AS submittedAt,
                idempotency_key AS idempotencyKey, correlation_id AS correlationId,
                consent_id AS consentId
         FROM applications_bundles WHERE bundle_id = ? AND farmer_id = ?`
      )
      .get(bundleId, farmerId) as Omit<ApplicationBundle, 'children' | 'prototypeData'> | undefined;
    if (!bundle) return null;
    const children = input.database
      .prepare(
        `SELECT child_id AS childId, domain, scheme_code AS schemeCode, offering_id AS offeringId,
                status, provider_receipt AS providerReceipt, accepted_at AS acceptedAt,
                error_code AS errorCode, message_key AS messageKey, retryable
         FROM applications_children WHERE bundle_id = ? ORDER BY domain`
      )
      .all(bundleId)
      .map((raw) => {
        const row = raw as Record<string, unknown>;
        return {
          childId: String(row.childId),
          domain: String(row.domain) as ChildApplicationReceipt['domain'],
          schemeCode: String(row.schemeCode),
          offeringId: String(row.offeringId),
          status: String(row.status) as ChildApplicationReceipt['status'],
          providerReceipt: row.providerReceipt ? String(row.providerReceipt) : undefined,
          acceptedAt: row.acceptedAt ? String(row.acceptedAt) : undefined,
          errorCode: row.errorCode ? String(row.errorCode) : undefined,
          messageKey: row.messageKey ? String(row.messageKey) : undefined,
          retryable: Boolean(row.retryable),
          nextStepKey:
            row.domain === 'MAHADBT'
              ? 'applications.mahadbt.mockScrutiny'
              : 'applications.uli.mockLenderReview',
        } satisfies ChildApplicationReceipt;
      });
    return { ...bundle, children, prototypeData: true };
  };

  const updateOverallStatus = (bundleId: string): void => {
    const rows = input.database
      .prepare('SELECT status FROM applications_children WHERE bundle_id = ?')
      .all(bundleId) as unknown as Array<{ status: ChildApplicationReceipt['status'] }>;
    const accepted = rows.filter((row) => row.status === 'ACCEPTED_MOCK').length;
    const status = accepted === rows.length
      ? 'COMPLETED'
      : accepted > 0
        ? 'PARTIAL'
        : 'FAILED_RETRYABLE';
    input.database
      .prepare('UPDATE applications_bundles SET status = ? WHERE bundle_id = ?')
      .run(status, bundleId);
  };

  const dispatchChild = async (
    bundleId: string,
    farmerId: string,
    consentId: string,
    correlationId: string,
    child: ApplicationSelection
  ): Promise<void> => {
    try {
      const receipt =
        child.domain === 'MAHADBT'
          ? await input.submitSubsidy({ farmerId, offeringId: child.offeringId, consentId, correlationId })
          : await input.submitCredit({ farmerId, offeringId: child.offeringId, consentId, correlationId });
      input.database
        .prepare(
          `UPDATE applications_children SET status = 'ACCEPTED_MOCK', provider_receipt = ?,
           accepted_at = ?, retryable = 0, error_code = NULL, message_key = NULL
           WHERE bundle_id = ? AND domain = ? AND status != 'ACCEPTED_MOCK'`
        )
        .run(receipt.receipt, receipt.acceptedAt, bundleId, child.domain);
    } catch (error) {
      const retryable = error instanceof Error && error.message === 'MOCK_PROVIDER_TIMEOUT';
      input.database
        .prepare(
          `UPDATE applications_children SET status = ?, retryable = ?, error_code = ?, message_key = ?
           WHERE bundle_id = ? AND domain = ? AND status != 'ACCEPTED_MOCK'`
        )
        .run(
          retryable ? 'FAILED_RETRYABLE' : 'REJECTED_MOCK',
          retryable ? 1 : 0,
          retryable ? 'MOCK_PROVIDER_TIMEOUT' : 'PROVIDER_REJECTED_MOCK',
          retryable ? 'applications.uli.retryLater' : 'applications.common.rejectedMock',
          bundleId,
          child.domain
        );
    }
  };

  const doSubmit = async (command: CreateBundleInput, hash: string): Promise<ApplicationBundle> => {
    if (
      !command.declarations.reviewedPrefilledData ||
      !command.declarations.understandsPrototype ||
      command.selections.length === 0 ||
      new Set(command.selections.map((item) => item.domain)).size !== command.selections.length
    ) {
      throw new Error('VALIDATION_ERROR');
    }
    const allowed = await input.revalidate({
      farmerId: command.farmerId,
      consentId: command.consentId,
      correlationId: command.correlationId,
    });
    if (command.selections.some((selection) => !allowed.has(selection.offeringId))) {
      throw new Error('VALIDATION_ERROR');
    }

    const existing = input.database
      .prepare(
        'SELECT bundle_id AS bundleId, request_hash AS requestHash FROM applications_bundles WHERE idempotency_key = ?'
      )
      .get(command.idempotencyKey) as { bundleId: string; requestHash: string } | undefined;
    if (existing) {
      if (existing.requestHash !== hash) throw new Error('IDEMPOTENCY_CONFLICT');
      const found = mapBundle(existing.bundleId, command.farmerId);
      if (!found) throw new Error('BUNDLE_NOT_FOUND');
      return found;
    }

    const bundleId = input.ids.nextPrefixedId('BND');
    input.database.transaction(() => {
      input.database
        .prepare(
          `INSERT INTO applications_bundles
           (bundle_id, farmer_id, consent_id, correlation_id, idempotency_key, request_hash, status, submitted_at)
           VALUES (?, ?, ?, ?, ?, ?, 'QUEUED', ?)`
        )
        .run(
          bundleId,
          command.farmerId,
          command.consentId,
          command.correlationId,
          command.idempotencyKey,
          hash,
          input.clock.isoString()
        );
      const insertChild = input.database.prepare(
        `INSERT INTO applications_children
         (child_id, bundle_id, domain, scheme_code, offering_id, status, retryable)
         VALUES (?, ?, ?, ?, ?, 'QUEUED', 0)`
      );
      for (const selection of command.selections) {
        insertChild.run(
          input.ids.nextPrefixedId('child'),
          bundleId,
          selection.domain,
          selection.schemeCode,
          selection.offeringId
        );
      }
    });

    await Promise.all(
      command.selections.map((selection) =>
        dispatchChild(
          bundleId,
          command.farmerId,
          command.consentId,
          command.correlationId,
          selection
        )
      )
    );
    updateOverallStatus(bundleId);
    const bundle = mapBundle(bundleId, command.farmerId)!;
    await input.events.publish({
      id: input.ids.nextUuid(),
      type:
        bundle.status === 'COMPLETED'
          ? 'application.bundle.completed.v1'
          : 'application.bundle.partial.v1',
      version: 1,
      occurredAt: input.clock.isoString(),
      correlationId: command.correlationId,
      producer: 'applications',
      payload: { bundleId, childCount: bundle.children.length, status: bundle.status },
    });
    return bundle;
  };

  const service: ApplicationsService = {
    submit: async (command) => {
      const hash = requestHash(command);
      const active = inFlight.get(command.idempotencyKey);
      if (active) {
        if (active.hash !== hash) throw new Error('IDEMPOTENCY_CONFLICT');
        return active.promise;
      }
      const promise = doSubmit(command, hash).finally(() => inFlight.delete(command.idempotencyKey));
      inFlight.set(command.idempotencyKey, { hash, promise });
      return promise;
    },
    get: mapBundle,
    list: (farmerId) => {
      const ids = input.database
        .prepare('SELECT bundle_id AS bundleId FROM applications_bundles WHERE farmer_id = ? ORDER BY submitted_at DESC')
        .all(farmerId) as unknown as Array<{ bundleId: string }>;
      return ids.map((row) => mapBundle(row.bundleId, farmerId)!).filter(Boolean);
    },
    retry: async (bundleId, farmerId, correlationId) => {
      const bundle = mapBundle(bundleId, farmerId);
      if (!bundle) throw new Error('BUNDLE_NOT_FOUND');
      const retryable = bundle.children.filter(
        (child) => child.status === 'FAILED_RETRYABLE' && child.retryable
      );
      await Promise.all(
        retryable.map((child) =>
          dispatchChild(bundleId, farmerId, bundle.consentId ?? '', correlationId, {
            ...child,
            offeringId: child.offeringId ?? child.schemeCode,
          })
        )
      );
      updateOverallStatus(bundleId);
      return mapBundle(bundleId, farmerId)!;
    },
    purgeByConsent: (consentId) =>
      input.database.transaction(() => {
        const pseudonymized = input.database
          .prepare(
            `UPDATE applications_children SET provider_receipt = NULL
             WHERE bundle_id IN (
               SELECT bundle_id FROM applications_bundles WHERE consent_id = ? AND status = 'COMPLETED'
             ) AND provider_receipt IS NOT NULL`
          )
          .run(consentId);
        const deleted = input.database
          .prepare(
            `DELETE FROM applications_bundles
             WHERE consent_id = ? AND status != 'COMPLETED'`
          )
          .run(consentId);
        return {
          incompleteApplicationsDeleted: Number(deleted.changes),
          completedReceiptsPseudonymized: Number(pseudonymized.changes),
        };
      }),
  };
  return service;
}

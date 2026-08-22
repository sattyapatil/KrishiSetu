import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { Clock, EventPublisher, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';
import {
  consentPurposes,
  consentScopes,
  type ConsentPurposeCode,
  type ConsentScopeCode,
} from '@krishisetu/policy';

export interface ConsentRecord {
  readonly consentId: string;
  readonly farmerId: string;
  readonly purposeCode: ConsentPurposeCode;
  readonly purposeVersion: string;
  readonly scopes: readonly ConsentScopeCode[];
  readonly status: 'GRANTED' | 'REVOKED' | 'EXPIRED';
  readonly grantedAt: string;
  readonly validUntil: string;
  readonly revokedAt?: string;
  readonly signature: {
    readonly format: 'JWS';
    readonly algorithm: 'HS256';
    readonly keyId: 'prototype-consent-2026-01';
    readonly verified: true;
  };
  readonly prototypeData: true;
}

export interface ConsentValidationResult {
  readonly ok: boolean;
  readonly code?:
    | 'CONSENT_REQUIRED'
    | 'CONSENT_REVOKED'
    | 'CONSENT_EXPIRED'
    | 'CONSENT_SCOPE_MISSING';
  readonly consent?: ConsentRecord;
  readonly missingScopes?: readonly string[];
}

export interface PurgeReceipt {
  readonly purgeJobId: string;
  readonly consentId: string;
  readonly status: 'COMPLETED';
  readonly processingStoppedAt: string;
  readonly categories: {
    readonly dashboardCachesDeleted: number;
    readonly normalizedSnapshotsDeleted: number;
    readonly draftBundlesDeleted: number;
    readonly incompleteApplicationsDeleted: number;
    readonly temporaryAttachmentsDeleted: number;
    readonly completedReceiptsPseudonymized: number;
    readonly sessionsInvalidated: number;
  };
  readonly sourceFixturesRetained: true;
  readonly sourceFixturesExplanationKey: 'privacy.syntheticFixturesRetained';
  readonly receiptDigest: string;
  readonly digestMeaning: 'INTEGRITY_RECEIPT_NOT_PHYSICAL_DELETION_PROOF';
  readonly prototypeData: true;
}

export interface PurgeParticipant {
  readonly category: 'dashboard' | 'snapshot' | 'applications' | 'session';
  purge(consent: ConsentRecord): number | { incomplete: number; completed: number };
}

export interface ConsentService {
  grant(input: {
    farmerId: string;
    purposeCode: ConsentPurposeCode;
    purposeVersion: string;
    scopes: readonly ConsentScopeCode[];
    validForSeconds: number;
    noticeAcknowledged: boolean;
    correlationId: string;
  }): Promise<ConsentRecord>;
  current(farmerId: string, purposeCode?: ConsentPurposeCode): ConsentRecord | null;
  validate(input: {
    consentId?: string;
    farmerId: string;
    purposeCode?: ConsentPurposeCode;
    requiredScopes: readonly string[];
  }): ConsentValidationResult;
  revoke(input: {
    consentId: string;
    farmerId: string;
    confirmation: 'WITHDRAW_AND_PURGE';
    correlationId: string;
  }): Promise<PurgeReceipt>;
}

export const consentMigrations: readonly ModuleMigration[] = [
  {
    module: 'consent',
    version: 1,
    name: 'consent artefacts and purge tombstones',
    sql: `
      CREATE TABLE consent_artefacts (
        consent_id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        purpose_code TEXT NOT NULL,
        purpose_version TEXT NOT NULL,
        scopes_json TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('GRANTED', 'REVOKED')),
        granted_at TEXT NOT NULL,
        valid_until TEXT NOT NULL,
        revoked_at TEXT,
        signature_compact TEXT NOT NULL
      ) STRICT;
      CREATE INDEX consent_owner_idx ON consent_artefacts(farmer_id, status);
      CREATE TABLE consent_purge_tombstones (
        purge_job_id TEXT PRIMARY KEY,
        consent_id TEXT NOT NULL UNIQUE,
        processing_stopped_at TEXT NOT NULL,
        counts_json TEXT NOT NULL,
        receipt_digest TEXT NOT NULL
      ) STRICT;
    `,
  },
];

export function createConsentService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
  events: EventPublisher;
  signingSecret: string;
  purgeParticipants: readonly PurgeParticipant[];
}): ConsentService {
  const encode = (value: unknown): string =>
    Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
  const sign = (payload: Record<string, unknown>): string => {
    const protectedHeader = encode({ alg: 'HS256', kid: 'prototype-consent-2026-01', typ: 'JWT' });
    const encodedPayload = encode(payload);
    const signingInput = `${protectedHeader}.${encodedPayload}`;
    const signature = createHmac('sha256', input.signingSecret)
      .update(signingInput)
      .digest('base64url');
    return `${signingInput}.${signature}`;
  };
  const verify = (compact: string): boolean => {
    const parts = compact.split('.');
    if (parts.length !== 3) return false;
    const expected = createHmac('sha256', input.signingSecret)
      .update(`${parts[0]}.${parts[1]}`)
      .digest();
    const supplied = Buffer.from(parts[2]!, 'base64url');
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  };
  const map = (row: Record<string, unknown>): ConsentRecord => {
    if (!verify(String(row.signatureCompact))) throw new Error('CONSENT_SIGNATURE_INVALID');
    const expired =
      row.status === 'GRANTED' && new Date(String(row.validUntil)) <= input.clock.now();
    return {
      consentId: String(row.consentId),
      farmerId: String(row.farmerId),
      purposeCode: String(row.purposeCode) as ConsentPurposeCode,
      purposeVersion: String(row.purposeVersion),
      scopes: JSON.parse(String(row.scopesJson)) as ConsentScopeCode[],
      status: expired ? 'EXPIRED' : (String(row.status) as 'GRANTED' | 'REVOKED'),
      grantedAt: String(row.grantedAt),
      validUntil: String(row.validUntil),
      revokedAt: row.revokedAt ? String(row.revokedAt) : undefined,
      signature: {
        format: 'JWS',
        algorithm: 'HS256',
        keyId: 'prototype-consent-2026-01',
        verified: true,
      },
      prototypeData: true,
    };
  };
  const find = (consentId: string, farmerId: string): ConsentRecord | null => {
    const row = input.database
      .prepare(
        `SELECT consent_id AS consentId, farmer_id AS farmerId, purpose_code AS purposeCode,
                purpose_version AS purposeVersion, scopes_json AS scopesJson, status,
                granted_at AS grantedAt, valid_until AS validUntil, revoked_at AS revokedAt,
                signature_compact AS signatureCompact
         FROM consent_artefacts WHERE consent_id = ? AND farmer_id = ?`
      )
      .get(consentId, farmerId) as Record<string, unknown> | undefined;
    return row ? map(row) : null;
  };

  return {
    grant: async (command) => {
      const purpose = consentPurposes[command.purposeCode];
      const uniqueScopes = [...new Set(command.scopes)];
      const validScopes = uniqueScopes.every((scope) => scope in consentScopes);
      const missing = purpose.requiredScopes.filter((scope) => !uniqueScopes.includes(scope));
      if (
        !command.noticeAcknowledged ||
        command.purposeVersion !== purpose.version ||
        command.validForSeconds <= 0 ||
        command.validForSeconds > 1_800 ||
        !validScopes ||
        missing.length > 0
      ) {
        throw new Error('VALIDATION_ERROR');
      }
      const consentId = input.ids.nextUuid();
      const grantedAt = input.clock.isoString();
      const validUntil = new Date(
        input.clock.now().getTime() + command.validForSeconds * 1_000
      ).toISOString();
      const signatureCompact = sign({
        consentId,
        farmerId: command.farmerId,
        purposeCode: command.purposeCode,
        purposeVersion: command.purposeVersion,
        scopes: uniqueScopes,
        grantedAt,
        validUntil,
      });
      input.database
        .prepare(
          `INSERT INTO consent_artefacts
           (consent_id, farmer_id, purpose_code, purpose_version, scopes_json, status,
            granted_at, valid_until, signature_compact)
           VALUES (?, ?, ?, ?, ?, 'GRANTED', ?, ?, ?)`
        )
        .run(
          consentId,
          command.farmerId,
          command.purposeCode,
          command.purposeVersion,
          JSON.stringify(uniqueScopes),
          grantedAt,
          validUntil,
          signatureCompact
        );
      await input.events.publish({
        id: input.ids.nextUuid(),
        type: 'consent.granted.v1',
        version: 1,
        occurredAt: grantedAt,
        correlationId: command.correlationId,
        producer: 'consent',
        payload: { consentId, purposeCode: command.purposeCode, scopeCount: uniqueScopes.length },
      });
      return find(consentId, command.farmerId)!;
    },
    current: (farmerId, purposeCode) => {
      const row = input.database
        .prepare(
          `SELECT consent_id AS consentId, farmer_id AS farmerId, purpose_code AS purposeCode,
                  purpose_version AS purposeVersion, scopes_json AS scopesJson, status,
                  granted_at AS grantedAt, valid_until AS validUntil, revoked_at AS revokedAt,
                  signature_compact AS signatureCompact
           FROM consent_artefacts WHERE farmer_id = ? AND status = 'GRANTED'
             AND (? IS NULL OR purpose_code = ?)
           ORDER BY granted_at DESC LIMIT 1`
        )
        .get(farmerId, purposeCode ?? null, purposeCode ?? null) as Record<string, unknown> | undefined;
      return row ? map(row) : null;
    },
    validate: ({ consentId, farmerId, purposeCode, requiredScopes }) => {
      if (!consentId) return { ok: false, code: 'CONSENT_REQUIRED' };
      const consent = find(consentId, farmerId);
      if (!consent || consent.status === 'REVOKED') {
        return { ok: false, code: 'CONSENT_REVOKED' };
      }
      if (consent.status === 'EXPIRED') return { ok: false, code: 'CONSENT_EXPIRED' };
      const missingScopes = requiredScopes.filter((scope) => !consent.scopes.includes(scope as ConsentScopeCode));
      if ((purposeCode && consent.purposeCode !== purposeCode) || missingScopes.length > 0) {
        return { ok: false, code: 'CONSENT_SCOPE_MISSING', missingScopes };
      }
      return { ok: true, consent };
    },
    revoke: async ({ consentId, farmerId, confirmation, correlationId }) => {
      if (confirmation !== 'WITHDRAW_AND_PURGE') throw new Error('VALIDATION_ERROR');
      const consent = find(consentId, farmerId);
      if (!consent || consent.status !== 'GRANTED') throw new Error('CONSENT_REVOKED');
      const processingStoppedAt = input.clock.isoString();
      const counts = input.database.transaction(() => {
        input.database
          .prepare(
            `UPDATE consent_artefacts SET status = 'REVOKED', revoked_at = ?
             WHERE consent_id = ? AND farmer_id = ? AND status = 'GRANTED'`
          )
          .run(processingStoppedAt, consentId, farmerId);
        const aggregate = {
          dashboardCachesDeleted: 0,
          normalizedSnapshotsDeleted: 0,
          draftBundlesDeleted: 0,
          incompleteApplicationsDeleted: 0,
          temporaryAttachmentsDeleted: 0,
          completedReceiptsPseudonymized: 0,
          sessionsInvalidated: 0,
        };
        for (const participant of input.purgeParticipants) {
          const result = participant.purge(consent);
          if (participant.category === 'dashboard') aggregate.dashboardCachesDeleted += Number(result);
          if (participant.category === 'snapshot') aggregate.normalizedSnapshotsDeleted += Number(result);
          if (participant.category === 'session') aggregate.sessionsInvalidated += Number(result);
          if (participant.category === 'applications' && typeof result === 'object') {
            aggregate.incompleteApplicationsDeleted += result.incomplete;
            aggregate.completedReceiptsPseudonymized += result.completed;
          }
        }
        return aggregate;
      });
      const purgeJobId = input.ids.nextPrefixedId('PURGE');
      const digest = createHash('sha256')
        .update(JSON.stringify({ purgeJobId, consentId, processingStoppedAt, counts }))
        .digest('hex');
      input.database
        .prepare(
          `INSERT INTO consent_purge_tombstones
           (purge_job_id, consent_id, processing_stopped_at, counts_json, receipt_digest)
           VALUES (?, ?, ?, ?, ?)`
        )
        .run(purgeJobId, consentId, processingStoppedAt, JSON.stringify(counts), digest);
      await input.events.publish({
        id: input.ids.nextUuid(),
        type: 'consent.revoked.v1',
        version: 1,
        occurredAt: processingStoppedAt,
        correlationId,
        producer: 'consent',
        payload: { consentId, purgeJobId },
      });
      return {
        purgeJobId,
        consentId,
        status: 'COMPLETED',
        processingStoppedAt,
        categories: counts,
        sourceFixturesRetained: true,
        sourceFixturesExplanationKey: 'privacy.syntheticFixturesRetained',
        receiptDigest: `sha256:${digest}`,
        digestMeaning: 'INTEGRITY_RECEIPT_NOT_PHYSICAL_DELETION_PROOF',
        prototypeData: true,
      };
    },
  };
}

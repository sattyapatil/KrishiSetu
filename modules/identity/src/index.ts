import { createHash, randomBytes } from 'node:crypto';
import type { Clock, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';

export interface SessionPrincipal {
  readonly token: string;
  readonly principalId: string;
  readonly userId: string;
  readonly farmerId: string;
  readonly expiresAt: string;
  readonly csrfToken: string;
}

export interface SyntheticCredential {
  readonly farmerId: string;
  readonly demoPin: string;
}

export type LoginFailureCode =
  | 'DEMO_FARMER_NOT_FOUND'
  | 'INVALID_DEMO_PIN'
  | 'RATE_LIMIT_EXCEEDED';

export type LoginResult =
  | { readonly ok: true; readonly session: SessionPrincipal }
  | { readonly ok: false; readonly code: LoginFailureCode; readonly retryAfterSeconds?: number };

export interface IdentityService {
  login(input: { farmerId: string; demoPin: string; clientKey: string }): LoginResult;
  validateSession(token: string): SessionPrincipal | null;
  logout(token: string): void;
  invalidateFarmerSessions(farmerId: string): number;
}

export const identityMigrations: readonly ModuleMigration[] = [
  {
    module: 'identity',
    version: 1,
    name: 'sessions and login attempts',
    sql: `
      CREATE TABLE identity_sessions (
        token_digest TEXT PRIMARY KEY,
        principal_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        farmer_id TEXT NOT NULL CHECK (length(farmer_id) = 14),
        csrf_token TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        revoked_at TEXT
      ) STRICT;
      CREATE INDEX identity_sessions_farmer_idx ON identity_sessions(farmer_id);
      CREATE TABLE identity_login_attempts (
        client_key TEXT PRIMARY KEY,
        failure_count INTEGER NOT NULL CHECK (failure_count >= 0),
        window_started_at TEXT NOT NULL,
        locked_until TEXT
      ) STRICT;
    `,
  },
];

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function opaqueToken(prefix: string): string {
  return `${prefix}_${randomBytes(24).toString('base64url')}`;
}

export function createIdentityService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
  credentials: readonly SyntheticCredential[];
}): IdentityService {
  const credentials = new Map(input.credentials.map((item) => [item.farmerId, item.demoPin]));

  function locked(clientKey: string): number | null {
    const row = input.database
      .prepare('SELECT locked_until AS lockedUntil FROM identity_login_attempts WHERE client_key = ?')
      .get(clientKey) as { lockedUntil: string | null } | undefined;
    if (!row?.lockedUntil) return null;
    const remaining = Math.ceil((new Date(row.lockedUntil).getTime() - input.clock.now().getTime()) / 1000);
    return remaining > 0 ? remaining : null;
  }

  function recordFailure(clientKey: string): LoginResult {
    const now = input.clock.now();
    const existing = input.database
      .prepare(
        `SELECT failure_count AS failureCount, window_started_at AS windowStartedAt
         FROM identity_login_attempts WHERE client_key = ?`
      )
      .get(clientKey) as { failureCount: number; windowStartedAt: string } | undefined;
    const windowExpired =
      existing && now.getTime() - new Date(existing.windowStartedAt).getTime() > 60_000;
    const failures = !existing || windowExpired ? 1 : existing.failureCount + 1;
    const lockedUntil = failures >= 5 ? new Date(now.getTime() + 60_000).toISOString() : null;
    input.database
      .prepare(
        `INSERT INTO identity_login_attempts
          (client_key, failure_count, window_started_at, locked_until)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(client_key) DO UPDATE SET
           failure_count = excluded.failure_count,
           window_started_at = excluded.window_started_at,
           locked_until = excluded.locked_until`
      )
      .run(clientKey, failures, windowExpired || !existing ? now.toISOString() : existing.windowStartedAt, lockedUntil);
    return lockedUntil
      ? { ok: false, code: 'RATE_LIMIT_EXCEEDED', retryAfterSeconds: 60 }
      : { ok: false, code: 'INVALID_DEMO_PIN' };
  }

  return {
    login: ({ farmerId, demoPin, clientKey }) => {
      const retryAfterSeconds = locked(clientKey);
      if (retryAfterSeconds) {
        return { ok: false, code: 'RATE_LIMIT_EXCEEDED', retryAfterSeconds };
      }
      const expectedPin = credentials.get(farmerId);
      if (!expectedPin) return { ok: false, code: 'DEMO_FARMER_NOT_FOUND' };
      if (demoPin !== expectedPin) return recordFailure(clientKey);

      input.database.prepare('DELETE FROM identity_login_attempts WHERE client_key = ?').run(clientKey);
      const token = opaqueToken('ks_session');
      const csrfToken = opaqueToken('csrf');
      const createdAt = input.clock.isoString();
      const expiresAt = new Date(input.clock.now().getTime() + 60 * 60 * 1000).toISOString();
      const session: SessionPrincipal = {
        token,
        principalId: input.ids.nextPrefixedId('principal'),
        userId: `user_${farmerId.slice(-8)}`,
        farmerId,
        csrfToken,
        expiresAt,
      };
      input.database
        .prepare(
          `INSERT INTO identity_sessions
           (token_digest, principal_id, user_id, farmer_id, csrf_token, created_at, expires_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(digest(token), session.principalId, session.userId, farmerId, csrfToken, createdAt, expiresAt);
      return { ok: true, session };
    },
    validateSession: (token) => {
      const row = input.database
        .prepare(
          `SELECT principal_id AS principalId, user_id AS userId, farmer_id AS farmerId,
                  csrf_token AS csrfToken, expires_at AS expiresAt, revoked_at AS revokedAt
           FROM identity_sessions WHERE token_digest = ?`
        )
        .get(digest(token)) as
        | Omit<SessionPrincipal, 'token'> & { revokedAt: string | null }
        | undefined;
      if (!row || row.revokedAt || new Date(row.expiresAt) <= input.clock.now()) return null;
      return { token, ...row };
    },
    logout: (token) => {
      input.database
        .prepare('UPDATE identity_sessions SET revoked_at = ? WHERE token_digest = ?')
        .run(input.clock.isoString(), digest(token));
    },
    invalidateFarmerSessions: (farmerId) => {
      const result = input.database
        .prepare(
          'UPDATE identity_sessions SET revoked_at = ? WHERE farmer_id = ? AND revoked_at IS NULL'
        )
        .run(input.clock.isoString(), farmerId);
      return Number(result.changes);
    },
  };
}

import type { EventPublisher, Clock, IdGenerator } from '@krishisetu/core';
import type { ModuleMigration, SqliteDatabase } from '@krishisetu/database';
import { localeRegistry, type Locale } from '@krishisetu/i18n';

export interface UserPreferences {
  readonly locale: Locale;
  readonly highContrast: boolean;
  readonly reducedMotion: boolean;
  readonly textScale: 'default' | 'large';
  readonly notificationChannels: readonly ['in_app'];
}

export interface UserProfile {
  readonly userId: string;
  readonly principalId: string;
  readonly preferences: UserPreferences;
}

export interface UsersService {
  ensureUser(input: { userId: string; principalId: string }): UserProfile;
  getUser(userId: string): UserProfile | null;
  updatePreferences(
    userId: string,
    patch: Partial<Omit<UserPreferences, 'notificationChannels'>>,
    correlationId: string
  ): Promise<UserProfile | null>;
}

export const usersMigrations: readonly ModuleMigration[] = [
  {
    module: 'users',
    version: 1,
    name: 'users and preferences',
    sql: `
      CREATE TABLE users_profiles (
        user_id TEXT PRIMARY KEY,
        principal_id TEXT NOT NULL UNIQUE,
        locale TEXT NOT NULL CHECK (locale IN ('en', 'mr', 'hi', 'kn')),
        high_contrast INTEGER NOT NULL CHECK (high_contrast IN (0, 1)),
        reduced_motion INTEGER NOT NULL CHECK (reduced_motion IN (0, 1)),
        text_scale TEXT NOT NULL CHECK (text_scale IN ('default', 'large')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
    `,
  },
];

export function createUsersService(input: {
  database: SqliteDatabase;
  clock: Clock;
  ids: IdGenerator;
  events: EventPublisher;
}): UsersService {
  const mapRow = (row: Record<string, unknown>): UserProfile => ({
    userId: String(row.userId),
    principalId: String(row.principalId),
    preferences: {
      locale: String(row.locale) as Locale,
      highContrast: Boolean(row.highContrast),
      reducedMotion: Boolean(row.reducedMotion),
      textScale: String(row.textScale) as 'default' | 'large',
      notificationChannels: ['in_app'],
    },
  });

  const find = (userId: string): UserProfile | null => {
    const row = input.database
      .prepare(
        `SELECT user_id AS userId, principal_id AS principalId, locale,
                high_contrast AS highContrast, reduced_motion AS reducedMotion,
                text_scale AS textScale
         FROM users_profiles WHERE user_id = ?`
      )
      .get(userId) as Record<string, unknown> | undefined;
    return row ? mapRow(row) : null;
  };

  return {
    ensureUser: ({ userId, principalId }) => {
      const existing = find(userId);
      if (existing) return existing;
      const now = input.clock.isoString();
      input.database
        .prepare(
          `INSERT INTO users_profiles
           (user_id, principal_id, locale, high_contrast, reduced_motion, text_scale, created_at, updated_at)
           VALUES (?, ?, ?, 0, 0, 'default', ?, ?)`
        )
        .run(userId, principalId, localeRegistry.defaultLocale, now, now);
      return find(userId)!;
    },
    getUser: find,
    updatePreferences: async (userId, patch, correlationId) => {
      const current = find(userId);
      if (!current) return null;
      const next = { ...current.preferences, ...patch };
      if (!(next.locale in localeRegistry.supported)) {
        throw new Error('VALIDATION_ERROR');
      }
      input.database
        .prepare(
          `UPDATE users_profiles SET locale = ?, high_contrast = ?, reduced_motion = ?,
           text_scale = ?, updated_at = ? WHERE user_id = ?`
        )
        .run(
          next.locale,
          next.highContrast ? 1 : 0,
          next.reducedMotion ? 1 : 0,
          next.textScale,
          input.clock.isoString(),
          userId
        );
      await input.events.publish({
        id: input.ids.nextUuid(),
        type: 'user.preference.changed.v1',
        version: 1,
        occurredAt: input.clock.isoString(),
        correlationId,
        producer: 'users',
        payload: { userId, locale: next.locale },
      });
      return find(userId);
    },
  };
}

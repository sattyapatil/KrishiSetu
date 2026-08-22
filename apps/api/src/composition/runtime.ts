import {
  CryptoIdGenerator,
  InMemoryEventBus,
  SystemClock,
  type Clock,
  type IdGenerator,
} from '@krishisetu/core';
import {
  createSqliteDatabase,
  runMigrations,
  type SqliteDatabase,
} from '@krishisetu/database';
import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';
import { createIdentityService, identityMigrations, type IdentityService } from '@krishisetu/identity';
import { createUsersService, usersMigrations, type UsersService } from '@krishisetu/users';
import {
  createFarmerProfileService,
  farmerProfileMigrations,
  type FarmerProfileService,
} from '@krishisetu/farmer-profile';
import {
  createLandRecordsService,
  landRecordsMigrations,
  type LandRecordsService,
} from '@krishisetu/land-records';
import {
  createCropRegistryService,
  cropRegistryMigrations,
  type CropRegistryService,
} from '@krishisetu/crop-registry';
import { createSchemesService, schemesMigrations, type SchemesService } from '@krishisetu/schemes';
import { createCreditService, creditMigrations, type CreditService } from '@krishisetu/credit';
import {
  createDashboardService,
  dashboardMigrations,
  type DashboardService,
} from '@krishisetu/dashboard';
import {
  applicationsMigrations,
  createApplicationsService,
  type ApplicationsService,
} from '@krishisetu/applications';
import { auditMigrations, createAuditService, type AuditService } from '@krishisetu/audit';
import { consentMigrations, createConsentService, type ConsentService } from '@krishisetu/consent';

export interface ApplicationRuntime {
  readonly database: SqliteDatabase;
  readonly identity: IdentityService;
  readonly users: UsersService;
  readonly consent: ConsentService;
  readonly farmerProfile: FarmerProfileService;
  readonly landRecords: LandRecordsService;
  readonly cropRegistry: CropRegistryService;
  readonly schemes: SchemesService;
  readonly credit: CreditService;
  readonly applications: ApplicationsService;
  readonly dashboard: DashboardService;
  readonly audit: AuditService;
  close(): void;
}

export function createApplicationRuntime(options: {
  databasePath?: string;
  clock?: Clock;
  ids?: IdGenerator;
  consentSigningSecret?: string;
} = {}): ApplicationRuntime {
  const database = createSqliteDatabase(options.databasePath ?? ':memory:');
  const clock = options.clock ?? new SystemClock();
  const ids = options.ids ?? new CryptoIdGenerator();
  const events = new InMemoryEventBus();

  runMigrations(database, [
    ...identityMigrations,
    ...usersMigrations,
    ...consentMigrations,
    ...farmerProfileMigrations,
    ...landRecordsMigrations,
    ...cropRegistryMigrations,
    ...schemesMigrations,
    ...creditMigrations,
    ...applicationsMigrations,
    ...dashboardMigrations,
    ...auditMigrations,
  ], clock.isoString());

  const identity = createIdentityService({
    database,
    clock,
    ids,
    credentials: SYNTHETIC_DEMO_FARMERS,
  });
  const users = createUsersService({ database, clock, ids, events });
  const farmerProfile = createFarmerProfileService({
    database,
    seeds: SYNTHETIC_DEMO_FARMERS,
  });
  const landRecords = createLandRecordsService(database);
  const cropRegistry = createCropRegistryService(database);
  const schemes = createSchemesService({ database, clock, ids });
  const credit = createCreditService({ database, clock, ids });
  const dashboard = createDashboardService({
    database,
    clock,
    farmerProfile,
    landRecords,
    cropRegistry,
    schemes,
    credit,
  });
  const applications = createApplicationsService({
    database,
    clock,
    ids,
    events,
    revalidate: async ({ farmerId, consentId, correlationId }) => {
      const model = await dashboard.getDashboard({
        farmerId,
        consentId,
        correlationId,
        consentValidUntil: new Date(clock.now().getTime() + 30 * 60 * 1000).toISOString(),
      }, ['applications']);
      const refreshed = model.offerings.some(
        (offering) => offering.domain === 'ULI' && !offering.selectable
      )
        ? await dashboard.getDashboard({
            farmerId,
            consentId,
            correlationId,
            consentValidUntil: new Date(clock.now().getTime() + 30 * 60 * 1000).toISOString(),
          }, ['uli'])
        : model;
      return new Set(
        refreshed.offerings.filter((offering) => offering.selectable).map((offering) => offering.offeringId)
      );
    },
    submitSubsidy: (command) => schemes.submit(command),
    submitCredit: (command) => credit.submit(command),
  });
  const audit = createAuditService({ database, clock, ids });
  const consent = createConsentService({
    database,
    clock,
    ids,
    events,
    signingSecret: options.consentSigningSecret ?? 'dev-prototype-consent-signing-secret',
    purgeParticipants: [
      { category: 'dashboard', purge: (record) => dashboard.purgeByConsent(record.consentId) },
      {
        category: 'snapshot',
        purge: (record) =>
          schemes.purgeByConsent(record.consentId) + credit.purgeByConsent(record.consentId),
      },
      {
        category: 'applications',
        purge: (record) => {
          const counts = applications.purgeByConsent(record.consentId);
          return {
            incomplete: counts.incompleteApplicationsDeleted,
            completed: counts.completedReceiptsPseudonymized,
          };
        },
      },
      { category: 'session', purge: (record) => identity.invalidateFarmerSessions(record.farmerId) },
    ],
  });

  return {
    database,
    identity,
    users,
    consent,
    farmerProfile,
    landRecords,
    cropRegistry,
    schemes,
    credit,
    applications,
    dashboard,
    audit,
    close: () => database.close(),
  };
}

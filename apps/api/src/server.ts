import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import { createApp } from './app.js';
import { createApplicationRuntime, type ApplicationRuntime } from './composition/runtime.js';
import { env, productConfig, moduleRegistry } from '@krishisetu/config';
import { errorCatalog, krishiSetuOpenApi } from '@krishisetu/contracts';
import {
  localeRegistry,
  resolveLocale,
  translate,
  type Locale,
} from '@krishisetu/i18n';
import { consentPurposes, type ConsentPurposeCode, type ConsentScopeCode } from '@krishisetu/policy';
import { SYNTHETIC_DEMO_FARMERS } from '@krishisetu/testing';
import type { SessionPrincipal } from '@krishisetu/identity';
import type { ConsentRecord } from '@krishisetu/consent';
import { logger } from '@krishisetu/observability';

interface RequestContext {
  requestId: string;
  correlationId: string;
  locale: Locale;
}

type ContextRequest = FastifyRequest & { krishiContext?: RequestContext };

export interface BuildServerOptions {
  readonly runtime?: ApplicationRuntime;
  readonly databasePath?: string;
  readonly allowedOrigin?: string;
  readonly internalMockToken?: string;
  readonly secureCookies?: boolean;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').flatMap((part) => {
      const separator = part.indexOf('=');
      if (separator < 1) return [];
      return [[part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())]];
    })
  );
}

function sessionCookie(token: string, secure: boolean, maxAge = 3_600): string {
  return [
    `krishi_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

function context(request: FastifyRequest): RequestContext {
  return (request as ContextRequest).krishiContext!;
}

function fail(
  reply: FastifyReply,
  request: FastifyRequest,
  code: keyof typeof errorCatalog | 'UNAUTHORIZED' | 'BUNDLE_NOT_FOUND',
  details?: Readonly<Record<string, unknown>>
) {
  const fallback = {
    UNAUTHORIZED: {
      code: 'UNAUTHORIZED',
      messageKey: 'errors.identity.sessionRequired',
      defaultStatus: 401,
      retryable: false,
      defaultFallbackMessage: 'An active demo session is required.',
    },
    BUNDLE_NOT_FOUND: {
      code: 'BUNDLE_NOT_FOUND',
      messageKey: 'errors.applications.bundleNotFound',
      defaultStatus: 404,
      retryable: false,
      defaultFallbackMessage: 'Application bundle was not found.',
    },
  } as const;
  const definition = code in errorCatalog
    ? errorCatalog[code as keyof typeof errorCatalog]
    : fallback[code as keyof typeof fallback];
  const localized = translate(definition.messageKey, context(request).locale);
  return reply.code(definition.defaultStatus).send({
    error: {
      code: definition.code,
      messageKey: definition.messageKey,
      message: localized === definition.messageKey ? definition.defaultFallbackMessage : localized,
      details,
      retryable: definition.retryable,
      requestId: context(request).requestId,
    },
  });
}

function requireSession(
  runtime: ApplicationRuntime,
  request: FastifyRequest,
  reply: FastifyReply
): SessionPrincipal | null {
  const token = parseCookies(request.headers.cookie).krishi_session;
  const session = token ? runtime.identity.validateSession(token) : null;
  if (!session) {
    fail(reply, request, 'UNAUTHORIZED');
    return null;
  }
  reply.header('Cache-Control', 'no-store, private');
  return session;
}

function requireCsrf(
  session: SessionPrincipal,
  request: FastifyRequest,
  reply: FastifyReply,
  allowedOrigin: string
): boolean {
  const csrf = request.headers['x-csrf-token'];
  const origin = request.headers.origin;
  if (csrf !== session.csrfToken || origin !== allowedOrigin) {
    fail(reply, request, 'VALIDATION_ERROR', { reason: 'CSRF_ORIGIN_CHECK_FAILED' });
    return false;
  }
  return true;
}

function requireConsent(
  runtime: ApplicationRuntime,
  request: FastifyRequest,
  reply: FastifyReply,
  session: SessionPrincipal,
  purposeCode: ConsentPurposeCode,
  requiredScopes: readonly string[]
): ConsentRecord | null {
  const header = request.headers['x-consent-id'];
  const consentId = Array.isArray(header) ? header[0] : header;
  const result = runtime.consent.validate({
    consentId,
    farmerId: session.farmerId,
    purposeCode,
    requiredScopes,
  });
  if (!result.ok || !result.consent) {
    fail(reply, request, result.code ?? 'CONSENT_REQUIRED', {
      requiredScopes,
      missingScopes: result.missingScopes ?? [],
    });
    return null;
  }
  return result.consent;
}

export async function buildServer(options: BuildServerOptions = {}) {
  const allowedOrigin = options.allowedOrigin ?? env.webOrigin;
  const internalMockToken = options.internalMockToken ?? env.internalMockToken;
  const secureCookies = options.secureCookies ?? env.nodeEnv === 'production';
  const runtime = options.runtime ?? createApplicationRuntime({
    databasePath: options.databasePath ?? env.databasePath,
    consentSigningSecret: env.csrfSecret,
  });
  const fastify = Fastify({ logger: false, bodyLimit: 65_536 });
  let ownsRuntime = !options.runtime;

  await fastify.register(cors, {
    origin: (origin, callback) => callback(null, !origin || origin === allowedOrigin),
    credentials: true,
    allowedHeaders: [
      'content-type',
      'accept-language',
      'x-request-id',
      'x-csrf-token',
      'x-consent-id',
      'idempotency-key',
      'x-internal-service-token',
      'x-demo-reset-token',
    ],
  });

  fastify.addHook('onRequest', async (request, reply) => {
    const requestId =
      typeof request.headers['x-request-id'] === 'string'
        ? request.headers['x-request-id'].slice(0, 128)
        : `req_${randomUUID()}`;
    const correlationId = `cor_${randomUUID()}`;
    const locale = resolveLocale({
      acceptLanguageHeader: request.headers['accept-language'],
      configuredDefault: env.defaultLocale,
    }).locale;
    (request as ContextRequest).krishiContext = { requestId, correlationId, locale };
    reply.header('X-Request-Id', requestId);
    reply.header('X-Correlation-Id', correlationId);
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Referrer-Policy', 'no-referrer');
    reply.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    reply.header(
      'Content-Security-Policy',
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
    );
  });

  fastify.addHook('onClose', async () => {
    if (ownsRuntime) runtime.close();
    ownsRuntime = false;
  });

  fastify.setErrorHandler((error, request, reply) => {
    const known = error instanceof Error ? error.message : '';
    if (known in errorCatalog) {
      return fail(reply, request, known as keyof typeof errorCatalog);
    }
    if (known === 'BUNDLE_NOT_FOUND') return fail(reply, request, 'BUNDLE_NOT_FOUND');
    logger.error('Unhandled API error', { details: { code: known || 'UNKNOWN' } });
    return fail(reply, request, 'INTERNAL_SERVER_ERROR');
  });

  const app = createApp();
  fastify.get('/health/live', async () => app.getLiveStatus());
  fastify.get('/health/ready', async () => {
    const status = app.getReadyStatus();
    const databaseReady = runtime.database
      .prepare('SELECT COUNT(*) AS count FROM platform_migrations')
      .get() as { count: number };
    return { ...status, database: databaseReady.count > 0, migrationCount: databaseReady.count };
  });
  fastify.get('/api/v1/meta/product', async () => ({ data: productConfig }));
  fastify.get('/api/v1/meta/locales', async () => ({ data: localeRegistry }));
  fastify.get('/api/v1/meta/modules', async () => ({ data: moduleRegistry }));
  fastify.get('/api/v1/openapi.json', async () => krishiSetuOpenApi);
  fastify.get('/api/v1/demo/personas', async () => ({
    data: SYNTHETIC_DEMO_FARMERS.map((farmer) => ({
      farmerId: farmer.farmerId,
      name: farmer.name,
      village: farmer.village,
      district: farmer.district,
      scenario: farmer.scenario,
      synthetic: farmer.synthetic,
    })),
  }));

  fastify.post('/api/v1/auth/login', async (request, reply) => {
    const body = record(request.body);
    const farmerId = typeof body.farmerId === 'string' ? body.farmerId : '';
    const demoPin = typeof body.demoPin === 'string' ? body.demoPin : '';
    if (!/^\d{14}$/.test(farmerId) || demoPin.length > 16) {
      return fail(reply, request, 'VALIDATION_ERROR');
    }
    const result = runtime.identity.login({ farmerId, demoPin, clientKey: request.ip });
    if (!result.ok) {
      if (result.retryAfterSeconds) reply.header('Retry-After', result.retryAfterSeconds);
      return fail(reply, request, result.code);
    }
    const user = runtime.users.ensureUser({
      userId: result.session.userId,
      principalId: result.session.principalId,
    });
    const farmer = await runtime.farmerProfile.getSummary(result.session.farmerId);
    reply.header('Set-Cookie', sessionCookie(result.session.token, secureCookies));
    reply.header('Cache-Control', 'no-store, private');
    runtime.audit.append({
      category: 'ACCESS',
      correlationId: context(request).correlationId,
      action: 'identity.login.succeeded',
      facts: { prototype: true },
    });
    return {
      session: { expiresAt: result.session.expiresAt, csrfToken: result.session.csrfToken },
      farmer: {
        farmerIdMasked: farmer.farmerIdMasked,
        displayName: farmer.displayName,
        village: farmer.village,
        prototypeData: true,
      },
      preferences: user.preferences,
      next: `/${user.preferences.locale}/consent`,
    };
  });

  fastify.post('/api/v1/auth/logout', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session) return reply;
    if (!requireCsrf(session, request, reply, allowedOrigin)) return reply;
    runtime.identity.logout(session.token);
    reply.header('Set-Cookie', sessionCookie('', secureCookies, 0));
    return { data: { loggedOut: true, prototypeData: true } };
  });

  fastify.post('/api/v1/demo/reset', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    if (request.headers['x-demo-reset-token'] !== env.demoResetToken) {
      return fail(reply, request, 'UNAUTHORIZED');
    }
    const currentConsent = runtime.consent.current(session.farmerId);
    let purge = null;
    if (currentConsent?.status === 'GRANTED') {
      purge = await runtime.consent.revoke({
        consentId: currentConsent.consentId,
        farmerId: session.farmerId,
        confirmation: 'WITHDRAW_AND_PURGE',
        correlationId: context(request).correlationId,
      });
    } else {
      runtime.identity.invalidateFarmerSessions(session.farmerId);
    }
    reply.header('Set-Cookie', sessionCookie('', secureCookies, 0));
    return { data: { reset: true, purge, prototypeData: true } };
  });

  fastify.get('/api/v1/users/me', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session) return reply;
    const farmer = await runtime.farmerProfile.getSummary(session.farmerId);
    return {
      data: {
        profile: runtime.users.getUser(session.userId),
        session: {
          farmerId: session.farmerId,
          expiresAt: session.expiresAt,
          csrfToken: session.csrfToken,
        },
        farmer,
      },
    };
  });

  fastify.patch('/api/v1/users/me/preferences', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    const body = record(request.body);
    const allowed = new Set(['locale', 'highContrast', 'reducedMotion', 'textScale']);
    if (Object.keys(body).some((key) => !allowed.has(key))) return fail(reply, request, 'VALIDATION_ERROR');
    if (
      (body.locale !== undefined && !['en', 'mr', 'hi', 'kn'].includes(String(body.locale))) ||
      (body.highContrast !== undefined && typeof body.highContrast !== 'boolean') ||
      (body.reducedMotion !== undefined && typeof body.reducedMotion !== 'boolean') ||
      (body.textScale !== undefined && !['default', 'large'].includes(String(body.textScale)))
    ) {
      return fail(reply, request, 'VALIDATION_ERROR');
    }
    const profile = await runtime.users.updatePreferences(
      session.userId,
      body,
      context(request).correlationId
    );
    return { data: profile };
  });

  fastify.post('/api/v1/consents', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    const body = record(request.body);
    const consent = await runtime.consent.grant({
      farmerId: session.farmerId,
      purposeCode: String(body.purposeCode) as ConsentPurposeCode,
      purposeVersion: String(body.purposeVersion),
      scopes: (Array.isArray(body.scopes) ? body.scopes.map(String) : []) as ConsentScopeCode[],
      validForSeconds: Number(body.validForSeconds),
      noticeAcknowledged: body.noticeAcknowledged === true,
      correlationId: context(request).correlationId,
    });
    reply.code(201);
    return { consent: { ...consent, farmerId: undefined } };
  });

  fastify.get('/api/v1/consents/current', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session) return reply;
    const query = record(request.query);
    const requestedPurpose = typeof query.purposeCode === 'string'
      ? query.purposeCode as ConsentPurposeCode
      : undefined;
    if (requestedPurpose && !(requestedPurpose in consentPurposes)) {
      return fail(reply, request, 'VALIDATION_ERROR');
    }
    return { data: runtime.consent.current(session.farmerId, requestedPurpose) };
  });

  fastify.delete('/api/v1/consents/:consentId', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    const params = request.params as { consentId: string };
    const body = record(request.body);
    const purge = await runtime.consent.revoke({
      consentId: params.consentId,
      farmerId: session.farmerId,
      confirmation: String(body.confirmation) as 'WITHDRAW_AND_PURGE',
      correlationId: context(request).correlationId,
    });
    reply.header('Set-Cookie', sessionCookie('', secureCookies, 0));
    return { purge };
  });

  const dashboardHandler = async (request: FastifyRequest, reply: FastifyReply, refresh: boolean) => {
    const session = requireSession(runtime, request, reply);
    if (!session) return reply;
    const consent = requireConsent(
      runtime,
      request,
      reply,
      session,
      'DASHBOARD_VIEW',
      consentPurposes.DASHBOARD_VIEW.requiredScopes
    );
    if (!consent) return reply;
    const domains = refresh
      ? (Array.isArray(record(request.body).domains) ? record(request.body).domains as string[] : [])
      : [];
    return runtime.dashboard.getDashboard(
      {
        farmerId: session.farmerId,
        consentId: consent.consentId,
        consentValidUntil: consent.validUntil,
        correlationId: context(request).correlationId,
      },
      domains
    );
  };
  fastify.get('/api/v1/dashboard', (request, reply) => dashboardHandler(request, reply, false));
  fastify.post('/api/v1/dashboard/refresh', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    return dashboardHandler(request, reply, true);
  });

  fastify.get('/api/v1/application-bundles', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session) return reply;
    return { data: runtime.applications.list(session.farmerId) };
  });

  fastify.post('/api/v1/application-bundles', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    const consent = requireConsent(
      runtime,
      request,
      reply,
      session,
      'MULTI_SCHEME_APPLICATION',
      consentPurposes.MULTI_SCHEME_APPLICATION.requiredScopes
    );
    if (!consent) return reply;
    const idempotency = request.headers['idempotency-key'];
    const body = record(request.body);
    if (typeof idempotency !== 'string' || idempotency.length < 8) {
      return fail(reply, request, 'VALIDATION_ERROR');
    }
    const bundle = await runtime.applications.submit({
      farmerId: session.farmerId,
      consentId: consent.consentId,
      correlationId: context(request).correlationId,
      idempotencyKey: idempotency,
      selections: Array.isArray(body.selections) ? body.selections as never[] : [],
      declarations: record(body.declarations) as {
        reviewedPrefilledData: boolean;
        understandsPrototype: boolean;
      },
    });
    reply.code(201);
    return { bundle };
  });

  fastify.get('/api/v1/application-bundles/:bundleId', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session) return reply;
    const consent = requireConsent(
      runtime,
      request,
      reply,
      session,
      'MULTI_SCHEME_APPLICATION',
      consentPurposes.MULTI_SCHEME_APPLICATION.requiredScopes
    );
    if (!consent) return reply;
    const { bundleId } = request.params as { bundleId: string };
    const bundle = runtime.applications.get(bundleId, session.farmerId);
    return bundle ? { bundle } : fail(reply, request, 'BUNDLE_NOT_FOUND');
  });

  fastify.post('/api/v1/application-bundles/:bundleId/retry', async (request, reply) => {
    const session = requireSession(runtime, request, reply);
    if (!session || !requireCsrf(session, request, reply, allowedOrigin)) return reply;
    const consent = requireConsent(
      runtime,
      request,
      reply,
      session,
      'MULTI_SCHEME_APPLICATION',
      consentPurposes.MULTI_SCHEME_APPLICATION.requiredScopes
    );
    if (!consent) return reply;
    const { bundleId } = request.params as { bundleId: string };
    return {
      bundle: await runtime.applications.retry(
        bundleId,
        session.farmerId,
        context(request).correlationId
      ),
    };
  });

  const requireInternal = (request: FastifyRequest, reply: FastifyReply): boolean => {
    if (request.headers['x-internal-service-token'] !== internalMockToken) {
      fail(reply, request, 'UNAUTHORIZED');
      return false;
    }
    reply.header('Cache-Control', 'no-store, private');
    return true;
  };
  fastify.get('/mock/farmer-registry/v1/farmers/:farmerId', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    return runtime.farmerProfile.getSummary((request.params as { farmerId: string }).farmerId);
  });
  fastify.get('/mock/mahabhumi/v1/land-holdings/:farmerId', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    return runtime.landRecords.getProviderView((request.params as { farmerId: string }).farmerId);
  });
  fastify.get('/mock/crop-registry/v1/crops/:farmerId', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    return runtime.cropRegistry.getSummary((request.params as { farmerId: string }).farmerId);
  });
  fastify.post('/mock/mahadbt/v1/eligibility:check', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    const body = record(request.body);
    const farmerId = String(body.farmerId ?? '');
    const consentId = String(body.consentId ?? request.headers['x-consent-id'] ?? '');
    if (!/^\d{14}$/.test(farmerId) || !consentId) return fail(reply, request, 'VALIDATION_ERROR');
    const dashboard = await runtime.dashboard.getDashboard({
      farmerId,
      consentId,
      correlationId: context(request).correlationId,
      consentValidUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    }, ['mahadbt']);
    const results = dashboard.offerings.filter((offering) => offering.domain === 'MAHADBT');
    return { source: 'MOCK_MAHADBT', results, prototypeData: true };
  });
  fastify.post('/mock/mahadbt/v1/applications', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    const body = record(request.body);
    return runtime.schemes.submit({
      farmerId: String(body.farmerId ?? ''),
      offeringId: String(body.offeringId ?? ''),
      consentId: String(body.consentId ?? request.headers['x-consent-id'] ?? ''),
      correlationId: context(request).correlationId,
    });
  });
  fastify.post('/mock/uli/v1/credit-estimates', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    const body = record(request.body);
    const farmerId = String(body.farmerId ?? '');
    const consentId = String(body.consentId ?? request.headers['x-consent-id'] ?? '');
    const dashboard = await runtime.dashboard.getDashboard({
      farmerId,
      consentId,
      correlationId: context(request).correlationId,
      consentValidUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    }, ['uli']);
    return dashboard.offerings.find((offering) => offering.domain === 'ULI');
  });
  fastify.post('/mock/uli/v1/pre-applications', async (request, reply) => {
    if (!requireInternal(request, reply)) return reply;
    const body = record(request.body);
    return runtime.credit.submit({
      farmerId: String(body.farmerId ?? ''),
      offeringId: String(body.offeringId ?? ''),
      consentId: String(body.consentId ?? request.headers['x-consent-id'] ?? ''),
      correlationId: context(request).correlationId,
    });
  });

  return fastify;
}

export async function startServer() {
  try {
    const server = await buildServer();
    const address = await server.listen({ port: env.port, host: env.host });
    logger.info(`KrishiSetu API running at ${address} (Prototype Mode: ${env.prototypeMode})`);
  } catch (error) {
    logger.error('Failed to start KrishiSetu API server', {
      details: {
        code: error instanceof Error ? error.name : 'UNKNOWN',
        reason: error instanceof Error ? error.message : 'Unknown startup failure',
      },
    });
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export * from './app.js';
export * from './composition/runtime.js';

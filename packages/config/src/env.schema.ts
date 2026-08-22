/**
 * Authoritative Environment Configuration Validator for KrishiSetu.
 * STRICT RULE: This is the ONLY file in the entire repository permitted to read `process.env`.
 */

export interface RuntimeConfig {
  readonly nodeEnv: 'development' | 'production' | 'test';
  readonly port: number;
  readonly host: string;
  readonly defaultLocale: string;
  readonly prototypeMode: boolean;
  readonly sessionSecret: string;
  readonly csrfSecret: string;
  readonly databasePath: string;
  readonly apiBaseUrl: string;
  readonly webOrigin: string;
  readonly internalMockToken: string;
  readonly demoResetToken: string;
}

function getEnvString(key: string, defaultValue: string): string {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    return defaultValue;
  }
  return value.trim();
}

function getEnvNumber(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const parsed = Number.parseInt(raw.trim(), 10);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  return raw.trim().toLowerCase() === 'true' || raw.trim() === '1';
}

export function loadRuntimeConfig(): RuntimeConfig {
  const rawNodeEnv = getEnvString('NODE_ENV', 'development').toLowerCase();
  const nodeEnv = (
    rawNodeEnv === 'production' || rawNodeEnv === 'test' ? rawNodeEnv : 'development'
  ) as RuntimeConfig['nodeEnv'];

  const config = {
    nodeEnv,
    port: getEnvNumber('PORT', 3001),
    host: getEnvString('HOST', '127.0.0.1'),
    defaultLocale: getEnvString('DEFAULT_LOCALE', 'en'),
    prototypeMode: getEnvBoolean('PROTOTYPE_MODE', true),
    sessionSecret: getEnvString(
      'SESSION_SECRET',
      'dev-prototype-session-secret-min-32-chars-long'
    ),
    csrfSecret: getEnvString(
      'CSRF_SECRET',
      'dev-prototype-csrf-secret-min-32-chars-long'
    ),
    databasePath: getEnvString('DATABASE_PATH', './krishisetu.sqlite'),
    apiBaseUrl: getEnvString('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001'),
    webOrigin: getEnvString('WEB_ORIGIN', 'http://localhost:3000'),
    internalMockToken: getEnvString(
      'INTERNAL_MOCK_TOKEN',
      'dev-prototype-internal-mock-token'
    ),
    demoResetToken: getEnvString('DEMO_RESET_TOKEN', 'dev-prototype-reset-token'),
  } as const;

  if (config.nodeEnv === 'production') {
    const unsafeDefaults = [
      config.sessionSecret.startsWith('dev-prototype-'),
      config.csrfSecret.startsWith('dev-prototype-'),
      config.internalMockToken.startsWith('dev-prototype-'),
      config.demoResetToken.startsWith('dev-prototype-'),
    ];
    if (unsafeDefaults.some(Boolean)) {
      throw new Error('Production runtime secrets must replace all prototype development defaults.');
    }
  }

  return Object.freeze(config);
}

export function loadWebBuildConfig(): Readonly<{ apiBaseUrl: string }> {
  return Object.freeze({
    apiBaseUrl: getEnvString('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001'),
  });
}

let cachedRuntimeConfig: RuntimeConfig | undefined;

export const env = new Proxy({} as RuntimeConfig, {
  get: (_target, property: keyof RuntimeConfig) => {
    cachedRuntimeConfig ??= loadRuntimeConfig();
    return cachedRuntimeConfig[property];
  },
});

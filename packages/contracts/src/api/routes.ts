/**
 * Authoritative Route Constants for KrishiSetu.
 */

export const apiRoutes = {
  healthLive: '/health/live',
  healthReady: '/health/ready',
  metaLocales: '/api/v1/meta/locales',
  metaModules: '/api/v1/meta/modules',
  authLogin: '/api/v1/auth/login',
  authLogout: '/api/v1/auth/logout',
  usersMe: '/api/v1/users/me',
  usersMePreferences: '/api/v1/users/me/preferences',
  consents: '/api/v1/consents',
  consentsCurrent: '/api/v1/consents/current',
  consentById: (consentId: string) => `/api/v1/consents/${consentId}`,
  dashboard: '/api/v1/dashboard',
  dashboardRefresh: '/api/v1/dashboard/refresh',
  applicationBundles: '/api/v1/application-bundles',
  applicationBundleById: (bundleId: string) => `/api/v1/application-bundles/${bundleId}`,
  applicationBundleRetry: (bundleId: string) => `/api/v1/application-bundles/${bundleId}/retry`,
  demoReset: '/api/v1/demo/reset',
} as const;

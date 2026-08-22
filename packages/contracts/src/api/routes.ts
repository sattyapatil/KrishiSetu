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
  demoPersonas: '/api/v1/demo/personas',
  openApi: '/api/v1/openapi.json',
  mockFarmer: (farmerId: string) => `/mock/farmer-registry/v1/farmers/${farmerId}`,
  mockLand: (farmerId: string) => `/mock/mahabhumi/v1/land-holdings/${farmerId}`,
  mockCrops: (farmerId: string) => `/mock/crop-registry/v1/crops/${farmerId}`,
  mockEligibility: '/mock/mahadbt/v1/eligibility:check',
  mockSubsidyApplications: '/mock/mahadbt/v1/applications',
  mockCreditEstimates: '/mock/uli/v1/credit-estimates',
  mockCreditPreapplications: '/mock/uli/v1/pre-applications',
} as const;

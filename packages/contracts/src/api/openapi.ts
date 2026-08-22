import { apiRoutes } from './routes.js';

const success = { description: 'Successful prototype response' };
const failure = { description: 'Standard KrishiSetu error envelope' };

export const krishiSetuOpenApi = {
  openapi: '3.1.0',
  info: {
    title: 'KrishiSetu Prototype API',
    version: '0.1.0',
    description: 'Synthetic-data-only agricultural DPI prototype. No live provider integrations.',
  },
  servers: [{ url: '/' }],
  paths: {
    [apiRoutes.authLogin]: { post: { responses: { 200: success, 401: failure, 429: failure } } },
    [apiRoutes.authLogout]: { post: { responses: { 200: success, 401: failure } } },
    [apiRoutes.usersMe]: {
      get: { responses: { 200: success, 401: failure } },
      patch: { responses: { 200: success, 400: failure, 401: failure } },
    },
    [apiRoutes.consents]: { post: { responses: { 201: success, 400: failure, 401: failure } } },
    [apiRoutes.consentsCurrent]: { get: { responses: { 200: success, 401: failure } } },
    '/api/v1/consents/{consentId}': {
      delete: { responses: { 200: success, 401: failure, 403: failure } },
    },
    [apiRoutes.dashboard]: { get: { responses: { 200: success, 403: failure, 503: failure } } },
    [apiRoutes.dashboardRefresh]: { post: { responses: { 200: success, 403: failure } } },
    [apiRoutes.applicationBundles]: {
      get: { responses: { 200: success, 401: failure } },
      post: { responses: { 201: success, 400: failure, 403: failure, 409: failure } },
    },
    '/api/v1/application-bundles/{bundleId}': {
      get: { responses: { 200: success, 401: failure, 404: failure } },
    },
    '/api/v1/application-bundles/{bundleId}/retry': {
      post: { responses: { 200: success, 401: failure, 403: failure, 404: failure } },
    },
  },
} as const;

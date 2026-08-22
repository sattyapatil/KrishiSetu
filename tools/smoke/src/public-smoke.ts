import assert from 'node:assert/strict';
import { buildServer } from '@krishisetu/api';

const server = await buildServer({ databasePath: ':memory:', secureCookies: false });
try {
  for (const url of [
    '/health/live',
    '/health/ready',
    '/api/v1/meta/locales',
    '/api/v1/meta/modules',
    '/api/v1/demo/personas',
    '/api/v1/openapi.json',
  ]) {
    const response = await server.inject({ method: 'GET', url });
    assert.equal(response.statusCode, 200, `${url} did not return HTTP 200`);
  }
  console.log('PASS: public API health, metadata, persona, and OpenAPI smoke checks.');
} finally {
  await server.close();
}

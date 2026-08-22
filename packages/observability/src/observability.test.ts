import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeLogPayload, redactValue, Logger } from './index';

describe('packages/observability', () => {
  it('redacts sensitive keys including PIN, secret, tokens, password', () => {
    assert.equal(redactValue('demoPin', '2468'), '[REDACTED]');
    assert.equal(redactValue('sessionToken', 'jwt.secret.here'), '[REDACTED]');
    assert.equal(redactValue('csrfSecret', 'secret_xyz'), '[REDACTED]');
  });

  it('masks 14-digit synthetic Farmer IDs', () => {
    const sanitized = sanitizeLogPayload({
      farmerId: '27202600000001',
      publicInfo: 'Pashan',
    });
    assert.equal(sanitized.farmerId, '••••••••••0001');
    assert.equal(sanitized.publicInfo, 'Pashan');
  });

  it('Logger instantiates without crashing', () => {
    const log = new Logger('test-module');
    assert.ok(log);
  });
});

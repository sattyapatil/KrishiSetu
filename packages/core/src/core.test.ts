import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ok,
  err,
  isOk,
  isErr,
  Money,
  parseFarmerId,
  parseUlpin,
  parseConsentId,
  maskIdentifier,
  FixedClock,
  DeterministicIdGenerator,
  createExecutionContext,
  InMemoryEventBus,
} from './index.js';

describe('packages/core', () => {
  describe('Result and DomainError', () => {
    it('creates ok result', () => {
      const res = ok(42);
      assert.equal(res.success, true);
      assert.equal(res.value, 42);
      assert.equal(isOk(res), true);
      assert.equal(isErr(res), false);
    });

    it('creates err result', () => {
      const res = err({ code: 'ERR', messageKey: 'errors.test' });
      assert.equal(res.success, false);
      assert.equal(res.error.code, 'ERR');
      assert.equal(isOk(res), false);
      assert.equal(isErr(res), true);
    });
  });

  describe('Money', () => {
    it('handles integer paise and prevents float', () => {
      const m1 = Money.fromPaise(500000); // 5000 rupees
      assert.equal(isOk(m1), true);
      if (isOk(m1)) {
        assert.equal(m1.value.toRupeesString(), '5000.00');
        assert.equal(m1.value.toPaiseNumber(), 500000);

        const m2 = Money.fromPaise(25050); // 250.50 rupees
        assert.equal(isOk(m2), true);
        if (isOk(m2)) {
          const sum = m1.value.add(m2.value);
          assert.equal(sum.toRupeesString(), '5250.50');

          const diff = m1.value.subtract(m2.value);
          assert.equal(isOk(diff), true);
          if (isOk(diff)) {
            assert.equal(diff.value.toRupeesString(), '4749.50');
          }
        }
      }
    });

    it('rejects floating point amounts in fromPaise', () => {
      const res = Money.fromPaise(12.34);
      assert.equal(isErr(res), true);
      if (isErr(res)) {
        assert.equal(res.error.code, 'INVALID_MONEY_AMOUNT');
      }
    });

    it('prevents negative money subtraction', () => {
      const m1 = Money.fromPaise(100);
      const m2 = Money.fromPaise(200);
      if (isOk(m1) && isOk(m2)) {
        const diff = m1.value.subtract(m2.value);
        assert.equal(isErr(diff), true);
        if (isErr(diff)) {
          assert.equal(diff.error.code, 'NEGATIVE_MONEY_NOT_ALLOWED');
        }
      }
    });
  });

  describe('Identifiers and Masking', () => {
    it('validates synthetic 14-digit Farmer IDs', () => {
      const valid = parseFarmerId('27202600000001');
      assert.equal(isOk(valid), true);

      const invalid = parseFarmerId('123456');
      assert.equal(isErr(invalid), true);
      if (isErr(invalid)) {
        assert.equal(invalid.error.code, 'INVALID_FARMER_ID');
      }
    });

    it('validates 14-digit ULPIN', () => {
      const valid = parseUlpin('27011003400128');
      assert.equal(isOk(valid), true);

      const invalid = parseUlpin('abc');
      assert.equal(isErr(invalid), true);
    });

    it('validates UUID Consent ID', () => {
      const valid = parseConsentId('9b8763f1-5d07-4c58-9f51-c7eecdbbd103');
      assert.equal(isOk(valid), true);

      const invalid = parseConsentId('not-a-uuid');
      assert.equal(isErr(invalid), true);
    });

    it('masks identifiers showing only the last 4 characters', () => {
      const masked = maskIdentifier('27202600000001');
      assert.equal(masked, '••••••••••0001');
    });
  });

  describe('Clock and Deterministic Id Generator', () => {
    it('FixedClock provides predictable time and advances', () => {
      const clock = new FixedClock('2026-08-22T09:00:00.000Z');
      assert.equal(clock.isoString(), '2026-08-22T09:00:00.000Z');
      clock.advanceByMs(60000);
      assert.equal(clock.isoString(), '2026-08-22T09:01:00.000Z');
    });

    it('DeterministicIdGenerator generates ordered sequence', () => {
      const gen = new DeterministicIdGenerator('demo', 1);
      assert.equal(gen.nextPrefixedId('req'), 'req_demo_000001');
      assert.equal(gen.nextPrefixedId('req'), 'req_demo_000002');
      assert.equal(gen.nextUuid(), '00000000-0000-4000-8000-000000000003');
    });
  });

  describe('ExecutionContext & InMemoryEventBus', () => {
    it('creates execution context with default locale', () => {
      const clock = new FixedClock();
      const ctx = createExecutionContext({
        requestId: 'req_1',
        correlationId: 'cor_1',
        clock,
        permissions: ['LAND_READ'],
      });
      assert.equal(ctx.locale, 'en');
      assert.equal(ctx.permissions.has('LAND_READ'), true);
      assert.equal(ctx.permissions.has('CROP_READ'), false);
    });

    it('InMemoryEventBus publishes and receives events', async () => {
      const bus = new InMemoryEventBus();
      const received: string[] = [];
      const unsub = bus.subscribe('test.event.v1', (e: { type: string }) => {
        received.push(e.type);
      });

      await bus.publish({
        id: 'evt_1',
        type: 'test.event.v1',
        version: 1,
        occurredAt: '2026-08-22T09:00:00.000Z',
        correlationId: 'cor_1',
        producer: 'test',
        payload: { ok: true },
      });

      assert.deepEqual(received, ['test.event.v1']);
      assert.equal(bus.publishedEvents.length, 1);

      unsub();
      await bus.publish({
        id: 'evt_2',
        type: 'test.event.v1',
        version: 1,
        occurredAt: '2026-08-22T09:00:00.000Z',
        correlationId: 'cor_1',
        producer: 'test',
        payload: { ok: true },
      });
      assert.equal(received.length, 1); // no extra delivery after unsubscribe
    });
  });
});

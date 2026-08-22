import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SYNTHETIC_PUBLIC_NOTICES,
  isNoticeActive,
  isNoticeExpired,
  filterNotices,
  sortNoticesByPriority,
  groupNoticesByDate,
  getActiveNotices,
} from './index.js';

describe('modules/notifications', () => {
  const asOf = new Date('2026-08-22T00:00:00Z');

  it('SYNTHETIC_PUBLIC_NOTICES contains valid prototype notices with safety markings', () => {
    assert.ok(SYNTHETIC_PUBLIC_NOTICES.length >= 6);
    for (const notice of SYNTHETIC_PUBLIC_NOTICES) {
      assert.equal(notice.prototypeData, true);
      assert.ok(notice.id.startsWith('notice-'));
      assert.ok(notice.titleKey.startsWith('notifications.'));
    }
  });

  it('isNoticeActive correctly identifies active vs expired/future notices', () => {
    const activeNotice = SYNTHETIC_PUBLIC_NOTICES.find((n) => n.id === 'notice-2026-001')!;
    assert.equal(isNoticeActive(activeNotice, asOf), true);

    const archivedNotice = SYNTHETIC_PUBLIC_NOTICES.find((n) => n.id === 'notice-2026-006')!;
    assert.equal(isNoticeActive(archivedNotice, asOf), false);
    assert.equal(isNoticeExpired(archivedNotice, asOf), true);
  });

  it('sortNoticesByPriority sorts CRITICAL before HIGH before NORMAL before LOW', () => {
    const sorted = sortNoticesByPriority(SYNTHETIC_PUBLIC_NOTICES);
    assert.equal(sorted[0]?.priority, 'CRITICAL');
    assert.equal(sorted[1]?.priority, 'HIGH');
  });

  it('filterNotices filters correctly by type, priority, and audience', () => {
    const deadlines = filterNotices(SYNTHETIC_PUBLIC_NOTICES, { type: 'APPLICATION_DEADLINE' });
    assert.equal(deadlines.length, 1);
    assert.equal(deadlines[0]?.id, 'notice-2026-002');

    const dryland = filterNotices(SYNTHETIC_PUBLIC_NOTICES, { audience: 'DRYLAND' });
    assert.equal(dryland.length, 1);
    assert.equal(dryland[0]?.id, 'notice-2026-004');
  });

  it('groupNoticesByDate groups notices by publication date', () => {
    const grouped = groupNoticesByDate(SYNTHETIC_PUBLIC_NOTICES);
    assert.ok(Object.keys(grouped).length > 0);
    assert.ok(grouped['2026-08-01']);
    assert.equal(grouped['2026-08-01']?.[0]?.id, 'notice-2026-001');
  });

  it('getActiveNotices returns only non-expired active notices', () => {
    const active = getActiveNotices(SYNTHETIC_PUBLIC_NOTICES, asOf);
    assert.ok(active.every((n) => n.status === 'ACTIVE'));
    assert.ok(active.every((n) => !isNoticeExpired(n, asOf)));
  });
});

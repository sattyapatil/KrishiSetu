import { PublicNotice, NoticeFilters } from './notice-types.js';

export function isNoticeActive(notice: PublicNotice, asOfDate: Date = new Date('2026-08-22T00:00:00Z')): boolean {
  if (notice.status !== 'ACTIVE') {
    return false;
  }
  const asOfIso = asOfDate.toISOString();
  if (notice.effectiveFrom > asOfIso) {
    return false;
  }
  if (notice.effectiveTo && notice.effectiveTo < asOfIso) {
    return false;
  }
  return true;
}

export function isNoticeExpired(notice: PublicNotice, asOfDate: Date = new Date('2026-08-22T00:00:00Z')): boolean {
  if (notice.status === 'EXPIRED' || notice.status === 'ARCHIVED') {
    return true;
  }
  if (notice.effectiveTo) {
    return notice.effectiveTo < asOfDate.toISOString();
  }
  return false;
}

const PRIORITY_ORDER: Record<PublicNotice['priority'], number> = {
  CRITICAL: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3,
};

export function sortNoticesByPriority(notices: readonly PublicNotice[]): readonly PublicNotice[] {
  return [...notices].sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function filterNotices(
  notices: readonly PublicNotice[],
  filters: NoticeFilters
): readonly PublicNotice[] {
  return notices.filter((notice) => {
    if (filters.type && notice.type !== filters.type) {
      return false;
    }
    if (filters.status && notice.status !== filters.status) {
      return false;
    }
    if (filters.audience && notice.audience !== filters.audience) {
      return false;
    }
    if (filters.priority && notice.priority !== filters.priority) {
      return false;
    }
    return true;
  });
}

export function getActiveNotices(
  notices: readonly PublicNotice[],
  asOfDate: Date = new Date('2026-08-22T00:00:00Z')
): readonly PublicNotice[] {
  return notices.filter((n) => isNoticeActive(n, asOfDate));
}

export function getNoticeById(
  notices: readonly PublicNotice[],
  id: string
): PublicNotice | undefined {
  return notices.find((n) => n.id === id);
}

export function groupNoticesByDate(
  notices: readonly PublicNotice[]
): Record<string, PublicNotice[]> {
  const grouped: Record<string, PublicNotice[]> = {};
  for (const notice of notices) {
    const dateKey = notice.publishedAt.split('T')[0] ?? 'unknown';
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey]!.push(notice);
  }
  return grouped;
}

import React, { useState } from 'react';
import { Locale, translate } from '@krishisetu/i18n';
import {
  PublicNotice,
  filterNotices,
  sortNoticesByPriority,
  groupNoticesByDate,
  NoticeType,
} from '@krishisetu/notifications';
import { PublicNoticeCard } from './PublicNoticeCard.js';
import { NotificationEmptyState } from './NotificationEmptyState.js';
import { NotificationArchiveSummary } from './NotificationArchiveSummary.js';

export interface PublicNoticeListProps {
  readonly notices: readonly PublicNotice[];
  readonly locale: Locale;
  readonly onActionClick?: (notice: PublicNotice) => void;
  readonly className?: string;
}

type FilterCategory = 'ALL' | 'CRITICAL' | 'SCHEME_WINDOW' | 'APPLICATION_DEADLINE' | 'REVISED_FORM';

export function PublicNoticeList({
  notices,
  locale,
  onActionClick,
  className = '',
}: PublicNoticeListProps): React.JSX.Element {
  const t = (key: string, params?: Record<string, string | number>) => translate(key, locale, params);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [showArchived, setShowArchived] = useState<boolean>(false);

  const activeNotices = notices.filter((n) => n.status !== 'ARCHIVED');
  const archivedNotices = notices.filter((n) => n.status === 'ARCHIVED');

  const filteredNotices = React.useMemo(() => {
    const baseList = showArchived ? notices : activeNotices;

    if (activeFilter === 'CRITICAL') {
      return filterNotices(baseList, { priority: 'CRITICAL' });
    }
    if (activeFilter === 'SCHEME_WINDOW') {
      return filterNotices(baseList, { type: 'SCHEME_WINDOW' as NoticeType });
    }
    if (activeFilter === 'APPLICATION_DEADLINE') {
      return filterNotices(baseList, { type: 'APPLICATION_DEADLINE' as NoticeType });
    }
    if (activeFilter === 'REVISED_FORM') {
      return filterNotices(baseList, { type: 'REVISED_FORM' as NoticeType });
    }
    return baseList;
  }, [notices, activeNotices, showArchived, activeFilter]);

  const sortedNotices = React.useMemo(
    () => sortNoticesByPriority(filteredNotices),
    [filteredNotices]
  );

  const groupedByDate = React.useMemo(
    () => groupNoticesByDate(sortedNotices),
    [sortedNotices]
  );

  const filterOptions: Array<{ id: FilterCategory; labelKey: string }> = [
    { id: 'ALL', labelKey: 'notifications.filterAll' },
    { id: 'CRITICAL', labelKey: 'notifications.filterCritical' },
    { id: 'SCHEME_WINDOW', labelKey: 'notifications.filterSchemes' },
    { id: 'APPLICATION_DEADLINE', labelKey: 'notifications.types.APPLICATION_DEADLINE' },
    { id: 'REVISED_FORM', labelKey: 'notifications.filterForms' },
  ];

  return (
    <div className={`ks-public-notice-list ${className}`}>
      {/* Filter Tabs */}
      <nav
        aria-label="Filter Notices"
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        {filterOptions.map((opt) => {
          const isSelected = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isSelected ? 'true' : 'false'}
              onClick={() => setActiveFilter(opt.id)}
              style={{
                minHeight: '2.75rem',
                padding: '0.4375rem 0.875rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isSelected
                  ? 'var(--ks-color-civic-blue, #1e3a8a)'
                  : 'var(--ks-color-border, #cbd5e1)',
                backgroundColor: isSelected
                  ? 'var(--ks-color-civic-blue, #1e3a8a)'
                  : 'var(--ks-color-surface-card, #ffffff)',
                color: isSelected
                  ? 'var(--ks-color-surface-card, #ffffff)'
                  : 'var(--ks-color-text, #0f172a)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              {t(opt.labelKey)}
            </button>
          );
        })}
      </nav>

      {/* Notice Cards List */}
      {sortedNotices.length === 0 ? (
        <NotificationEmptyState
          locale={locale}
          onResetFilter={() => setActiveFilter('ALL')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {Object.entries(groupedByDate).map(([date, dateNotices]) => (
            <section key={date} aria-labelledby={`date-heading-${date}`}>
              <h4
                id={`date-heading-${date}`}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--ks-color-text-muted, #475569)',
                  margin: '0 0 0.75rem 0',
                  paddingBottom: '0.25rem',
                  borderBottom: '1px solid var(--ks-color-border, #cbd5e1)',
                }}
              >
                {t('notifications.effectiveFrom', { from: date })}
              </h4>

              <div style={{ display: 'grid', gap: '0.875rem' }}>
                {dateNotices.map((notice) => (
                  <PublicNoticeCard
                    key={notice.id}
                    notice={notice}
                    locale={locale}
                    onActionClick={onActionClick}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Past / Archived Notices Summary */}
      {archivedNotices.length > 0 && (
        <NotificationArchiveSummary
          archivedNotices={archivedNotices}
          locale={locale}
          isExpanded={showArchived}
          onToggleExpand={() => setShowArchived(!showArchived)}
        />
      )}
    </div>
  );
}

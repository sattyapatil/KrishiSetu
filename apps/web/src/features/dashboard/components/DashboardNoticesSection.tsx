import React from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import { PublicNotice, sortNoticesByPriority } from '@krishisetu/notifications';
import { PublicNoticeCard } from '../../notifications/index.js';

export interface DashboardNoticesSectionProps {
  readonly locale: Locale;
  readonly notices: readonly PublicNotice[];
}

export function DashboardNoticesSection({
  locale,
  notices,
}: DashboardNoticesSectionProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const activeNotices = notices.filter((n) => n.status === 'ACTIVE');
  const topThree = sortNoticesByPriority(activeNotices).slice(0, 3);

  return (
    <section aria-labelledby="notices-section-heading">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <h2
          id="notices-section-heading"
          style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            margin: 0,
          }}
        >
          {t('notifications.title')}
        </h2>

        <Link
          href={`/${locale}/notifications`}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--ks-color-civic-blue, #1e3a8a)',
            textDecoration: 'none',
          }}
        >
          {t('notifications.centreTitle')} &rarr;
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {topThree.map((notice) => (
          <PublicNoticeCard
            key={notice.id}
            locale={locale}
            notice={notice}
            onActionClick={() => {}}
          />
        ))}
      </div>
    </section>
  );
}

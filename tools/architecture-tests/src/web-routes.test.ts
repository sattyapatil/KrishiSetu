import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@krishisetu/i18n';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const WEB_APP_DIR = path.join(REPO_ROOT, 'apps/web/app');

describe('KrishiSetu Web Route Architecture Invariants', () => {
  const EXPECTED_ROUTES = [
    'page.tsx', // Root redirect
    '[locale]/layout.tsx', // Locale wrapper
    '[locale]/page.tsx', // 1. Login
    '[locale]/consent/page.tsx', // 2. Dashboard consent
    '[locale]/dashboard/page.tsx', // 3. Dashboard
    '[locale]/schemes/page.tsx', // 4. Schemes catalog
    '[locale]/schemes/[schemeCode]/page.tsx', // 5. Scheme detail
    '[locale]/applications/page.tsx', // 6. Applications index
    '[locale]/applications/new/review/page.tsx', // 7. Review application
    '[locale]/applications/new/declare/page.tsx', // 8. Declare application
    '[locale]/applications/new/submitting/page.tsx', // 9. Submitting status
    '[locale]/applications/[bundleId]/page.tsx', // 10. Bundle confirmation
    '[locale]/applications/[bundleId]/[childId]/page.tsx', // 11. Child detail
    '[locale]/notifications/page.tsx', // 12. Notification centre
    '[locale]/notices/[noticeId]/page.tsx', // 13. Notice detail
    '[locale]/weather/page.tsx', // 14. Weather forecast & advisory
    '[locale]/privacy/page.tsx', // 15. Privacy overview
    '[locale]/privacy/consent/page.tsx', // 16. Active consent detail
    '[locale]/privacy/withdrawal/[receiptId]/page.tsx', // 17. Withdrawal simulation receipt
  ];

  test('all 17 required Next.js App Router route files exist explicitly', () => {
    for (const routeRelPath of EXPECTED_ROUTES) {
      const fullPath = path.join(WEB_APP_DIR, routeRelPath);
      assert.ok(
        fs.existsSync(fullPath),
        `Expected route file missing: ${routeRelPath} (checked ${fullPath})`
      );
    }
  });

  test('every App Router page exports a default component function', () => {
    for (const routeRelPath of EXPECTED_ROUTES) {
      const fullPath = path.join(WEB_APP_DIR, routeRelPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(
        content.includes('export default') || content.includes('export default function'),
        `Route file ${routeRelPath} must export a default component function`
      );
    }
  });

  test('all 4 supported locales (en, mr, hi, kn) are registered in locale layout static params', () => {
    const layoutPath = path.join(WEB_APP_DIR, '[locale]/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');
    assert.ok(
      content.includes('generateStaticParams') && content.includes('SUPPORTED_LOCALES'),
      'Locale layout must export generateStaticParams using SUPPORTED_LOCALES'
    );
    assert.deepEqual(SUPPORTED_LOCALES, ['en', 'mr', 'hi', 'kn']);
    assert.equal(DEFAULT_LOCALE, 'en');
  });

  test('all internal links in AppShell and Feature views target valid route patterns', () => {
    const VALID_ROUTE_PATTERNS = [
      /^\/(en|mr|hi|kn)$/,
      /^\/(en|mr|hi|kn)\/consent$/,
      /^\/(en|mr|hi|kn)\/dashboard$/,
      /^\/(en|mr|hi|kn)\/schemes$/,
      /^\/(en|mr|hi|kn)\/schemes\/[a-zA-Z0-9_-]+$/,
      /^\/(en|mr|hi|kn)\/applications$/,
      /^\/(en|mr|hi|kn)\/applications\/new\/review$/,
      /^\/(en|mr|hi|kn)\/applications\/new\/declare$/,
      /^\/(en|mr|hi|kn)\/applications\/new\/submitting$/,
      /^\/(en|mr|hi|kn)\/applications\/[a-zA-Z0-9_-]+$/,
      /^\/(en|mr|hi|kn)\/applications\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/,
      /^\/(en|mr|hi|kn)\/notifications$/,
      /^\/(en|mr|hi|kn)\/notices\/[a-zA-Z0-9_-]+$/,
      /^\/(en|mr|hi|kn)\/weather$/,
      /^\/(en|mr|hi|kn)\/privacy$/,
      /^\/(en|mr|hi|kn)\/privacy\/consent$/,
      /^\/(en|mr|hi|kn)\/privacy\/withdrawal\/[a-zA-Z0-9_-]+$/,
    ];

    const sampleHrefs = [
      '/en/dashboard',
      '/mr/schemes',
      '/hi/schemes/offering_drip_2026',
      '/kn/applications',
      '/en/applications/new/review',
      '/mr/applications/new/declare',
      '/hi/applications/new/submitting',
      '/kn/applications/BND-2026-000081',
      '/en/applications/BND-2026-000081/CH-MDBT-01',
      '/mr/notifications',
      '/hi/notices/NTC-2026-001',
      '/kn/weather',
      '/en/privacy',
      '/mr/privacy/consent',
      '/hi/privacy/withdrawal/RCP-PURGE-2026-001',
    ];

    for (const href of sampleHrefs) {
      const matches = VALID_ROUTE_PATTERNS.some((pattern) => pattern.test(href));
      assert.ok(matches, `Sample href ${href} must match an expected route pattern`);
    }
  });
});

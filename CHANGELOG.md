# Changelog

All notable changes. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Security
- Upgrade Next.js 16.3.4 → 16.4.5, Payload 3.89.0 → 3.92.1 (all `@payloadcms/*`),
  sharp → 0.35.5, dompurify override → 3.4.17. Fixes published critical
  advisories including unauthenticated RCE and access-control bypass.
  Ships with migration `payload_3_92_upgrade`.
- CI fails on critical advisories in production dependencies.
- Inquiries are readable and exportable by Admin and Sales only; content and
  pages are writable by Admin and Editor only.
- CSV export neutralises spreadsheet formulas in visitor input.
- The weekly database backup is encrypted with age before upload.

### Fixed
- The footer's privacy link was larger than the legal line it sits in; it now
  matches it and is underlined. The footer's legal line and language links
  were 3.8:1 contrast; raised to 5.8:1 (WCAG AA).
- The footer on the privacy page stayed blank: the page did not mount the
  motion script that reveals it.
- The admin opened at a Vercel per-deployment URL showed as signed in but
  refused every save ("You are not allowed to perform this action"): that
  address is now trusted for CORS and CSRF alongside the branch alias.

### Added
- **Sales** role for the people who follow up inquiries.
- Privacy policy page (`/privacy`, `/id/privacy`), editable in the CMS and
  linked from the footer and the inquiry form.
- Automatic deletion of inquiries older than the retention period set on the
  privacy policy (default 24 months), nightly via Vercel Cron.
- Unit tests (`npm test`) and Playwright E2E (`npm run test:e2e`), both in CI;
  the E2E job also applies every migration to an empty Postgres.
- `DECISIONS.md` and this changelog.

### Fixed
- Accessibility: small gold text and captions meet 4.5:1 contrast; form
  inputs are 16px (no iOS zoom on focus); no prohibited `aria-label` on the
  footer's paragraph; the site header is a landmark; the footer's language
  switcher has its own label; card lists no longer skip from h1 to h3.

### Migration notes
- Run on staging, then production (the deploy build does this):
  `payload_3_92_upgrade`, `privacy_retention_sales_role`.
- Set `CRON_SECRET` in Vercel production. Set `BACKUP_AGE_RECIPIENT` in the
  repository's Actions secrets before the next Monday backup.
- Give the Sales role to whoever answers inquiries.

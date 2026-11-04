# Decisions

One row per decision that shapes the product or the codebase. Before a new
request contradicts a row here, say so and decide again on purpose.

Status: **Agreed** · **Owner override** (the owner chose otherwise after
hearing the risk).

| Date | Decision | Reason | Alternatives rejected | Status | Risk |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04 | Upgrade to Next.js 16.4.5 and Payload 3.92.1 with migration `payload_3_92_upgrade` | Published critical advisories in 16.3.4 / 3.89.0 (unauthenticated RCE, access-control bypass, SQL injection, S3 overwrite) | Waiting for the weekly Dependabot PR; pinning and ignoring | Agreed | Payload minor upgrades can change admin behaviour; verified on a local Postgres, needs a pass on staging |
| 2026-11-04 | `npm audit --omit=dev --audit-level=critical` blocks CI | The non-blocking audit let critical advisories sit on `main` | Blocking on high (too noisy: transitive highs without fixes would stop copy changes) | Agreed | A critical with no upstream fix blocks merges until an override or replacement is chosen |
| 2026-11-04 | New role **Sales**; inquiries readable and exportable by Admin and Sales only; content writable by Admin and Editor only | Least privilege for visitors' personal data (UU PDP No. 27/2022, OWASP ASVS V4) | Admin only (forces sales onto admin accounts); all editors (status quo) | Agreed (owner's choice on the decision card) | Editors who handled inquiries lose access until an admin gives them Sales |
| 2026-11-04 | Privacy policy as a CMS global at `/privacy`, draft text written from what the code does | UU PDP notice: controller, purpose, processors, retention, rights | A static page in code (team could not update it); a third-party policy generator (generic, wrong about this stack) | Agreed | Draft is not legal advice; needs counsel's review before relying on it |
| 2026-11-04 | Inquiries deleted automatically after a retention period set on the policy (default 24 months), nightly via Vercel Cron | Data kept no longer than its purpose; one number drives both the promise and the purge | Manual deletion (forgotten); retention in Site settings (could drift from the text) | Agreed | 24 months is a proposal; deletes regardless of status, so a closed deal's record must live elsewhere (CRM) |
| 2026-11-04 | Backup dump encrypted with age to a public key; job fails without the key | The dump contains every inquiry; R2's at-rest encryption does not protect against a leaked bucket token | GPG (heavier key management); relying on bucket encryption only | Agreed | Losing the private key makes backups unrecoverable; keep it in the password manager |
| 2026-11-04 | Small gold text `#87621f` (was `#a97b2a`), captions at 0.62 opacity (was 0.58) | WCAG 2.2 AA 4.5:1 for small text; measured 3.4:1 and 4.2:1 | Larger text instead (changes the layout more); leaving decorative gold for text | Agreed | The gold reads slightly deeper in light mode; ornaments and dark mode unchanged |
| 2026-11-04 | Unit tests on Node's built-in runner via tsx, E2E on Playwright | Zero tests before; node:test adds no dependency. Vitest 4/5 failed to install against this tree (npm peer-set error) | Vitest; Jest (heavier, ESM friction) | Agreed | node:test has fewer conveniences (no watch UI, plainer output) |

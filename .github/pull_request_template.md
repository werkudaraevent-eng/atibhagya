## What and why

<!-- One or two sentences. What changes for the visitor or the editor, and why. -->

## Checklist

- [ ] `npm run typecheck` and `npm run lint` pass locally
- [ ] Looked at the Vercel preview for this branch (link in the bot comment below)
- [ ] If a field was added, renamed or retyped in `src/collections` or `src/globals`: the migration file from `npm run migrate:create:staging -- <name>` is in this PR
- [ ] If a custom admin component was added: `npm run generate:importmap` was run and `importMap.js` is in this PR
- [ ] No secrets, connection strings or `.env` contents anywhere in the diff
- [ ] Wording the site shows is editable in the CMS (no blind boxes, no hardcoded copy)

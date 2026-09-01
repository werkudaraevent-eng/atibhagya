# Atibhagya

Marketing site and inquiry flow for Atibhagya, a curator of wellness
experiences rooted in Indonesian wisdom.

Built to the material in [`refference/`](refference/) — the revised wireframe,
the logical ERD, and the internal content master. Those supersede the earlier
estate design in `design_handoff_atibhagya_website/`, which is kept only as an
archive of the visual language (colours, type, motion) that carried over.

- **Framework** — Next.js 16 (App Router, React 19)
- **CMS** — Payload 3, mounted in the same app under `/admin`
- **Database** — Postgres in production; SQLite locally
- **Locales** — English at `/`, Indonesian at `/id/…`

## Getting started

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

`.env` ships pointing at a local SQLite file, so the CMS runs with no database
server. Three levels of setup are supported:

| `DATABASE_URI`            | What runs                                                   |
| ------------------------- | ----------------------------------------------------------- |
| unset                     | Marketing site only, rendered from the approved default copy |
| `file:./atibhagya-dev.db` | Full CMS on SQLite — `/admin`, seeding, inquiries            |
| `postgres://…`            | Production. Payload Cloud or any managed Postgres            |

Load the approved copy into the CMS, in both locales:

```bash
npm run seed
```

Then create the first admin user at http://localhost:3000/admin.

## Where the catalogue comes from

Atibhagya and Takshaka are both brands under **Werkudara Group**. Atibhagya is
the wellness-facing brand, and part of its catalogue is Takshaka's product
range — so a Takshaka brochure page like Agni Hotra is a first-party product
here, not a third-party listing.

That settles one item on the content master's "confirm before publishing" list
(who owns and operates each experience). Still open: which of them are
currently active and bookable, and in which destinations.

## Sitemap

Seven templates, exactly as the wireframe lists them.

| Route | Template |
| ----- | -------- |
| `/` | Home — hero media, why Atibhagya, featured experiences, closing CTA |
| `/product` | Product discovery — editorial index, alternating 58/42 rows, one control row, load more |
| `/product/[slug]` | Product detail — editorial intro, facts on the page, gallery, facilitator when present |
| `/journey` | Journey discovery — full-width immersive opening, cards on a route line |
| `/journey/[slug]` | Journey detail — day timeline as the main surface, overview secondary |
| `/about` | About — centred, one continuous story |
| `/inquiry` | The single inquiry form every CTA leads to |

Indonesian equivalents sit under `/id/…`. `next.config.mjs` rewrites `/` and
each section to `/en/…` and redirects `/en/…` back, so English has no prefix and
each page keeps one canonical URL.

## Content model

Product is the centre; category, venue and facilitator are reusable master
data; home and about are singletons that only choose and describe.

| Collection / global | Purpose |
| ------------------- | ------- |
| `products` | Title, subtitle, description, highlight, duration, facilities, suitable-for, gallery, venues, facilitators |
| `product-categories` | Master list behind the filter row |
| `venues` | Reusable — one venue serves many products and journey items |
| `facilitators` | Optional; the section only renders when data exists |
| `journeys` | Itinerary with nested days and activities; an activity may reference a product, venue and facilitators, or stay custom |
| `inquiries` | Contact, occasion, and the products/journeys/custom activities chosen |
| `media` | Uploads with localized alt text and credit fields |
| `home`, `about`, `site` | Page singletons and shared chrome |
| `posts` | Journal, modelled but not yet rendered |

There is **no price field anywhere**. The content master lists pricing
structure, package durations and group minimums among the things still to be
confirmed before publishing, so the model does not invite anyone to publish one
yet. Add the field when the operational Experience Inventory exists.

### Loading the catalogue

The 73-product catalogue lives in the Takshaka workbook. Convert it, then
import:

```bash
python scripts/xlsx-to-products.py refference/Wellness_Catalog_Takshaka_2026_Database.xlsx data/products.json
```

```bash
npm run import:products
```

The import upserts by slug, so it is safe to run again after editing
`data/products.json` — existing products are updated in place, new ones
created, nothing deleted. Categories and venues named in the file are created
when they do not exist yet. Images are not imported: upload photography to
`media` and attach it in the admin, since a brochure export carries no usable
image references.

Two things the converter has to decide, both worth reviewing:

- **Categories.** The workbook has no category column, so they are derived from
  the catalogue's own thematic ordering — Rituals & Ceremony (3), Healing &
  Sound (13), Yoga & Movement (9), Spa & Retreats (11), Nature & Nourishment
  (16), Art & Culture (21). Changing one is a single dropdown in the admin, or
  edit `CATEGORIES` in the converter and re-import.
- **Venue names.** The venue column came out of a PDF, so long names are broken
  across lines and a bare place name belongs to the venue above it. Splitting on
  the newline alone invented venues like "Arma Museum &" and "Eve". The
  converter rejoins them, which takes 131 distinct venues down to 108.

Measured with the full catalogue loaded (production build):

| | |
| --- | --- |
| Payload query, all products, depth 2 | 97 ms |
| One product by slug | 16 ms |
| `/product` | 21 ms |
| `/product/[slug]` | 9–11 ms |
| `next build` | 167 pages |

Dev-mode figures are ten to a hundred times worse. That is Next's dev
compilation, not the data layer — measure on `next start`.

### Drafts, versions and concurrent editing

Products, journeys and the page singletons keep **Save draft / Publish**, a
version history, and revert. Fifty versions per document.

Verified behaviour, because the question matters:

- A **draft edit does not reach the site**. Saving Agni Hotra as a draft left
  the live page showing its published subtitle; the edit sat in the version
  table until published.
- **Reverting one document does not touch another.** Versions are scoped per
  document. Reverting Agni Hotra left a second editor's published change to
  Moonlight Remedies exactly as they had left it.
- **Two people cannot silently overwrite each other on the same document.**
  Payload locks a document while someone is editing it (`payload_locked_documents`),
  so the second person is told rather than surprised.

The Local API bypasses access control, so `src/lib/content/index.ts` states the
published filter explicitly — otherwise an unpublished edit would appear on the
live site.

Note for local work: SQLite allows one writer, so running an import while the
dev server is writing can throw. Re-run it; Postgres in production has no such
limit.

### The admin

- **Atibhagya branding** on the login screen and nav, not Payload's.
- **Preview** on every product and journey opens the real page; **live preview**
  puts it in a panel beside the form at mobile, tablet and desktop widths.
- **Bahasa Indonesia** is available for the whole admin UI. Each editor picks
  their own language in the account menu, so the choice is per-person rather
  than forced on everyone.
- **Array rows read as content** — "03 · Traditional Cloth" instead of "Item 3"
  — which matters when a journey has fourteen activities.
- **Search and pagination** on the product list, with the catalogue code
  (`WEL-001`) stored alongside the slug so the site and the printed catalogue
  stay cross-referenced.

### Browsing a catalogue this size

The catalogue is an **editorial index, not a card grid**. One experience per
row, image-led at 58/42, and the sides swap on every second row — the editorial
asymmetry the wireframe asks for, rather than a symmetric grid that would read
as any other catalogue. Rows carry the N° numbering the rest of the site
already uses, and hover widens the rule under "Read more" and warms the row
with a trace of gold.

Controls are **one row of three different shapes**, because two stacked rows of
identical text buttons read as the same control repeated:

- **Category** — text links, the spine of the catalogue.
- **For …** — a quiet select. A different affordance for a different question.
- **Search** — an underlined field. Matches title, subtitle, highlight and
  category, client-side and instant.

Eight rows show first, then **Load more** adds eight. Not infinite scroll: the
footer stays reachable, the back button still works, and nobody loses their
place. A counter (`8 of 73`) and a `Clear filters` escape hatch keep the
narrowing legible.

Image credits sit as hairline captions under each photograph rather than as
badges stamped on top — repeated overlays read as stock photography. The
overlay chip is still used on hero images, where there is one of them.

Listing pages receive a trimmed `ProductCard` shape rather than whole products,
so galleries, venues and facilitators are not shipped to the browser just to
draw the index.

Each product page closes with three **related experiences** — same category
first, topped up from the rest of the catalogue.

### Roles

Two roles, set on each user in the admin.

| | Admin | Editor |
| --- | --- | --- |
| Write and publish content | yes | yes |
| Delete content, media, inquiries | yes | **no** |
| Create and manage accounts | yes | **no** |
| See other users | yes | own record only |
| Change anyone's role | yes | **no** |

Verified by running each operation as each role: an editor is refused user
creation and deletion, sees only their own account, and cannot promote
themselves — Payload strips the `roles` field rather than throwing, so the
attempt silently does nothing.

A `beforeDelete` hook refuses to remove the last remaining admin, so the panel
cannot be locked shut by accident.

### Photography

Uploads land in `public/media`, so Next serves them as static files. Payload
generates three sizes on upload (`card` 800, `wide` 1600, `hero` 2400) and
returns the original's URL; `getHomeContent` and friends fold that absolute URL
back to a relative path, because `next/image` would otherwise treat our own
uploads as a remote host and refuse them.

**Object storage is wired and waiting.** Set `S3_BUCKET` (plus endpoint, region
and keys) in `.env` and Payload switches from local disk to object storage; leave
it unset and files stay on disk. The adapter speaks plain S3, so the same
settings drive AWS S3, Cloudflare R2, DigitalOcean Spaces, Wasabi, or Supabase
Storage.

Local disk is fine for development and for any host with a persistent
filesystem. It is **not** fine on Vercel, whose filesystem is read-only and
ephemeral — an uploaded photo would vanish on the next deploy.

### How content resolves

`src/lib/content/defaults.en.ts` and `defaults.id.ts` hold the approved copy.
They are both the seed source and the fallback: each getter in
`src/lib/content/index.ts` reads Payload and merges it over the defaults field
by field, so an empty CMS field — or a missing database — renders the approved
line rather than a gap.

### Which images are editable

Every image the site displays is a `media` upload chosen in the admin:

| Where | Field |
| --- | --- |
| Home hero, home closing CTA | `home.heroImage`, `home.ctaImage` |
| About | `about.image` |
| Product hero and gallery | `products.heroImage`, `products.gallery` |
| Journey hero and gallery | `journeys.heroImage`, `journeys.gallery` |
| Facilitator portrait, venue photo | `facilitators.photo`, `venues.image` |

The only images **not** in the CMS are the Atibhagya logotype in the nav,
footer and admin (`public/logo-atibhagya-gold.png`) and the browser icon. Those
are brand assets rather than content; changing them means replacing the file.

### About the placeholders

Page-level placeholders are Creative Commons landscapes from Wikimedia Commons,
and they deliberately show **no people**. The content master asks that living
traditions are not treated as decorative props, and a documentary photograph of
named strangers at worship is exactly that when used as brand furniture. Two
earlier placeholders — a Legong dancer in close-up, and a congregation praying —
were removed for that reason, along with one picked by filename that turned out
to be a tourist's photograph of himself.

**Products carry no placeholder at all.** Repeating one product's photograph
across seventy others misrepresents the catalogue, so a product without its own
image shows a tinted panel instead. It reads as deliberate, and it makes the
outstanding work visible.

## The inquiry opens as a dialog

`/inquiry` is a real URL that can be linked, shared and reloaded, and renders as
a full page on a direct visit. Arriving from a product or journey is different:
an intercepting route (`src/app/[locale]/@modal/(.)inquiry`) lifts the same form
over the page instead of replacing it, so the visitor never loses their place.

The CTA carries its context — `/inquiry?product=agni-hotra` — and the form opens
with Agni Hotra already chosen. The visitor can remove it, add other products or
journeys, or type a custom activity. Slugs are resolved to real ids server-side
rather than trusted as references.

The dialog closes on the close control, on Escape, or on a click outside. Each
route plays the exit — backdrop and panel settle back down over 420ms — before
history moves. Under `prefers-reduced-motion` the transitions collapse to a
short fade with no movement.

## Inquiry notifications

Submissions land in the `inquiries` collection, which is where the team reads,
replies to and moves them through New → Contacted → Qualified → Closed.

**The form's wording** is editable under Inquiries → Inquiry form: the
heading, every field label, the private/group option labels, and the
confirmation screen — in both locales. Anything left empty falls back to the
approved copy in `src/lib/i18n/ui.ts`.

**Your own questions** can be added under the same global: label, key, type
(short text, long text, email, phone, number, date, choose-one, yes/no),
required or not, full or half width, placeholder and help line. Choose-one
questions carry their own options. Answers are stored on each inquiry and
included in the notification email.

Two deliberate limits:

- **The core fields stay fixed** — name, email, phone, private/group,
  organisation, participants, location, date, goal, notes, and the interested
  products and journeys. They are what the notification, the admin columns, the
  status workflow and the CTA prefill are built on. A fully generic form
  builder would store loose key/value pairs and lose all four; in particular
  the prefill, which is a relationship to real products, cannot survive it.
- **Layout is width, not free placement.** A question is full or half width and
  falls in order after Notes. Free-form layout in a CMS reliably produces a
  worse form than a constrained one, and restraint is the whole point here.

Each answer stores the question's wording as it stood when the inquiry arrived,
so rewording a question later does not rewrite what past visitors were asked.
Required answers are re-checked on the server — the browser's copy of which
questions are required is not taken on trust.

Live preview covers the inquiry form, so the page can be watched while the
wording and questions are edited.

**Who gets told** is set in the CMS, under Site settings → Inquiry
notifications. Add as many recipients as you like; each one receives a copy.
The addresses have field-level read access, so they never appear in the public
`/api/globals/site` response — verified.

**The mail server is not in the CMS, and deliberately so.** SMTP credentials
belong in environment variables:

```bash
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=…
SMTP_PASS=…
SMTP_FROM="Atibhagya <hello@atibhagya.com>"
```

Three reasons not to move them into the admin:

- Payload stores text fields in plain text. A mail password in the database is
  a password anyone with database access can read.
- Versioning is on for `site`, so every past password would be kept in the
  version history too.
- The email adapter is built when the app boots. A password changed in the
  admin would not take effect until the next deploy, which is worse than
  useless — it looks like it worked.

Without SMTP configured, Payload logs the notification instead of sending it,
so local development works without a mail server.

## Security

Verified against the running app:

| Surface | Position |
| --- | --- |
| `GET /api/inquiries`, `/api/users` | 403 to anyone not signed in |
| `POST /api/inquiries` | 403. The form writes through the Local API in the server action, which is not subject to collection access — so the public endpoint stays shut to bots |
| `status` field | Host-only at field level; a submission cannot mark itself qualified |
| `posts` | Public reads are filtered to `_status: published`; drafts are staff-only |
| Notification email | The visitor's name is stripped of CR/LF before it reaches the subject line |
| Field lengths | Capped on every free-text field |
| Spam | Off-screen honeypot; a filled trap gets a success screen and is never stored |
| Headers | `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, a closed `Permissions-Policy`, and HSTS |
| Images | `remotePatterns` is limited to the two Wikimedia hosts, so the optimizer cannot be used as an open proxy |
| XSS | No `dangerouslySetInnerHTML` anywhere; all visitor text renders as React children |

Still open, and deliberate:

- **No Content-Security-Policy yet.** It needs a nonce pass over Next's inline
  scripts. Worth doing before launch.
- **No rate limiting** beyond the honeypot. Put the form behind the host's WAF
  (Vercel's, or Cloudflare Turnstile) if it starts drawing abuse.
- **A privacy notice is still missing.** The inquiry collects contact details
  and free text; Indonesia's PDP law and GDPR both expect a notice and a
  retention period. That is a legal call, not a code one.

## Motion

GSAP drives every animation from one client component,
[`src/components/Motion.tsx`](src/components/Motion.tsx). Sections stay server
components and opt in with data attributes, so no section has to know GSAP
exists.

| Attribute | What it does |
| --- | --- |
| `data-headline` | SplitText cuts the heading into its real rendered lines; each rises out of a mask, 90ms apart |
| `data-fade` | Fade and rise on entry |
| `data-rule` | A hairline draws itself across |
| `data-open` | An image opens from its own top edge |
| `data-rowtext` | Catalogue text drifts slower than its photograph |
| `data-row-index` | Feeds the running N° pinned in the left margin |
| `data-zoom`, `data-heroword`, `data-para`, `data-clip` | Hero zoom, hero text parallax, image parallax, scrubbed clip reveals |
| `data-page` | Marks the page wrapper; the arrival animation runs on the `<main>` inside it |

The arrival animation deliberately targets `<main>` rather than the wrapper
around it. A transform on an ancestor becomes the containing block for any
`position: fixed` descendant, so animating the wrapper tore the fixed nav off
the viewport and scrolled it away with the page.

One document-wide ScrollTrigger drives both the nav's progress hairline
(`--scroll-progress`) and the point where it turns ivory (`data-nav-solid`).
They share a trigger because a separate one starting at 82vh reports itself
inactive once the scroll reaches `max`, which dropped the nav back to
transparent at the very bottom of the page.

SplitText is the reason for GSAP rather than hand-written CSS: it measures
lines as they actually render, so a product title that wraps on a narrow screen
still animates line by line. Splitting on the copy's own `
` — the approach
this replaced — animated a wrapped line as one block.

`gsap.matchMedia` carries the reduced-motion branch: under it every element is
set straight to its finished state, so the page is complete and still. A
`<noscript>` rule does the same when JavaScript never runs.

The stylesheet holds the pre-JavaScript start states (hidden headlines,
collapsed rules) so nothing flashes in before the animation begins. That is
also why every entry animation uses `fromTo` rather than `from`: `from` would
read the CSS start state as the *end* state and animate from a value to
itself — an animation that plays and changes nothing.

In development, `window.gsap` and `window.ScrollTrigger` are exposed for
poking at animations from the console. Guarded by `NODE_ENV`, so they never
ship.

### Licence

GSAP is free for commercial use under Webflow's standard licence, including
ScrollTrigger and SplitText. The only prohibited use is building a competing
no-code animation builder.

## Scripts

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Next dev server on :3000 |
| `npm run build` / `start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Writes the approved copy into Payload (EN + ID) |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after a schema change |
| `npm run generate:importmap` | Regenerates the admin import map |

## Before launch

From the content master's own "confirm before publishing" list:

- Destination coverage, and whether programmes run nationwide or in selected
  places only.
- Which named rituals are currently active and bookable. (Ownership is
  settled: Atibhagya and Takshaka are both Werkudara Group brands.)
- Practitioner qualifications and credentials.
- Package durations, group minimums, pricing structure, inclusions, lead times.
- Any wording that could read as a medical or health-outcome claim.

The seeded journeys are structurally real but their specifics are placeholders
for exactly this reason.

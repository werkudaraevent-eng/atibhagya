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
| `postgres://…`            | Staging and production (Neon). Schema by migration, never pushed — see *Deploying* |

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

### The five elements

Every experience carries one of the five elements of Panca Mahabhuta —
earth, water, fire, air, space (`src/lib/elements.ts`). It is a field on
the product, shown as a drawn mark beside the category on the listing and
in the facts column on the page, and it is the catalogue's second filter
("Element", beside "For"). Nothing is ever without one: the import guesses
it from the catalogue text (fire for Agni Hotra, water for Melukat, air for
a sound bath, space for a silent sit), a product with no guess takes its
category's element, and the team corrects any of it in the CMS. The marks
are the ornaments' single gold stroke: three flames, three waves, three
peaks, three lines, a circle around a point.

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
  Every preview target — products, journeys, home, about, the catalogue
  headings and the inquiry form — is a staff-only `/preview/…` route that
  reads the **draft**, so Save Draft is enough to see a change; the public
  routes read published content only.
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
ephemeral — an uploaded photo would vanish on the next deploy. With object
storage on, uploads go **from the browser straight to the bucket** by signed
URL (`clientUploads`), which is also what lets a hero video past Vercel's
4.5 MB request cap.

### The hero video

Home → Hero → **Hero video** takes an upload (MP4 H.264 or WebM) or, failing
that, a URL. The brief the field gives the team: 1920×1080, 10–15 seconds, no
audio, around 4 Mbps, **under 12 MB** — the validator refuses anything larger
or anything that is not a video, and the upload ceiling overall is 30 MB.

What visitors get is decided on their side, not ours: the video is left out
entirely — not loaded and paused, left out — on screens under 820px, when the
browser reports Save-Data or a 2G-class connection, and for anyone who
prefers reduced motion. They see the hero photograph, which is also the
video's poster while it loads. Where it does play it is muted, looped,
`preload="metadata"`, and fades in over the photograph once frames are ready.

### How content resolves

`src/lib/content/defaults.en.ts` and `defaults.id.ts` hold the approved copy.
They are both the seed source and the fallback: each getter in
`src/lib/content/index.ts` reads Payload and merges it over the defaults field
by field, so an empty CMS field — or a missing database — renders the approved
line rather than a gap.

The admin never shows that emptiness, though. An `afterRead` hook on every
global (`src/lib/prefill.ts`) fills each empty field, on read, with exactly
what the site is showing for it — in the locale being edited — so an editor
sees the sentence to change rather than a blank box standing in for it. The
first Publish makes the copy explicit; nothing on the site changes.

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
an intercepting route (`src/app/(site)/[locale]/@modal/(.)inquiry`) lifts the same form
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

**The form is built** under Inquiries → Inquiry form → Fields. Every field is
a row: drag to reorder, remove, relabel, mark required, and choose full or
half width (two halves sit side by side). Each row also has an **On the
form** switch — off keeps the wording, options and rule but takes the field
off the site, for questions that come and go; Remove deletes the row, and
Versions can restore an earlier form. A row is one of:

- a **text kind** — name, email, phone, private/group, organisation,
  participants, location, date, goal, notes — each stored in its own column
  on the inquiry, which is what the admin list, the notification email, the
  status workflow and the CTA prefill are built on;
- **Choose from the site** — a searchable combobox fed by a list the site
  already has: products, journeys or product categories, as one choice or
  several. Typing filters the list (seventy-three products are not something
  to scroll); the choices sit inside the field as chips, collapsing behind
  "+n more" past four. Built on Downshift, headless, so the look is the
  form's own and the keyboard and screen-reader behaviour is not ours to get
  wrong. Products and journeys are stored as links to the real documents; a
  category by name. Add one row per list you want to ask about;
- **Own ideas** — free text the visitor adds as many of as they like;
- a **custom question** with its own key, type (short text, long text, email,
  phone, number, date, month, choose one, choose several, yes/no), options,
  placeholder and help line, stored by key.

With no rows saved, the approved default form in `src/lib/i18n/ui.ts` is
shown — and shown *as rows*, labels and options filled in, so what the site
does is always visible and editable rather than implied by an empty list.
Rules enforced on save: the form always has an Email field (it is how the
team replies), no kind or source appears twice, and every custom question has
a unique key.

Dropdowns — the private/group field and any custom choose-one — carry their
own options on the row: a label per locale and a stored value. The heading
and the confirmation screen are edited in the same global. Anything left
empty falls back to the approved copy.

**Show only when…** gives a row one rule: it appears only while another
field's answer is one of the chosen values — Participants only for Group or
Corporate, a "please specify" only after a Yes. Triggers are the form's own
choice fields (private/group, custom choose-one / choose-several / yes-no),
read live from the form so a row just added is already offered; the values
offered are that trigger's options. A hidden field is neither required nor
stored, and the rule is evaluated again on the server. Deliberately one rule
per field, no AND/OR: the moment a form builder grows a rules engine the
people it was built for stop using it.

Each custom answer stores the question's wording as it stood when the inquiry
arrived, so rewording it later does not rewrite what past visitors were asked.
Validation runs again on the server against the configuration as it is read
from the CMS — the browser's copy of which fields exist and which are required
is not taken on trust, and a field the team has removed is not stored even if
an old draft still carries it.

Live preview covers the inquiry form and reads the draft, so the page can be
watched while fields, rules and wording are edited, before anything is
published. The panel refreshes on Save Draft, not on every keystroke.

**The list keeps itself current.** A Refresh control sits above the inquiries
table, and the table re-fetches on its own once a minute while it is on
screen, so a new inquiry appears without anyone reloading.

**Export to Excel** sits in the same bar: a real `.xlsx` (built with
`exceljs` at `/export/inquiries`, staff only) of the ticked rows or of
everything — one row per inquiry, one column per question including each
custom one by its label, products and journeys by title, header frozen,
filters on. The list's ⋯ menu also offers Payload's own export
(`@payloadcms/plugin-import-export`) for CSV or JSON with a choice of
columns; it downloads directly and writes nothing to disk, which matters on
Vercel.

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
| Spam | Three layers: an off-screen honeypot (a filled trap gets a success screen and is never stored); five submissions per address per ten minutes, after which the form asks the visitor to wait; and Cloudflare Turnstile when its keys are set — invisible unless Cloudflare has a question, verified again on the server |
| Sessions | The admin cookie is `Secure` on every HTTPS deployment and `SameSite=Lax`; five wrong passwords lock the account for ten minutes; a session lasts two hours |
| API surface | GraphQL is off. REST populates one level by default and never more than three, so `?depth=10` cannot turn one request into a hundred joins |
| Headers | `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy`, a closed `Permissions-Policy`, HSTS, and a Content-Security-Policy (below) |
| Images | `remotePatterns` is limited to the two Wikimedia hosts, so the optimizer cannot be used as an open proxy |
| XSS | No `dangerouslySetInnerHTML` with visitor text anywhere; all of it renders as React children |
| Drafts | The inquiry draft lives in `sessionStorage`, so a name and phone number typed on a shared computer are gone when the tab closes |

**Content-Security-Policy.** Pages are static and cached, so there is no
per-request nonce for Next's inline scripts; `'unsafe-inline'` stays for
scripts and styles. Everything else is locked to our own origin plus
Cloudflare's bot check: no third-party script, frame, connection or plugin,
and no embedding of the site elsewhere (`frame-ancestors 'self'`). It ships
as `Content-Security-Policy-Report-Only` until `CSP_ENFORCE=1` is set — a
violation shows in the browser console rather than as a broken page. Turn it
on for staging, click through the site and the admin (including an upload),
and when the console stays clean set it for production.

**The rate limit is per serverless instance.** It stops a burst from one
address; a distributed flood needs the host's firewall. On Vercel: Firewall →
Rules → rate-limit `POST` to `/inquiry` and `/id/inquiry`. Behind Cloudflare:
a rate-limiting rule on the same paths, and Cloudflare Access in front of
`/admin` so the login page is never reachable from an unknown network.

**When the database cannot be reached.** Outside production the site falls
back to its built-in sample content, so a bare checkout and staging keep
rendering. In production it does not: the page throws, and Next keeps
serving the last copy it built. A five-minute outage is invisible; a brand
new page during an outage is a styled error page with a retry, not the
sample catalogue cached as if it were real.

**Checks and upkeep** (`.github/`):

- `ci.yml` — every pull request and every push to `staging` or `main` runs
  the type check, ESLint and a full build; `npm audit` runs beside them and
  reports without blocking.
- `dependabot.yml` — weekly dependency PRs against `staging`, grouped; major
  versions of Next, React and Payload are left for a deliberate upgrade.
- `backup.yml` — Mondays: a `pg_dump` of production and a mirror of the media
  bucket, into a separate private R2 bucket. Needs the secrets listed at the
  top of the file, and a lifecycle rule on that bucket. Try a restore on a
  Neon branch once, before it matters.

**Who changed what.** Every save stamps *Last edited by* on the document
(sidebar, list columns) and on the version it creates, and the Versions tab
lists it beside the date. Comparing two versions of the inquiry form names
each field row ("03 · Phone — On the form: yes → no") rather than "Item 03".

**Data notice.** The line under the submit button (Inquiries → Inquiry form →
Other wording → Data notice) says what happens to what a visitor writes.
Indonesia's PDP law (UU 27/2022) expects it. Still open: a retention period
— decide how long a closed inquiry is kept, and delete on that schedule.

## Deploying

Three environments, and content does not travel between them.

| Environment | Branch | Database | Media | URL |
| --- | --- | --- | --- | --- |
| Preview | any branch / PR | Neon `staging` | `atibhagya-media-staging` | `*.vercel.app`, automatic |
| Staging | `staging` | Neon `staging` | `atibhagya-media-staging` | `staging.atibhagya.com`, password-protected |
| Production | `main` | Neon `main` | `atibhagya-media` | `atibhagya.com` |

Code moves branch → `staging` → `main`. **Content does not**: products,
photographs and form wording live in each environment's own database. The
team edits content in the **production** CMS — drafts, preview and versions
are the safety net — and staging exists to review *code*, on a copy of
production data (Neon: reset the `staging` branch from `main`). Say this
out loud before anyone types twenty products into staging.

### Stack

- **Vercel** (Pro — Hobby forbids commercial use and has no password
  protection for staging). Build command: `npm run build:deploy` — migrations
  first, then the build. Migrations run only for production and the `staging`
  branch; a preview build of any other branch skips them, so a migration file
  still being worked on cannot reshape the staging database from a side branch.
- **Neon** Postgres, one project, branches `main` and `staging`.
- **Cloudflare R2**, two buckets. Uploads go straight from the browser to
  the bucket, so each bucket needs a CORS rule allowing `PUT` from its
  site's origin:

  ```json
  [{ "AllowedOrigins": ["https://atibhagya.com"], "AllowedMethods": ["GET", "PUT"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
  ```

- **Resend** (or any SMTP) for inquiry notifications; a separate key per
  environment, and staging's recipient is the team, not the client.

Variables per environment are listed and explained in
[`.env.example`](.env.example). Secrets are entered in Vercel's environment
settings; nothing goes in the repo.

`NEXT_PUBLIC_SERVER_URL` must be the address people actually open. Without
it, Payload falls back to Vercel's stable addresses — the production URL,
or a branch's alias — never the per-deployment URL, which is a different
host from the one in the address bar (a logout sent there clears nothing).

### Git flow

```
feat/xyz ──PR──▶ staging ──PR──▶ main
   │               │              │
 preview      staging site    production
```

- Work on a branch (`feat/…`, `fix/…`). Every push gets a preview URL.
- PR into `staging`; merging deploys the staging site for the team to review.
- When staging is approved, PR `staging` → `main`; merging deploys production.
- A hotfix goes `fix/…` → `main` directly, then `main` is merged back into
  `staging` so the two never drift.
- `main` is protected on GitHub: pull requests only, no direct pushes.

### Schema changes are migrations

Locally, SQLite is reshaped automatically (`push`). Postgres never is. Every
schema change — a new field, a renamed collection — becomes a migration
file under `src/migrations`, and the production build applies pending ones
before `next build`.

To create one, put the Neon **staging** connection string in `.env` as
`DATABASE_URI_STAGING` (once) and run:

```bash
npm run migrate:create:staging
```

That swaps the staging database in for the one command only — local
`DATABASE_URI` stays on SQLite, so a forgotten edit can never leave
development writing to staging. The same swap serves the data scripts:
`npm run import:products:staging` and `npm run seed:staging` run against
staging, after the deploy carrying any new columns has gone green. Review the generated SQL, commit it with
the config change, and the next deploy applies it.
`npm run migrate:status:staging` shows what staging has pending.

### Only production is indexed

`src/app/robots.ts` disallows everything unless the deployment is
production (`src/lib/env.ts`: `VERCEL_ENV`, or `NODE_ENV` off Vercel), and
every page carries `noindex` outside production as well.
The sitemap (`/sitemap.xml`) lists both languages of every public page
with `hreflang` alternates.

### First deploy, in order

1. Neon: create the project; note the `main` and `staging` connection strings.
2. R2: second bucket `atibhagya-media-staging`; CORS on both; API token per bucket.
3. Vercel: import the GitHub repo; add the `staging` environment (Settings →
   Environments) tied to the `staging` branch; enter variables for
   production and staging; set the build command; enable password
   protection on staging.
4. Locally, against the Neon `staging` branch: `npm run migrate:create`
   (the initial migration), commit, push `staging`. Vercel builds, migrates,
   deploys.
5. On staging: create the first admin, `npm run import:products` against
   the staging database, upload a photograph and a hero video, send an
   inquiry, check the email arrives. Fix what does not.
6. Merge to `main`; point the domain; repeat step 5's checks once.

## Light and dark

The palette is two roles, ink (`--biru`) and paper (`--ivory`), plus gold.
Dark mode swaps the roles rather than adding a second palette: under
`html[data-theme='dark']` the paper becomes the brand navy, the ink becomes
ivory, and the gold is lifted a step so it still carries on the darker
ground. Translucent ink and paper — hairlines, captions, the nav's veil, the
dialog's backdrop — are written as `rgba(var(--ink-rgb), …)` /
`rgba(var(--paper-rgb), …)` so they follow the swap. What sits on a
photograph (hero type, scrims, the ghost button, the mobile menu curtain)
is fixed and does not change with the theme, because the photograph does
not.

The switch is in the header beside EN · ID: a sun that a shadow slides
across until only a crescent is left, the rays folding away — the same
motion in reverse to come back. The choice is kept in `localStorage`
(`atibhagya:theme`); until one is made the site follows the system
preference. A two-line script in `<head>` applies the theme before first
paint so nothing flashes, and the change itself cross-fades colours over
half a second, then removes that blanket transition so it never touches
the site's own motion.

## Ornament

Three marks, all taken from the wordmark, in `src/components/site/Ornament.tsx`:
the **wave** under the A, the **macron** over the ā with its dot, and one
that is not in the logo — a **sprout**, for growth, used sparingly. Single
stroke, one weight, gold; they draw themselves in once (`data-draw`, GSAP
DrawSVG) and then hold still. Two compositions: a **Divider** (hairline,
mark, hairline) between a heading and what follows it, and a **SectionMark**
(N° 01, mark, label) opening a section in place of a bare eyebrow. The
rules that keep them from becoming wallpaper: derived from the logo only,
one per section, drawn once and never looped.

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

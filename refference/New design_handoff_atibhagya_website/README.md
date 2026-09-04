# Handoff: Atibhagya Wellness Website

## Overview
Marketing website + guest application flow for **Atibhagya**, a private healing estate in Ubud, Bali ("by application only, eight guests at a time"). Two designs are included: the **homepage** ("Atibhagya Estate") and the **multi-step application form** ("Atibhagya Application").

## ⚠️ Read first — instructions from the client
1. **Content is final. Do not change it.** Every headline, paragraph, label, number, name, price, FAQ and section order in `design/Atibhagya Estate.dc.html` and `design/Atibhagya Application.dc.html` must be reproduced **verbatim**. Do not rewrite, "improve", shorten, translate or reorder copy. Do not add or remove sections. (The ID locale is Phase 2 via CMS — build EN exactly as designed.)
2. **The JS motion system is the part the client loves most — port it faithfully.** Especially: the **path indicator** (bottom-right thread with 6 spiral knots + stage labels), the **vertical chapter mark** at the left edge, the **image effects** (lerped parallax with "pull", horizontal drift on card strips, clip reveals), and the **text effects** (word-by-word blur → sharp settle, 1.5s breath-tempo reveals, hero veil dissolve). The complete reference implementation is in `design/motion-reference.js` (extracted verbatim from the prototype) — port it 1:1 into a client hook; **keep every constant** (lerp factors, easings, delays, thresholds). Do not swap in a generic animation library preset that changes the feel.
3. **Do not redesign.** Same colours, type, spacing, ornaments (SVG paths are in the file). If something is technically impossible in the stack, keep the design and ask — don't substitute.
4. Screenshots in `screenshots/` show layout with **image placeholders** (the sandbox couldn't load the CC photos); open the HTML file in a browser for the real photos and live motion.

## About the Design Files
The files in `design/` are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. Your task is to **recreate these designs in a Next.js (App Router) + Payload CMS codebase** using its established patterns. Open the `.dc.html` files in a browser to see them live (they need `support.js` and `image-slot.js` next to them, included).

## Target stack (confirmed with the client)
- **Framework:** Next.js (React, App Router)
- **CMS:** Payload
- **Hosting:** Vercel (front end) + Payload Cloud / separate managed Postgres
- **Locales:** Bilingual **EN (default)** + ID, via Payload localization. URL strategy: `/` = EN, `/id/...` = Indonesian.
- **Blog/journal:** Phase 2 — model the Payload collection now, build the front end later.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy tone and interactions are final intent. Recreate pixel-perfectly. Photos are CC-licensed placeholders from Wikimedia Commons — swap for the client's own photography (the `<image-slot>` elements mark every swappable image and its intended subject).

## Design Tokens
Colors:
- `#10222f` — biru (primary dark; nav, buttons, footers use `#0d1c27` for footer bg)
- `#f6f3e7` — ivory (page background, light text on dark)
- `#efece0` — ivory-2 (alternating section background)
- `#e9e4d8` — light text on dark surfaces
- `#c69a4b` — emas / gold (accents on dark)
- `#a97b2a` — deep gold (accents on light, links)
- `#e3bd72` — gold hover on dark
- Text muted on light: `rgba(16,34,47,.65)` body, `.55` labels, `.45` captions

Typography:
- **Marcellus** (serif, weight 400 only) — all headlines, numerals, quotes
- **Karla** (sans, 300/400/500) — body, labels, nav
- Label style used everywhere: 10.5–11px Karla, uppercase, letter-spacing .2–.4em
- Hero tagline: Marcellus, `clamp(40px, 5.8vw, 92px)`, line-height 1.18
- Section headlines: Marcellus `clamp(26px, 3.2vw, 44px)`
- Body: Karla 300, 14.5–15.5px, line-height 1.8–2.1

Other: border-radius 2px on buttons/cards (chips 20px pill); hairline borders `rgba(16,34,47,.12–.25)`; shadows avoided except hero text-shadow and the sticky CTA (`0 20px 50px -20px rgba(16,34,47,.6)`).

Motion tokens: standard ease `cubic-bezier(.22,1,.36,1)`; reveal 1.5s; word settle 1.3s + 70ms stagger; hover/colour 0.3–0.5s; breathe 4s; mist 9s; flow 2.8s linear; lerp factors 0.09 (scroll), 0.12 (velocity), 0.2 (cursor).

SVG glyphs (reuse the exact paths from the Estate file): **spiral** `M17.5 8.5c0-3-2.4-5-5.3-5C8.6 3.5 6 6.4 6 10.2c0 4.6 3.3 8.3 7.5 8.3 2.5 0 4.1-1.5 4.1-3.4 0-1.6-1.2-2.7-2.6-2.7-1.3 0-2.2.9-2.2 2` (24×24 viewBox), **wave** rows `M2 5c3.5-3 7.5 3 11 0s7.5-3 11 0 7.5 3 11 0 7.5-3 11 0` (48×16), **shoot** ornament (30×34) in each chapter header, **indicator thread** `M12 8 C15 14, 9 20, 12 26 …` (24×106).

## Screens / Views

### 1. Homepage — `design/Atibhagya Estate.dc.html`
Sections in order (each `<section data-screen-label>` in the file):
1. **Nav** — fixed, 3-column grid: left menu links / centered gold logo / right menu links. Transparent over hero, gains ivory translucent bg (`rgba(246,243,231,.94)`) + `blur(10px)` after `scrollY > 0.82vh`. Links: Journeys, Residence, Healing (left) · Arrival, Apply (right).

   **Fixed overlays (desktop ≥ 900px, appear once nav is solid):**
   - **Path indicator** (`data-role="dotnav"`) — bottom-right, `right:40px; bottom:40px`, 24×106px. A gently waving 1px vertical thread (bg `rgba(16,34,47,.09)`, fill `rgba(169,123,42,.7)`) with 6 spiral knots at 18px intervals for the 6 stages `top → ch1 → ch2 → ch3 → ch4 → apply`. Thread fill = scroll progress between section tops (measured at 45% viewport). Knot states: inactive `scale(.5)` `rgba(16,34,47,.22)`; passed `scale(.6)` `rgba(169,123,42,.45)`; active `scale(1)` `#a97b2a` + `breathe` animation (4s, scale 1→1.18); each knot's spiral path draws in (`stroke-dashoffset`) as the thread reaches it. Active knot shows a label to its left (Karla 9px, uppercase, `.3em`): **Tiba · Memilih · Bermukim · Pulih · Menempuh · Memulai**. Below the thread, a 3-line wave glyph (14×9px) that animates (`flow`, 2.8s linear, translateX −14px) only when `apply` is active. Over dark sections (`[data-dark]`) all colours switch to ivory/light-gold variants (`rgba(246,243,231,.35)`, `#e3bd72`).
   - **Chapter mark** (`data-role="chapmark"`) — left edge, `left:40px; top:50%`, vertical text (`writing-mode: vertical-rl; rotate(180deg)`): gold Marcellus 15px number · 36px 1px rule · Karla 10px uppercase chapter name. Visible only while inside ch1–ch4; on chapter change: fade out (0.7s), swap text after 450ms, fade in.
   - **Sticky Apply CTA** (`data-role="stickyapply"`) — bottom-left, `left:28px; bottom:28px`, dark card (`#10222f`, gold hairline border, 2px radius): eyebrow "By application only" (Karla 9px gold) + "Begin your application" (Marcellus 15px) + →. Hidden once the Apply section is within 90% viewport. Hover: bg `#a97b2a`.
   - **Custom cursor** (`data-role="cursor"`, pointer:fine only, `prefers-reduced-motion` off; CMS/tweak flag `customCursor`) — 6px gold dot following the mouse with lerp 0.2; over `a, button, images, [data-clip]` the dot collapses and a 30px gold spiral fades/rotates in (0.6s cubic-bezier(.22,1,.36,1)). Native cursor hidden via `cursor:none` on body/a/button.

   **Mobile (< 900px):** dotnav, chapmark, sticky CTA and cursor are hidden. Instead a **bottom bar** (`data-role="mobilebar"`, 52px, ivory `.94` + blur, top hairline) slides up once the nav is solid: left = gold chapter number + uppercase chapter name (updates with active section), right = "Apply" link; a 1px gold progress line along its top edge tracks page scroll.
2. **Hero** — 100vh image (misty temple), dark gradient scrim, centered: eyebrow "Atibhagya — Private healing estate", tagline **"Where the island holds you still."**, "UBUD · BALI" with wave glyphs, chapter index links along the bottom, spiral scroll cue. Optional background video via CMS field (`heroVideo` URL; falls back to image). Two extra layers: a **breathing mist** (radial ivory gradient at 50%/72%, `mist` keyframes 9s: opacity .45→.9, scale 1→1.07) and an **ivory veil** (`data-heroveil`) whose opacity = `clamp((scrollY − 0.25vh) / 0.6vh)` so the hero dissolves into the page colour before the Manifesto.
3. **Manifesto** — centered eyebrow "Tanah yang tenang" + headline + ornament divider (wave · spiral · wave, spiral draws on view) + short poem-like paragraph + three large stats separated by 1px rules: **7 ha** "A sanctuary explored on foot" · **8** "Guests at a time — never more" · **48** "Residents a year since 2021" (Marcellus `clamp(70px,8vw,120px)`).
4. **Highlights index** — numbered list of the four chapters, each row links to its section.
5. **Ch 01 Journeys** — full-bleed parallax image with clip reveal, then intro text + 4 journey cards (image, title, blurb).
6. **Ch 02 Residence** (bg `#efece0`) — same pattern + 3-card strip (River Pools, Private Pools, Garden Pavilions).
7. **Ch 03 Healing** — same pattern + 3-card strip (Gamelan Sound Bath, Morning Offerings, Dawn Silence), then:
   - **Practitioners** — eyebrow "The hands that hold you", headline "Invited by name, never booked from a list.", 3-column grid (`minmax(240px,1fr)`, gap 40px): 190×236px portrait slot, name (Marcellus 20px), lineage line (Karla 10px uppercase gold), one italic quote (Karla 300 13.5px). Draft names/quotes are placeholders — CMS collection `practitioners`.
   - **Guest quote** — centered 640px block with top/bottom hairlines: “I arrived unable to sleep and left unable to hurry.” — "A resident · The Seven Days · 2025" (from `testimonials`).
8. **A day at Atibhagya** (`id="day"`, `data-dark`, bg `#10222f`, text `#f6f3e7`) — eyebrow (gold `#c69a4b`), headline "You will not see a schedule. / This is roughly how a day unfolds.", then a **vertical timeline**: centre 1px rule (`rgba(246,243,231,.12)`) with a gold fill line whose height = `clamp((0.62vh − trackTop) / trackHeight) × trackHeight` (grows as you scroll). Six rows, grid `1fr 72px 1fr`, padding 30px 0: time right-aligned (Marcellus `clamp(28px,3vw,44px)` gold), 7px ring dot centre, title (Marcellus 20px) + description (Karla 300 13.5px, ivory .62) left. Times/copy: 05:30 Dawn breath on the terrace · 08:00 Breakfast where the morning finds you · 10:30 One rite, never two · 14:00 The unplanned hours · 18:30 Dinner from the estate · 21:00 Night silence. Closing line about the day being adjusted each evening.
9. **Ch 04 Arrival** (bg `#efece0`) — "N° 04", DPS — UBD split headline (halves slide apart on scroll), coordinates row (Denpasar ↔ estate), transfer description, wide image, 4 stats, "How it works" 5-step list.
10. **Quote** — founder quote, oversized ghost quotation mark parallax behind.
11. **Marquee** — infinite horizontal strip of images (48s linear loop).
12. **Before you apply** (`id="before"`, bg `#efece0`) — two columns (`auto-fit minmax(300px,1fr)`, gap `clamp(48px,7vw,120px)`):
   - Left: eyebrow "Why by application", headline "We take eight residents at a time. So we choose carefully — and so should you.", 3 rows (roman numeral gold 15px · title Marcellus 17px · body Karla 13.5px): I Eight at a time · II We match, not sell · III An answer within three days.
   - Right: eyebrow "Questions we are often asked", **FAQ accordion** (5 items, one open at a time, none open by default). Row: question (Marcellus 17px, hover gold) + 14px plus icon that rotates 45° when open; answer panel animates with `grid-template-rows: 0fr → 1fr` (0.6s cubic-bezier(.22,1,.36,1)), inner `overflow:hidden`. Questions: cost · medical facility? · partner/family? · cancellation · religious/Hindu?
13. **Apply CTA** — 78vh image, gradient to dark, breathing spiral glyph, headline "Make this rest uniquely yours" + "Begin the application" outlined button → application form. Pricing visibility across the site is controlled by a `showFees` boolean (CMS field).
14. **Footer** (bg `#0d1c27`) — enquiries (email, WhatsApp Business), sitemap, logo, "By application only. Eight guests at a time.", legal row.

**Scroll & motion system** (all in the Estate file's logic class — reference implementation; recreate with rAF + IntersectionObserver, or GSAP ScrollTrigger/Lenis if already in the stack; everything except reveals is disabled under `prefers-reduced-motion`):
- **Reveals** (`data-fade`): opacity 0 → 1, translateY 26px → 0, `1.5s cubic-bezier(.22,1,.36,1)`, triggered at 12% intersection / 92% viewport. The 1.5s "breath" tempo is deliberate — don't speed it up.
- **Word settle** (`data-words` on chapter/section headlines): split text nodes into inline-block word spans (keep `<br>`), each starts `opacity 0; filter blur(8px); translateY(8px)` and settles with `1.3s cubic-bezier(.22,1,.36,1)`, staggered 70ms per word.
- **Lerped parallax with pull** (`data-para` full-bleed chapter images, 116% tall, top −8%): a smoothed scroll value `sm.y += (scrollY − sm.y) × 0.09` and velocity `sm.v += (Δy − sm.v) × 0.12` run in a rAF loop while moving. Transform = `translateY(base − lag × 0.18) scale(1 + |pull| × 0.025)` where `base = (imageCentre − viewportCentre) × −0.08`, `lag = sm.y − scrollY`, `pull = clamp(|v| / 60)`. Result: images trail the scroll slightly and stretch ~2.5% at speed, then settle.
- **Strip images** (`data-pull` inside 280px `overflow:hidden` frames, image 100%+48px tall): `translate(dx, c × −18 − lag × 0.12) scale(1 + |pull| × 0.03)`, `c` = normalised distance from viewport centre; **horizontal drift** `dx = (index − 1) × c × −16` so the left/centre/right cards drift apart (−/0/+).
- **Clip reveal** (`data-clip`): `clip-path: inset(14% 9%) → inset(0)` eased (cubic ease-out) over 55% of viewport travel.
- **Hero**: image `scale(1 → 1.12)` over first viewport; headline translateY 0.22× scroll and fades by 0.7vh; ivory veil as above.
- **Quote mark**: translateY 0.18× offset from centre. **DPS — UBD**: halves translate ±min(120px, 6vh) with opacity .2→1.
- **Ornaments** (`data-role="ornament"`, `[data-draw]` paths with `pathLength="100"`): stroke draws in (`stroke-dashoffset 100 → 0`, 1.4–1.6s, staggered delays) at 40% intersection, once.
- **Day timeline fill** and **path indicator thread**: see sections 8 and Nav above.

### 2. Application form — `design/Atibhagya Application.dc.html` (screenshots: `screenshots/01–07-application.jpg`)
Two-column wizard: dark sidebar (logo, intro copy, clickable step list with progress states, contact line) + ivory main panel (step counter, warm headline + reassurance line, fields, Back/Continue nav; final step button = "Send application"; step 7 = thank-you state).

Steps and fields:
1. **About you** — full name, email, WhatsApp/phone, country
2. **Dates & stay** — arrival month, guests (1–2), stay length chips (7/10/14 nights)
3. **Your intention** — multi-select chips (Rest & burnout, Grief or loss, A life transition, Reconnection, Simply silence) + free textarea (the key field)
4. **Health & wellbeing** — sleep select, mobility select, confidential notes textarea
5. **Table & diet** — diet chips, allergies input
6. **Investment** — budget radio rows (USD 9,800–14,000 / 14,000–20,000 / 20,000+) + "How did you find us?"
7. **Received** — thank-you: "You'll hear from one of us — a person, with a name — within two days."

Copy tone throughout: warm, personal, unhurried — keep the existing microcopy verbatim (EN); provide ID translations via CMS/locale files.

## Interactions & Behavior
- Chips/radios: selected = `#10222f` bg, `#f6f3e7` text, `#a97b2a` border; unselected = transparent with `rgba(16,34,47,.25)` border. 0.3s ease transitions.
- Inputs: bottom-border only (`1px rgba(16,34,47,.25)`), gold border on focus, no outlines/boxes except textareas (full 1px border).
- Primary button: dark fill → gold on hover; uppercase 11px letter-spaced label.
- Step sidebar: completed = gold-filled check circle; active = gold ring + subtle gold row bg.
- Validation: required per step before Continue (name/email on 1, intention text on 3); inline, gentle wording. Persist draft in localStorage.
- Submission: POST to Payload `applications` collection + email notification to hosts; show step 7 on success.

## State Management
Form wizard state (current step, field values, selections) client-side; submit once at the end. Homepage is fully static/SSG from Payload content with ISR revalidation.

Homepage client state (small, hook-level): `activeSection` (top/ch1–ch4/apply, derived from section tops at 45% viewport), `navSolid`, `isWide` (≥900px), `onDark` (indicator/chapmark overlaps a `[data-dark]` section), `openFaq` (index | null), smoothed scroll `{y, v}`, cursor `{x, y, hot}`. Tweak/CMS flags: `showFees` (boolean), `heroVideo` (URL), `customCursor` (boolean, default true).

## Payload CMS collections (client-confirmed scope)
- **pages/home** (global): hero (tagline, eyebrow, image, optional `heroVideo` URL), manifesto, chapter sections (title, intro, image, cards[]), quote, CTA copy, `showFees` boolean. All text fields localized (EN/ID).
- **journeys**: title, blurb, image, duration, optional pricing (drives the 4 journey cards; fees respect `showFees`).
- **experiences**: label strips + marquee items (title, caption, image, category: residence/healing).
- **testimonials**: quote, attribution (Quote section, guest quote in Healing; future carousel).
- **practitioners**: name, lineage line, portrait (media), one-line quote, order. Drives the "The hands that hold you" grid.
- **dayTimeline** (on the home global, array): time, title, description — the six "A day at Atibhagya" rows.
- **faqs**: question, answer (rich text short), order. Localized.
- **whyApplication** (on the home global, array of 3): numeral, title, body.
- **pathStages** (site settings, 6 labels): Tiba, Memilih, Bermukim, Pulih, Menempuh, Memulai — the indicator labels (localized; EN equivalents Arrive, Choose, Settle, Heal, Travel, Begin).
- **applications**: all form fields above + status (new/replied/accepted/waitlist), locale, timestamps. Access: admin-only read.
- **media**: uploads with alt text (localized) + credit fields.
- **posts** (Phase 2 blog): title, slug, cover, rich text, localized.

## Assets
- `design/assets/logo-atibhagya-gold.png` — gold logotype (nav, sidebar, footer)
- All photos are Wikimedia Commons CC placeholders (URLs + credits are in the Estate file's `<image-slot credit>` attributes) — replace with client photography; keep credits if any CC image ships.
- Fonts: Google Fonts — Marcellus, Karla (self-host via `next/font`).

## Draft content to replace before launch
Practitioner names/quotes, "48 residents a year since 2021", the guest testimonial, prices and FAQ answers are **placeholder drafts** written for layout — confirm every one with the client.

## Files
- `design/Atibhagya Estate.dc.html` — homepage design (open in browser)
- `design/Atibhagya Application.dc.html` — application form design
- `design/motion-reference.js` — **the scroll/animation logic, extracted verbatim** (see "Read first"). Port this.
- `design/support.js`, `design/image-slot.js` — runtime needed to view the prototypes
- `screenshots/01–07-application.jpg` — application form, all steps
- `screenshots/01–11-home-*.jpg` — homepage, top to bottom (hero, manifesto, ch1, ch1 cards, ch2 strip, ch3 practitioners, day timeline, ch4 arrival, before-you-apply + open FAQ, apply CTA, footer). Images appear as placeholders in captures — open the HTML for real photos.

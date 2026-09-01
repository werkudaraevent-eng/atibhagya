# Handoff: Atibhagya Wellness Website

## Overview
Marketing website + guest application flow for **Atibhagya**, a private healing estate in Ubud, Bali ("by application only, eight guests at a time"). Two designs are included: the **homepage** ("Atibhagya Estate") and the **multi-step application form** ("Atibhagya Application").

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

Other: border-radius 2px on buttons/cards (chips 20px pill); hairline borders `rgba(16,34,47,.2–.25)`; shadows avoided except hero text-shadow.

## Screens / Views

### 1. Homepage — `design/Atibhagya Estate.dc.html`
Sections in order (each `<section data-screen-label>` in the file):
1. **Nav** — fixed, 3-column grid: left menu links / centered gold logo / right menu links. Transparent over hero, gains dark translucent bg + blur on scroll. Links: Journeys, Residence, Healing (left) · Arrival, Apply (right).
2. **Hero** — 100vh image (misty temple), dark gradient scrim, centered: eyebrow "Atibhagya — Private healing estate", tagline **"Where the island holds you still."**, "UBUD · BALI" with hairline rules, chapter index links along the bottom, scroll cue. Optional background video via CMS field (`heroVideo` URL; falls back to image).
3. **Manifesto** — centered eyebrow "Tanah yang tenang" + headline + short poem-like paragraph.
4. **Highlights index** — numbered list of the four chapters, each row links to its section.
5. **Ch 01 Journeys** — full-bleed parallax image with clip reveal, then intro text + 4 journey cards (image, title, blurb).
6. **Ch 02 Residence** (bg `#efece0`) — same pattern + 3-card strip (River Pools, Private Pools, Garden Pavilions).
7. **Ch 03 Healing** — same pattern + 3-card strip (Gamelan Sound Bath, Morning Offerings, Forest Sessions).
8. **Ch 04 Arrival** (bg `#efece0`) — "N° 04", coordinates row (Denpasar ↔ estate), transfer description, wide image.
9. **Quote** — founder quote, oversized ghost quotation mark parallax behind.
10. **Marquee** — infinite horizontal strip of experience labels.
11. **Apply CTA** — 78vh image, gradient to dark, headline + "Begin your application" button → application form. Pricing line visibility is controlled by a `showFees` boolean (CMS field).
12. **Footer** (bg `#0d1c27`) — enquiries (email, WhatsApp Business), sitemap, logo, "By application only. Eight guests at a time.", legal row.

Scroll behavior: fade-in-up reveals (`data-fade`), parallax images (`data-para`), clip-path reveals (`data-clip`), slow hero zoom, hero text parallax (translateY at 0.22× scroll). Implement with IntersectionObserver + rAF or a light library; respect `prefers-reduced-motion`.

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

## Payload CMS collections (client-confirmed scope)
- **pages/home** (global): hero (tagline, eyebrow, image, optional `heroVideo` URL), manifesto, chapter sections (title, intro, image, cards[]), quote, CTA copy, `showFees` boolean. All text fields localized (EN/ID).
- **journeys**: title, blurb, image, duration, optional pricing (drives the 4 journey cards; fees respect `showFees`).
- **experiences**: label strips + marquee items (title, caption, image, category: residence/healing).
- **testimonials**: quote, attribution (Quote section; future carousel).
- **applications**: all form fields above + status (new/replied/accepted/waitlist), locale, timestamps. Access: admin-only read.
- **media**: uploads with alt text (localized) + credit fields.
- **posts** (Phase 2 blog): title, slug, cover, rich text, localized.

## Assets
- `design/assets/logo-atibhagya-gold.png` — gold logotype (nav, sidebar, footer)
- All photos are Wikimedia Commons CC placeholders (URLs + credits are in the Estate file's `<image-slot credit>` attributes) — replace with client photography; keep credits if any CC image ships.
- Fonts: Google Fonts — Marcellus, Karla (self-host via `next/font`).

## Files
- `design/Atibhagya Estate.dc.html` — homepage design (open in browser)
- `design/Atibhagya Application.dc.html` — application form design
- `design/support.js`, `design/image-slot.js` — runtime needed to view the prototypes
- `screenshots/01–07-application.jpg` — application form, all steps
- Homepage screenshots are not included (external CC images can't be embedded in captures) — view the HTML file directly instead.

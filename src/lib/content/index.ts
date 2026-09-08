import { isProduction } from '../env'
import { getPayloadSafe } from '../payload'
import { defaults } from './defaults'
import { guessElement, isElement } from '../elements'
import { dict } from '../i18n/ui'
import type { Dict } from '../i18n/ui'
import {
  TEXT_KINDS,
  fieldName,
  isPickSource,
  isTextKind,
  readShowWhen,
  type FieldType,
  type FormField,
} from '../inquiry-fields'
import type {
  AboutContent,
  EventCard,
  EventContent,
  EventDay,
  EventLink,
  Facilitator,
  HomeContent,
  Img,
  Journey,
  Locale,
  Product,
  ProductCategory,
  SiteContent,
  Venue,
} from './types'

type Any = Record<string, any>

/**
 * When a read from the CMS fails. Outside production the approved default
 * content is the right answer — a build without a database, a local
 * checkout, staging while Neon wakes. In production the page throws
 * instead, so Next keeps serving the last good copy it cached rather than
 * the sample catalogue.
 */
const recover = <T>(err: unknown, fallback: T): T => {
  if (isProduction) throw err
  console.warn('[atibhagya] CMS read failed, using default content:', err)
  return fallback
}

/** Keeps the approved copy when a CMS field has been left empty. */
const or = <T>(value: T | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string' && value.trim() === '') return fallback
  if (Array.isArray(value) && value.length === 0) return fallback
  return value
}

/** A non-empty string, or nothing — for fields that have no approved copy. */
const str = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() !== '' ? value : undefined

const ownOrigin = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

/**
 * Where Payload serves uploaded files from. A URL with this path is one of
 * ours whatever host it carries — a preview deployment's, a branch alias's —
 * and `next/image` needs it relative, or it refuses the unknown host.
 */
const OWN_FILE_PATH = '/api/media/file/'

/**
 * Payload returns absolute URLs because `serverURL` is set for the admin. Left
 * as they are, `next/image` treats our own uploads as a remote host and
 * refuses them unless the deploy domain is listed in `remotePatterns` — so an
 * upload of ours is folded back to a relative path.
 */
const localise = (url: string) => {
  if (ownOrigin && url.startsWith(ownOrigin)) return url.slice(ownOrigin.length) || '/'
  // Payload's own files, on any host this deployment happens to have.
  const at = url.indexOf(OWN_FILE_PATH)
  if (at !== -1 && /^https?:\/\//.test(url)) return url.slice(at)
  return url
}

/**
 * The file the site should actually serve: the 2400px rendition Payload made
 * at upload, not the original. The original may be a 30 MB, 8000px export,
 * and every request for it has to pass through a serverless function and
 * the image optimizer — which, on a cold cache, is where a hero photograph
 * times out and arrives as a broken image. A rendition exists only when the
 * original was wider than it, so smaller files fall through to themselves.
 */
const servable = (doc: Any): string | undefined => {
  const sizes = doc.sizes as Record<string, { url?: string | null } | undefined> | undefined
  return sizes?.hero?.url || sizes?.wide?.url || doc.url || undefined
}

const toImg = (media: unknown, fallback: Img): Img => {
  if (!media || typeof media !== 'object') return fallback
  const doc = media as Any
  const url = servable(doc)
  if (!url) return fallback
  return {
    src: localise(url),
    alt: doc.alt ?? fallback.alt,
    credit: doc.credit ?? undefined,
    creditUrl: doc.creditUrl ?? undefined,
  }
}

const labels = (rows: unknown): string[] =>
  Array.isArray(rows) ? rows.map((r: Any) => r?.label).filter(Boolean) : []

const gallery = (rows: unknown, fallback: Img[]): Img[] => {
  if (!Array.isArray(rows) || rows.length === 0) return fallback
  const mapped = rows
    .map((r: Any, i: number) => toImg(r?.image, fallback[i] ?? fallback[0]))
    .filter(Boolean) as Img[]
  return mapped.length ? mapped : fallback
}

const toCategory = (doc: unknown): ProductCategory | undefined => {
  if (!doc || typeof doc !== 'object') return undefined
  const c = doc as Any
  return { id: String(c.id), slug: c.slug ?? '', name: c.name ?? '' }
}

const toVenue = (doc: unknown): Venue | null => {
  if (!doc || typeof doc !== 'object') return null
  const v = doc as Any
  return {
    id: String(v.id),
    name: v.name ?? '',
    location: v.location ?? undefined,
    description: v.description ?? undefined,
  }
}

const toFacilitator = (doc: unknown): Facilitator | null => {
  if (!doc || typeof doc !== 'object') return null
  const f = doc as Any
  return {
    id: String(f.id),
    name: f.name ?? '',
    role: f.role ?? undefined,
    bio: f.bio ?? undefined,
    photo: f.photo?.url
      ? { src: localise(servable(f.photo) ?? f.photo.url), alt: f.photo.alt ?? f.name ?? '' }
      : undefined,
  }
}

const toProduct = (doc: Any, fallback: Product): Product => ({
  id: String(doc.id),
  slug: or(doc.slug, fallback.slug),
  title: or(doc.title, fallback.title),
  subtitle: or(doc.subtitle, fallback.subtitle),
  description: or(doc.description, fallback.description),
  highlightText: or(doc.highlightText, fallback.highlightText),
  durationText: or(doc.durationText, fallback.durationText),
  facilities: or(labels(doc.facilities), fallback.facilities),
  suitableFor: or(doc.suitableFor, fallback.suitableFor),
  // Set in the CMS; failing that, read from the text and the category, so
  // every experience carries an element.
  element: isElement(doc.element)
    ? doc.element
    : guessElement(
        [doc.title, doc.subtitle, doc.highlightText, doc.description].filter(Boolean).join(' '),
        (toCategory(doc.category) ?? fallback.category)?.slug,
      ),
  whatToExpect: or(doc.whatToExpect, fallback.whatToExpect),
  category: toCategory(doc.category) ?? fallback.category,
  venues: (doc.venues ?? []).map(toVenue).filter(Boolean) as Venue[],
  facilitators: (doc.facilitators ?? []).map(toFacilitator).filter(Boolean) as Facilitator[],
  heroImage: toImg(doc.heroImage, fallback.heroImage),
  gallery: gallery(doc.gallery, fallback.gallery),
  featured: doc.featured ?? fallback.featured,
  updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
})

const toJourney = (doc: Any, fallback: Journey): Journey => ({
  id: String(doc.id),
  slug: or(doc.slug, fallback.slug),
  title: or(doc.title, fallback.title),
  positioning: or(doc.positioning, fallback.positioning),
  description: or(doc.description, fallback.description),
  summary: or(doc.summary, fallback.summary),
  durationText: or(doc.durationText, fallback.durationText),
  durationShort: str(doc.durationShort) ?? fallback.durationShort,
  facilities: or(labels(doc.facilities), fallback.facilities),
  inclusions: or(labels(doc.inclusions), fallback.inclusions),
  exclusions: or(labels(doc.exclusions), fallback.exclusions),
  suggestedPax: or(doc.suggestedPax, fallback.suggestedPax),
  locationPreference: or(doc.locationPreference, fallback.locationPreference),
  days: Array.isArray(doc.days) && doc.days.length
    ? doc.days.map((d: Any) => ({
        title: d.title ?? '',
        kicker: str(d.kicker),
        highlight: d.highlight === true,
        note: d.note ?? undefined,
        items: (d.items ?? []).map((it: Any) => ({
          time: it.time ?? undefined,
          title: it.title ?? '',
          productSlug: typeof it.product === 'object' ? it.product?.slug : undefined,
          productLine:
            typeof it.product === 'object'
              ? str(it.product?.subtitle) ?? str(it.product?.highlightText)
              : undefined,
          venueName: typeof it.venue === 'object' ? it.venue?.name : undefined,
          facilitatorNames: (it.facilitators ?? [])
            .map((f: Any) => (typeof f === 'object' ? f?.name : null))
            .filter(Boolean),
        })),
      }))
    : fallback.days,
  heroImage: toImg(doc.heroImage, fallback.heroImage),
  gallery: gallery(doc.gallery, fallback.gallery),
  updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
})

/**
 * The catalogue runs to dozens of products, so the limit sits well clear of it
 * — a silently truncated list is worse than a slow one.
 */
/**
 * Drafts are enabled, and the Local API bypasses access control — so the
 * published filter has to be stated here, or an unpublished edit would appear
 * on the live site.
 */
const publishedOnly = { _status: { equals: 'published' } }

const query = {
  depth: 2,
  limit: 500,
  sort: 'order',
  fallbackLocale: 'en' as const,
  where: publishedOnly,
}

export async function getSite(locale: Locale, options: ReadOptions = {}): Promise<SiteContent> {
  const fallback = defaults(locale).site
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const site = (await payload.findGlobal({
      slug: 'site',
      locale,
      depth: 1,
      fallbackLocale: 'en',
      draft: options.draft === true,
    })) as Any
    const nav = {
      products: or(site.navProducts, fallback.nav.products),
      journeys: or(site.navJourneys, fallback.nav.journeys),
      about: or(site.navAbout, fallback.nav.about),
      inquiry: or(site.navInquiry, fallback.nav.inquiry),
      events: or(site.navEvents, fallback.nav.events),
    }
    return {
      nav,
      eventLink: await eventLink(locale, nav.events, site.navEventDirect !== false),
      email: or(site.email, fallback.email),
      phone: or(site.phone, fallback.phone),
      whatsapp: or(site.whatsapp, fallback.whatsapp),
      whatsappLabel: or(site.whatsappLabel, fallback.whatsappLabel),
      address: or(site.address, fallback.address),
      social: or(
        (site.social ?? []).map((s: Any) => ({ label: s.label, href: s.url })),
        fallback.social,
      ),
      footerTagline: or(site.footerTagline, fallback.footerTagline),
      footerLegal: or(site.footerLegal, fallback.footerLegal),
      parentBrand: typeof site.parentBrand === 'string' ? site.parentBrand : fallback.parentBrand,
      responseTime: or(site.responseTime, fallback.responseTime),
    }
  } catch (err) {
    return recover(err, fallback)
  }
}

export async function getHome(locale: Locale, options: ReadOptions = {}): Promise<HomeContent> {
  const fallback = defaults(locale).home
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const home = (await payload.findGlobal({
      slug: 'home',
      locale,
      depth: 2,
      fallbackLocale: 'en',
      draft: options.draft === true,
    })) as Any
    return {
      meta: {
        title: or(home.metaTitle, fallback.meta.title),
        description: or(home.metaDescription, fallback.meta.description),
      },
      hero: {
        eyebrow: or(home.heroEyebrow, fallback.hero.eyebrow),
        headline: or(home.heroHeadline, fallback.hero.headline),
        statement: or(home.heroStatement, fallback.hero.statement),
        ctaLabel: or(home.heroCtaLabel, fallback.hero.ctaLabel),
        image: toImg(home.heroImage, fallback.hero.image),
        darken:
          typeof home.heroDarken === 'number'
            ? Math.min(100, Math.max(0, home.heroDarken)) / 100
            : fallback.hero.darken,
        // An uploaded file first; a URL only when there is no file.
        video:
          home.heroVideoFile && typeof home.heroVideoFile === 'object' && home.heroVideoFile.url
            ? localise(home.heroVideoFile.url)
            : or(home.heroVideo, undefined),
      },
      why: {
        eyebrow: or(home.whyEyebrow, fallback.why.eyebrow),
        headline: or(home.whyHeadline, fallback.why.headline),
        body: or(home.whyBody, fallback.why.body),
        pillars: Array.isArray(home.pillars) && home.pillars.length
          ? home.pillars.map((p: Any, i: number) => ({
              title: or(p.title, fallback.why.pillars[i]?.title ?? ''),
              body: or(p.body, fallback.why.pillars[i]?.body ?? ''),
            }))
          : fallback.why.pillars,
      },
      featured: {
        eyebrow: or(home.featuredEyebrow, fallback.featured.eyebrow),
        headline: or(home.featuredHeadline, fallback.featured.headline),
      },
      event: {
        label: or(home.eventLabel, fallback.event.label),
        ctaLabel: or(home.eventCtaLabel, fallback.event.ctaLabel),
        featuredId: home.featuredEvent
          ? String(typeof home.featuredEvent === 'object' ? home.featuredEvent.id : home.featuredEvent)
          : undefined,
      },
      cta: {
        headline: or(home.ctaHeadline, fallback.cta.headline),
        body: or(home.ctaBody, fallback.cta.body),
        label: or(home.ctaLabel, fallback.cta.label),
        image: toImg(home.ctaImage, fallback.cta.image),
      },
    }
  } catch (err) {
    return recover(err, fallback)
  }
}

export async function getAbout(locale: Locale, options: ReadOptions = {}): Promise<AboutContent> {
  const fallback = defaults(locale).about
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const about = (await payload.findGlobal({
      slug: 'about',
      locale,
      depth: 1,
      fallbackLocale: 'en',
      draft: options.draft === true,
    })) as Any
    return {
      meta: {
        title: or(about.metaTitle, fallback.meta.title),
        description: or(about.metaDescription, fallback.meta.description),
      },
      eyebrow: or(about.eyebrow, fallback.eyebrow),
      headline: or(about.headline, fallback.headline),
      lede: or(about.lede, fallback.lede),
      body: or(
        (about.body ?? []).map((b: Any) => b.text).filter(Boolean),
        fallback.body,
      ),
      image: toImg(about.image, fallback.image),
      statement: or(about.statement, fallback.statement),
      values: or(
        (about.values ?? []).map((v: Any) => ({ title: v.title, caption: v.caption })),
        fallback.values,
      ),
      ctaHeadline: or(about.ctaHeadline, fallback.ctaHeadline),
      ctaLabel: or(about.ctaLabel, fallback.ctaLabel),
    }
  } catch (err) {
    return recover(err, fallback)
  }
}

export async function getCategories(locale: Locale): Promise<ProductCategory[]> {
  const fallback = defaults(locale).categories
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    // Categories carry no drafts, so they have no `_status` — the shared
    // published filter would be rejected as an unknown field, and the catch
    // below would hand back the hardcoded fallback as if nothing were wrong.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { where: _published, ...withoutStatus } = query
    const found = await payload.find({ collection: 'product-categories', locale, ...withoutStatus })
    if (found.docs.length === 0) return fallback
    return found.docs.map((d: Any) => toCategory(d)!).filter(Boolean)
  } catch (err) {
    return recover(err, fallback)
  }
}

export async function getProducts(locale: Locale): Promise<Product[]> {
  const fallback = defaults(locale).products
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const found = await payload.find({ collection: 'products', locale, ...query })
    if (found.docs.length === 0) return fallback
    return found.docs.map((d: Any, i: number) => toProduct(d, fallback[i] ?? fallback[0]))
  } catch (err) {
    return recover(err, fallback)
  }
}

/**
 * Read options for a single document. `draft` is only ever set by the admin's
 * preview route, which has already checked the caller is signed in.
 */
/** `draft: true` reads the latest saved draft; only the admin's preview routes do. */
type ReadOptions = { draft?: boolean }

/** One product, fetched by slug rather than by scanning the catalogue. */
export async function getProduct(
  locale: Locale,
  slug: string,
  { draft = false }: ReadOptions = {},
): Promise<Product | null> {
  const fallbackList = defaults(locale).products
  const fallback = fallbackList.find((p) => p.slug === slug)
  const payload = await getPayloadSafe()

  if (payload) {
    try {
      const found = await payload.find({
        collection: 'products',
        locale,
        depth: 2,
        limit: 1,
        draft,
        fallbackLocale: 'en',
        where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, publishedOnly] },
      })
      const doc = found.docs[0] as Any | undefined
      if (doc) return toProduct(doc, fallback ?? fallbackList[0])
    } catch (err) {
      // Outside production: fall through to the approved default.
      recover(err, null)
    }
  }

  return fallback ?? null
}

export async function getJourneys(locale: Locale): Promise<Journey[]> {
  const fallback = defaults(locale).journeys
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const found = await payload.find({ collection: 'journeys', locale, ...query })
    if (found.docs.length === 0) return fallback
    return found.docs.map((d: Any, i: number) => toJourney(d, fallback[i] ?? fallback[0]))
  } catch (err) {
    return recover(err, fallback)
  }
}

export async function getJourney(
  locale: Locale,
  slug: string,
  { draft = false }: ReadOptions = {},
): Promise<Journey | null> {
  const fallbackList = defaults(locale).journeys
  const fallback = fallbackList.find((j) => j.slug === slug)
  const payload = await getPayloadSafe()

  if (payload) {
    try {
      const found = await payload.find({
        collection: 'journeys',
        locale,
        depth: 2,
        limit: 1,
        draft,
        fallbackLocale: 'en',
        where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, publishedOnly] },
      })
      const doc = found.docs[0] as Any | undefined
      if (doc) return toJourney(doc, fallback ?? fallbackList[0])
    } catch (err) {
      // Outside production: fall through to the approved default.
      recover(err, null)
    }
  }

  return fallback ?? null
}

/** The homepage selection, falling back to products marked featured. */
export async function getFeaturedProducts(locale: Locale): Promise<Product[]> {
  const payload = await getPayloadSafe()
  const all = await getProducts(locale)

  if (payload) {
    try {
      const home = (await payload.findGlobal({ slug: 'home', locale, depth: 0, fallbackLocale: 'en' })) as Any
      const chosen: unknown[] = home.featuredProducts ?? []
      if (chosen.length > 0) {
        const ids = chosen.map((c) => String(typeof c === 'object' ? (c as Any).id : c))
        const picked = ids.map((id) => all.find((p) => p.id === id)).filter(Boolean) as Product[]
        if (picked.length) return picked
      }
    } catch {
      // fall through to the featured flag
    }
  }

  const featured = all.filter((p) => p.featured)
  return featured.length ? featured.slice(0, 3) : all.slice(0, 3)
}

type CatalogueCopy = {
  products: Pick<Dict['products'], 'eyebrow' | 'headline' | 'intro' | 'detailEyebrow'>
  journeys: Pick<Dict['journeys'], 'eyebrow' | 'headline' | 'intro' | 'detailEyebrow'>
}

/**
 * Headings for the product and journey pages. Collections have no document of
 * their own to hold a page heading, so the `catalogue` global is that
 * document; anything left empty there falls back to the approved copy.
 */
export async function getCatalogueCopy(
  locale: Locale,
  options: ReadOptions = {},
): Promise<CatalogueCopy> {
  const d = dict(locale)
  const fallback: CatalogueCopy = {
    products: {
      eyebrow: d.products.eyebrow,
      headline: d.products.headline,
      intro: d.products.intro,
      detailEyebrow: d.products.detailEyebrow,
    },
    journeys: {
      eyebrow: d.journeys.eyebrow,
      headline: d.journeys.headline,
      intro: d.journeys.intro,
      detailEyebrow: d.journeys.detailEyebrow,
    },
  }
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const c = (await payload.findGlobal({
      slug: 'catalogue',
      locale,
      depth: 0,
      fallbackLocale: 'en',
      draft: options.draft === true,
    })) as Any
    return {
      products: {
        eyebrow: or(c.productsEyebrow, fallback.products.eyebrow),
        headline: or(c.productsHeadline, fallback.products.headline),
        intro: or(c.productsIntro, fallback.products.intro),
        detailEyebrow: or(c.productDetailEyebrow, fallback.products.detailEyebrow),
      },
      journeys: {
        eyebrow: or(c.journeysEyebrow, fallback.journeys.eyebrow),
        headline: or(c.journeysHeadline, fallback.journeys.headline),
        intro: or(c.journeysIntro, fallback.journeys.intro),
        detailEyebrow: or(c.journeyDetailEyebrow, fallback.journeys.detailEyebrow),
      },
    }
  } catch (err) {
    return recover(err, fallback)
  }
}

/**
 * The inquiry form as the team has built it in the CMS — which fields, in
 * what order, which are required — with the approved wording underneath
 * anything left blank.
 */
export async function getInquiryCopy(
  locale: Locale,
  options: ReadOptions = {},
): Promise<Dict['inquiry']> {
  const fallback = dict(locale).inquiry
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const copy = (await payload.findGlobal({
      slug: 'inquiry-form',
      locale,
      depth: 0,
      fallbackLocale: 'en',
      // The admin's preview reads the draft; the public page never does.
      draft: options.draft === true,
    })) as Any

    const mapOptions = (list: unknown) =>
      (Array.isArray(list) ? list : [])
        .filter((o: Any) => o?.value && o?.label)
        .map((o: Any) => ({ value: String(o.value), label: String(o.label) }))

    // The form as configured. A built-in row without a label keeps the
    // approved wording; a custom row without a key or label is skipped.
    const fields = (Array.isArray(copy.fields) ? copy.fields : []).flatMap((row: Any): FormField[] => {
      // Switched off in the CMS: kept there, not shown here.
      if (row?.enabled === false) return []
      const kind = String(row?.kind ?? '')

      if (kind === 'custom') {
        if (!row.name || !row.label) return []
        return [
          {
            kind: 'custom',
            name: String(row.name),
            label: String(row.label),
            type: (row.type ?? 'text') as FieldType,
            required: Boolean(row.required),
            width: (row.width ?? 'half') as FormField['width'],
            placeholder: row.placeholder || undefined,
            help: row.help || undefined,
            options: mapOptions(row.options),
          },
        ]
      }

      const common = {
        required: Boolean(row.required),
        width: (row.width ?? 'half') as FormField['width'],
        placeholder: row.placeholder || undefined,
        help: row.help || undefined,
        showWhen: readShowWhen(row.showWhen),
      }

      if (kind === 'pick') {
        if (!isPickSource(row.source)) return []
        const source = row.source
        return [
          {
            ...common,
            kind: 'pick',
            name: fieldName('pick', source),
            label: or(row.label, fallback[source]),
            type: 'select',
            options: [],
            source,
            multiple: row.multiple !== false,
          },
        ]
      }

      if (kind === 'ideas') {
        return [
          {
            ...common,
            kind: 'ideas',
            name: 'ideas',
            label: or(row.label, fallback.ideas),
            type: 'text',
            width: (row.width ?? 'full') as FormField['width'],
            options: [],
          },
        ]
      }

      if (!isTextKind(kind)) return []
      const spec = TEXT_KINDS[kind]
      return [
        {
          ...common,
          kind,
          name: kind,
          label: or(row.label, fallback[kind]),
          // The date field asks for a month unless the team wants the day.
          type: kind === 'date' && row.dateMode === 'date' ? 'date' : spec.type,
          // Email is how the team replies; it stays required whatever the row says.
          required: kind === 'email' ? true : Boolean(row.required),
          width: (row.width ?? spec.width) as FormField['width'],
          // The private/group dropdown carries its own choices; empty keeps
          // the approved three.
          options:
            kind === 'audience'
              ? mapOptions(row.options).length
                ? mapOptions(row.options)
                : fallback.audienceOptions
              : [],
        },
      ]
    })

    return {
      ...fallback,
      // An unanswerable configuration (no email) falls back to the default form.
      fields: fields.some((f) => f.kind === 'email') ? fields : fallback.fields,
      eyebrow: or(copy.eyebrow, fallback.eyebrow),
      headline: or(copy.headline, fallback.headline),
      lede: or(copy.lede, fallback.lede),
      addIdea: or(copy.addCustomLabel, fallback.addIdea),
      requiredNote: or(copy.requiredNote, fallback.requiredNote),
      submit: or(copy.submitLabel, fallback.submit),
      privacyNote: or(copy.privacyNote, fallback.privacyNote),
      doneEyebrow: or(copy.doneEyebrow, fallback.doneEyebrow),
      doneHeading: or(copy.doneHeading, fallback.doneHeading),
      doneBody: or(copy.doneBody, fallback.doneBody),
      doneContact: or(copy.doneContact, fallback.doneContact),
      doneBack: or(copy.doneBack, fallback.doneBack),
    }
  } catch (err) {
    return recover(err, fallback)
  }
}

/* --- Events --------------------------------------------------------------- */

/**
 * Today, as a date in Jakarta (UTC+7): the festival's own clock, whatever
 * the server's. An event stays live through the whole of its last day.
 */
const todayInJakarta = () => new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10)

const toDates = (rows: unknown): EventContent['dates'] =>
  (Array.isArray(rows) ? rows : [])
    .filter((r: Any) => r?.date)
    .map((r: Any) => ({
      label: r.label ?? '',
      date: String(r.date).slice(0, 10),
      time: str(r.time),
      venue: str(r.venue),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

const isLive = (dates: EventContent['dates']) => {
  const last = dates.at(-1)?.date
  return Boolean(last && last >= todayInJakarta())
}

const steps = (rows: unknown) =>
  (Array.isArray(rows) ? rows : [])
    .filter((r: Any) => r?.title)
    .map((r: Any) => ({ title: String(r.title), body: str(r.body) }))

const toEventDay = (d: Any): EventDay => ({
  kicker: str(d.kicker),
  meta: str(d.meta),
  title: d.title ?? '',
  body: str(d.body),
  listLabel: str(d.listLabel),
  listStyle: d.listStyle === 'rows' ? 'rows' : 'thread',
  list: steps(d.list),
  notes: steps(d.notes),
  quoteEyebrow: str(d.quoteEyebrow),
  quote: str(d.quote),
})

/** No approved copy exists for a journey inside an event: blanks stay blank. */
const bareJourney: Journey = {
  id: '',
  slug: '',
  title: '',
  facilities: [],
  inclusions: [],
  exclusions: [],
  days: [],
  heroImage: { alt: '' },
  gallery: [],
}

const noImage: Img = { alt: '' }

const toEvent = (doc: Any): EventContent => {
  const dates = toDates(doc.dates)
  const heroImage = toImg(doc.heroImage, { alt: doc.title ?? '' })
  const journeys = (Array.isArray(doc.journeys) ? doc.journeys : [])
    .filter((j: unknown) => j && typeof j === 'object' && (j as Any)._status !== 'draft')
    .map((j: Any) => toJourney(j, bareJourney))
  const defaultJourney =
    doc.defaultJourney && typeof doc.defaultJourney === 'object' ? str(doc.defaultJourney.slug) : undefined
  const pdf = doc.pdf && typeof doc.pdf === 'object' && doc.pdf.url ? localise(doc.pdf.url) : undefined
  const headline = str(doc.headline) ?? doc.title ?? ''

  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    title: doc.title ?? '',
    eyebrow: str(doc.eyebrow),
    headline,
    statement: str(doc.statement),
    heroImage,
    heroDarken:
      typeof doc.heroDarken === 'number' ? Math.min(100, Math.max(0, doc.heroDarken)) / 100 : 0.35,
    dates,
    live: isLive(dates),
    intro: { label: str(doc.introLabel), headline: str(doc.introHeadline), body: str(doc.introBody) },
    days: {
      label: str(doc.daysLabel),
      headline: str(doc.daysHeadline),
      columns: (Array.isArray(doc.days) ? doc.days : []).filter((d: Any) => d?.title).map(toEventDay),
    },
    place: {
      label: str(doc.placeLabel),
      number: str(doc.placeNumber),
      caption: str(doc.placeCaption),
      headline: str(doc.placeHeadline),
      body: str(doc.placeBody),
      image: toImg(doc.placeImage, noImage),
    },
    journeys: {
      label: str(doc.journeysLabel),
      headline: str(doc.journeysHeadline),
      list: journeys,
      defaultSlug: defaultJourney,
    },
    pdfUrl: pdf,
    closing: {
      eyebrow: str(doc.closingEyebrow),
      headline: str(doc.closingHeadline),
      body: str(doc.closingBody),
      ctaLabel: str(doc.closingCtaLabel),
      downloads: (Array.isArray(doc.downloads) ? doc.downloads : [])
        .filter((d: Any) => d?.label && d?.file && typeof d.file === 'object' && d.file.url)
        .map((d: Any) => ({ label: String(d.label), href: localise(String(d.file.url)) })),
      image: toImg(doc.closingImage, heroImage),
      contactName: str(doc.contactName),
      contactLine: str(doc.contactLine),
      collaborationLine: str(doc.collaborationLine),
    },
    home: {
      headline: str(doc.homeHeadline) ?? headline,
      body: str(doc.homeBody) ?? str(doc.statement),
      image: toImg(doc.homeImage, heroImage),
    },
    navLabel: str(doc.navLabel) ?? doc.title ?? '',
    meta: {
      title: str(doc.metaTitle) ?? `${doc.title ?? ''} · Atibhagya`,
      description: str(doc.metaDescription) ?? str(doc.statement),
    },
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
  }
}

const toEventCard = (event: EventContent): EventCard => ({
  id: event.id,
  slug: event.slug,
  title: event.title,
  eyebrow: event.eyebrow,
  dates: event.dates,
  live: event.live,
  home: event.home,
  navLabel: event.navLabel,
  journeys: event.journeys.list.map((j) => ({
    slug: j.slug,
    title: j.title,
    durationShort: j.durationShort,
    summary: j.summary,
  })),
})

/** The first date of an event, for ordering. */
const startOf = (e: EventContent) => e.dates[0]?.date ?? ''

/**
 * Every published event, upcoming first (soonest at the top), then past
 * ones (most recent at the top). There is no built-in content for events:
 * without a CMS there are none.
 */
export async function getEvents(locale: Locale): Promise<EventContent[]> {
  const payload = await getPayloadSafe()
  if (!payload) return []

  try {
    const found = await payload.find({
      collection: 'events',
      locale,
      depth: 2,
      limit: 100,
      fallbackLocale: 'en',
      where: publishedOnly,
    })
    const events = found.docs.map((d: Any) => toEvent(d))
    const upcoming = events.filter((e) => e.live).sort((a, b) => startOf(a).localeCompare(startOf(b)))
    const past = events.filter((e) => !e.live).sort((a, b) => startOf(b).localeCompare(startOf(a)))
    return [...upcoming, ...past]
  } catch (err) {
    return recover(err, [])
  }
}

export async function getEvent(
  locale: Locale,
  slug: string,
  { draft = false }: ReadOptions = {},
): Promise<EventContent | null> {
  const payload = await getPayloadSafe()
  if (!payload) return null

  try {
    const found = await payload.find({
      collection: 'events',
      locale,
      depth: 2,
      limit: 1,
      draft,
      fallbackLocale: 'en',
      where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, publishedOnly] },
    })
    const doc = found.docs[0] as Any | undefined
    return doc ? toEvent(doc) : null
  } catch (err) {
    return recover(err, null)
  }
}

/**
 * The event the home page features: the one chosen in Home settings if it
 * is still to come, else the nearest one still to come; nothing once every
 * event has passed.
 */
export async function getHomeEvent(locale: Locale, featuredId?: string): Promise<EventCard | null> {
  const events = await getEvents(locale)
  const live = events.filter((e) => e.live)
  const chosen = featuredId ? live.find((e) => e.id === featuredId) : undefined
  const event = chosen ?? live[0]
  return event ? toEventCard(event) : null
}

/**
 * Where the menu's event entry points. A live event, by its own word, while
 * there is one and the team wants it that way; the events page while there
 * are only past events; nothing when there are none at all.
 */
async function eventLink(
  locale: Locale,
  eventsWord: string,
  direct: boolean,
): Promise<EventLink | undefined> {
  const payload = await getPayloadSafe()
  if (!payload) return undefined

  try {
    const found = await payload.find({
      collection: 'events',
      locale,
      depth: 0,
      limit: 100,
      fallbackLocale: 'en',
      where: publishedOnly,
      select: { slug: true, title: true, navLabel: true, dates: true },
    })
    const events = found.docs.map((d: Any) => ({
      slug: String(d.slug ?? ''),
      label: str(d.navLabel) ?? str(d.title) ?? '',
      dates: toDates(d.dates),
    }))
    const live = events
      .filter((e) => isLive(e.dates))
      .sort((a, b) => (a.dates[0]?.date ?? '').localeCompare(b.dates[0]?.date ?? ''))
    if (live[0] && direct) return { label: live[0].label, href: `/events/${live[0].slug}`, live: true }
    if (events.length) return { label: eventsWord, href: '/events', live: live.length > 0 }
    return undefined
  } catch (err) {
    return recover(err, undefined)
  }
}

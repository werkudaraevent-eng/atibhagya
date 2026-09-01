import { getPayloadSafe } from '../payload'
import {
  aboutEn,
  categoriesEn,
  homeEn,
  journeysEn,
  productsEn,
  siteEn,
} from './defaults.en'
import {
  aboutId,
  categoriesId,
  homeId,
  journeysId,
  productsId,
  siteId,
} from './defaults.id'
import { dict } from '../i18n/ui'
import type { CustomQuestion, Dict } from '../i18n/ui'
import type {
  AboutContent,
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

const defaults = (locale: Locale) => ({
  site: locale === 'id' ? siteId : siteEn,
  home: locale === 'id' ? homeId : homeEn,
  about: locale === 'id' ? aboutId : aboutEn,
  categories: locale === 'id' ? categoriesId : categoriesEn,
  products: locale === 'id' ? productsId : productsEn,
  journeys: locale === 'id' ? journeysId : journeysEn,
})

/** Keeps the approved copy when a CMS field has been left empty. */
const or = <T>(value: T | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string' && value.trim() === '') return fallback
  if (Array.isArray(value) && value.length === 0) return fallback
  return value
}

const ownOrigin = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

/**
 * Payload returns absolute URLs because `serverURL` is set for the admin. Left
 * as they are, `next/image` treats our own uploads as a remote host and
 * refuses them unless the deploy domain is listed in `remotePatterns` — so an
 * upload of ours is folded back to a relative path.
 */
const localise = (url: string) =>
  ownOrigin && url.startsWith(ownOrigin) ? url.slice(ownOrigin.length) || '/' : url

const toImg = (media: unknown, fallback: Img): Img => {
  if (!media || typeof media !== 'object') return fallback
  const doc = media as Any
  if (!doc.url) return fallback
  return {
    src: localise(doc.url),
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
      ? { src: f.photo.url, alt: f.photo.alt ?? f.name ?? '' }
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
  whatToExpect: or(doc.whatToExpect, fallback.whatToExpect),
  category: toCategory(doc.category) ?? fallback.category,
  venues: (doc.venues ?? []).map(toVenue).filter(Boolean) as Venue[],
  facilitators: (doc.facilitators ?? []).map(toFacilitator).filter(Boolean) as Facilitator[],
  heroImage: toImg(doc.heroImage, fallback.heroImage),
  gallery: gallery(doc.gallery, fallback.gallery),
  featured: doc.featured ?? fallback.featured,
})

const toJourney = (doc: Any, fallback: Journey): Journey => ({
  id: String(doc.id),
  slug: or(doc.slug, fallback.slug),
  title: or(doc.title, fallback.title),
  positioning: or(doc.positioning, fallback.positioning),
  description: or(doc.description, fallback.description),
  summary: or(doc.summary, fallback.summary),
  durationText: or(doc.durationText, fallback.durationText),
  facilities: or(labels(doc.facilities), fallback.facilities),
  inclusions: or(labels(doc.inclusions), fallback.inclusions),
  exclusions: or(labels(doc.exclusions), fallback.exclusions),
  suggestedPax: or(doc.suggestedPax, fallback.suggestedPax),
  locationPreference: or(doc.locationPreference, fallback.locationPreference),
  days: Array.isArray(doc.days) && doc.days.length
    ? doc.days.map((d: Any) => ({
        title: d.title ?? '',
        note: d.note ?? undefined,
        items: (d.items ?? []).map((it: Any) => ({
          time: it.time ?? undefined,
          title: it.title ?? '',
          productSlug: typeof it.product === 'object' ? it.product?.slug : undefined,
          venueName: typeof it.venue === 'object' ? it.venue?.name : undefined,
          facilitatorNames: (it.facilitators ?? [])
            .map((f: Any) => (typeof f === 'object' ? f?.name : null))
            .filter(Boolean),
        })),
      }))
    : fallback.days,
  heroImage: toImg(doc.heroImage, fallback.heroImage),
  gallery: gallery(doc.gallery, fallback.gallery),
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

export async function getSite(locale: Locale): Promise<SiteContent> {
  const fallback = defaults(locale).site
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const site = (await payload.findGlobal({ slug: 'site', locale, depth: 1, fallbackLocale: 'en' })) as Any
    return {
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
      responseTime: or(site.responseTime, fallback.responseTime),
    }
  } catch {
    return fallback
  }
}

export async function getHome(locale: Locale): Promise<HomeContent> {
  const fallback = defaults(locale).home
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const home = (await payload.findGlobal({ slug: 'home', locale, depth: 2, fallbackLocale: 'en' })) as Any
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
        video: or(home.heroVideo, undefined),
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
      cta: {
        headline: or(home.ctaHeadline, fallback.cta.headline),
        body: or(home.ctaBody, fallback.cta.body),
        label: or(home.ctaLabel, fallback.cta.label),
        image: toImg(home.ctaImage, fallback.cta.image),
      },
    }
  } catch {
    return fallback
  }
}

export async function getAbout(locale: Locale): Promise<AboutContent> {
  const fallback = defaults(locale).about
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const about = (await payload.findGlobal({ slug: 'about', locale, depth: 1, fallbackLocale: 'en' })) as Any
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
  } catch {
    return fallback
  }
}

export async function getCategories(locale: Locale): Promise<ProductCategory[]> {
  const fallback = defaults(locale).categories
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const found = await payload.find({ collection: 'product-categories', locale, ...query })
    if (found.docs.length === 0) return fallback
    return found.docs.map((d: Any) => toCategory(d)!).filter(Boolean)
  } catch {
    return fallback
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
  } catch {
    return fallback
  }
}

/** One product, fetched by slug rather than by scanning the catalogue. */
export async function getProduct(locale: Locale, slug: string): Promise<Product | null> {
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
        fallbackLocale: 'en',
        where: { and: [{ slug: { equals: slug } }, publishedOnly] },
      })
      const doc = found.docs[0] as Any | undefined
      if (doc) return toProduct(doc, fallback ?? fallbackList[0])
    } catch {
      // fall through to the approved default
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
  } catch {
    return fallback
  }
}

export async function getJourney(locale: Locale, slug: string): Promise<Journey | null> {
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
        fallbackLocale: 'en',
        where: { and: [{ slug: { equals: slug } }, publishedOnly] },
      })
      const doc = found.docs[0] as Any | undefined
      if (doc) return toJourney(doc, fallback ?? fallbackList[0])
    } catch {
      // fall through to the approved default
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

/**
 * The inquiry form's wording, with anything the team has written in the CMS
 * laid over the approved copy. Structure stays in code; only words come from
 * the admin.
 */
export async function getInquiryCopy(locale: Locale): Promise<Dict['inquiry']> {
  const fallback = dict(locale).inquiry
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const copy = (await payload.findGlobal({
      slug: 'inquiry-form',
      locale,
      depth: 0,
      fallbackLocale: 'en',
    })) as Any

    const options = Array.isArray(copy.audienceOptions) && copy.audienceOptions.length
      ? copy.audienceOptions
          .filter((o: Any) => o?.value && o?.label)
          .map((o: Any) => ({ value: o.value as string, label: o.label as string }))
      : fallback.audienceOptions

    const questions = (Array.isArray(copy.questions) ? copy.questions : [])
      .filter((q: Any) => q?.name && q?.label)
      .map((q: Any) => ({
        name: String(q.name),
        label: String(q.label),
        type: (q.type ?? 'text') as CustomQuestion['type'],
        required: Boolean(q.required),
        width: (q.width ?? 'full') as CustomQuestion['width'],
        placeholder: q.placeholder || undefined,
        help: q.help || undefined,
        options: (Array.isArray(q.options) ? q.options : [])
          .filter((o: Any) => o?.value && o?.label)
          .map((o: Any) => ({ value: String(o.value), label: String(o.label) })),
      }))

    return {
      ...fallback,
      questions,
      eyebrow: or(copy.eyebrow, fallback.eyebrow),
      headline: or(copy.headline, fallback.headline),
      lede: or(copy.lede, fallback.lede),
      name: or(copy.nameLabel, fallback.name),
      email: or(copy.emailLabel, fallback.email),
      phone: or(copy.phoneLabel, fallback.phone),
      audience: or(copy.audienceLabel, fallback.audience),
      audienceOptions: options.length ? options : fallback.audienceOptions,
      organisation: or(copy.organisationLabel, fallback.organisation),
      pax: or(copy.paxLabel, fallback.pax),
      location: or(copy.locationLabel, fallback.location),
      date: or(copy.dateLabel, fallback.date),
      goal: or(copy.goalLabel, fallback.goal),
      notes: or(copy.notesLabel, fallback.notes),
      interested: or(copy.interestedLabel, fallback.interested),
      interestedHint: or(copy.interestedHint, fallback.interestedHint),
      addCustom: or(copy.addCustomLabel, fallback.addCustom),
      submit: or(copy.submitLabel, fallback.submit),
      doneHeading: or(copy.doneHeading, fallback.doneHeading),
      doneBody: or(copy.doneBody, fallback.doneBody),
      doneContact: or(copy.doneContact, fallback.doneContact),
      doneBack: or(copy.doneBack, fallback.doneBack),
    }
  } catch {
    return fallback
  }
}

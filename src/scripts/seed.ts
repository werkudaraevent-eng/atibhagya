/**
 * Seeds Payload with the approved copy, in both locales.
 *
 * Images are deliberately left empty: the placeholders in `defaults.en.ts` are
 * Creative Commons stand-ins, and the client's own photography goes into the
 * `media` collection instead. Any field left empty here falls back to the
 * default content at render time, so the site looks complete either way.
 *
 *   npm run seed
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'

import {
  aboutEn,
  categoriesEn,
  homeEn,
  journeysEn,
  productsEn,
  siteEn,
  venuesEn,
} from '../lib/content/defaults.en'
import { aboutId, categoriesId, homeId, journeysId, productsId, siteId } from '../lib/content/defaults.id'
import type { AboutContent, HomeContent, Journey, Product, SiteContent } from '../lib/content/types'

type Any = Record<string, any>

/**
 * Payload keys the localized values inside an array to the row's id. Writing a
 * second locale without those ids replaces the rows and drops the first
 * locale's text, so ids from the English pass are carried over — including
 * through nested arrays such as a journey's days and their activities.
 */
function mergeIds<T>(next: T, saved: unknown): T {
  if (Array.isArray(next) && Array.isArray(saved)) {
    return next.map((row, i) => {
      const savedRow = saved[i] as Any | undefined
      if (!savedRow || typeof row !== 'object' || row === null) return row
      return { ...mergeIds(row as Any, savedRow), id: savedRow.id }
    }) as unknown as T
  }

  if (next && typeof next === 'object' && saved && typeof saved === 'object') {
    const out: Any = { ...(next as Any) }
    for (const key of Object.keys(out)) {
      out[key] = mergeIds(out[key], (saved as Any)[key])
    }
    return out as T
  }

  return next
}

const siteData = (site: SiteContent) => ({
  email: site.email,
  phone: site.phone ?? null,
  whatsapp: site.whatsapp,
  whatsappLabel: site.whatsappLabel,
  address: site.address ?? null,
  social: site.social.map((s) => ({ label: s.label, url: s.href })),
  footerTagline: site.footerTagline,
  footerLegal: site.footerLegal,
  responseTime: site.responseTime,
})

const homeData = (home: HomeContent) => ({
  heroEyebrow: home.hero.eyebrow,
  heroHeadline: home.hero.headline,
  heroStatement: home.hero.statement,
  heroCtaLabel: home.hero.ctaLabel,
  whyEyebrow: home.why.eyebrow,
  whyHeadline: home.why.headline,
  whyBody: home.why.body,
  pillars: home.why.pillars.map((p) => ({ title: p.title, body: p.body })),
  featuredEyebrow: home.featured.eyebrow,
  featuredHeadline: home.featured.headline,
  ctaHeadline: home.cta.headline,
  ctaBody: home.cta.body,
  ctaLabel: home.cta.label,
  metaTitle: home.meta.title,
  metaDescription: home.meta.description,
})

const aboutData = (about: AboutContent) => ({
  eyebrow: about.eyebrow,
  headline: about.headline,
  lede: about.lede,
  body: about.body.map((text) => ({ text })),
  statement: about.statement,
  values: about.values.map((v) => ({ title: v.title, caption: v.caption })),
  ctaHeadline: about.ctaHeadline,
  ctaLabel: about.ctaLabel,
  metaTitle: about.meta.title,
  metaDescription: about.meta.description,
})

const productData = (product: Product, categoryId: unknown, venueIds: unknown[]) => ({
  title: product.title,
  subtitle: product.subtitle ?? null,
  description: product.description,
  highlightText: product.highlightText ?? null,
  durationText: product.durationText ?? null,
  facilities: product.facilities.map((label) => ({ label })),
  suitableFor: product.suitableFor,
  whatToExpect: product.whatToExpect ?? null,
  venues: venueIds,
  facilitators: [],
  slug: product.slug,
  featured: product.featured,
  category: categoryId ?? null,
})

const journeyData = (journey: Journey, productIdBySlug: Map<string, unknown>) => ({
  title: journey.title,
  positioning: journey.positioning ?? null,
  description: journey.description ?? null,
  summary: journey.summary ?? null,
  durationText: journey.durationText ?? null,
  facilities: journey.facilities.map((label) => ({ label })),
  inclusions: journey.inclusions.map((label) => ({ label })),
  exclusions: journey.exclusions.map((label) => ({ label })),
  suggestedPax: journey.suggestedPax ?? null,
  locationPreference: journey.locationPreference ?? null,
  days: journey.days.map((day) => ({
    title: day.title,
    note: day.note ?? null,
    items: day.items.map((item) => ({
      time: item.time ?? null,
      title: item.title,
      product: item.productSlug ? (productIdBySlug.get(item.productSlug) ?? null) : null,
      venue: null,
      facilitators: [],
    })),
  })),
  slug: journey.slug,
})

/** Writes English, reads it back, then writes Indonesian onto the same rows. */
async function seedGlobal(
  payload: Payload,
  slug: 'site' | 'home' | 'about',
  en: Any,
  id: Any,
) {
  await payload.updateGlobal({ slug, locale: 'en', data: en as never })
  const saved = (await payload.findGlobal({ slug, locale: 'en' })) as unknown as Any
  await payload.updateGlobal({ slug, locale: 'id', data: mergeIds(id, saved) as never })
  payload.logger.info(`${slug} written (en + id)`)
}

async function seed() {
  const payload = await getPayload({ config: (await import('../payload.config')).default })

  await seedGlobal(payload, 'site', siteData(siteEn), siteData(siteId))
  await seedGlobal(payload, 'home', homeData(homeEn), homeData(homeId))
  await seedGlobal(payload, 'about', aboutData(aboutEn), aboutData(aboutId))

  const categoryIdBySlug = new Map<string, unknown>()
  const existingCategories = await payload.find({ collection: 'product-categories', limit: 1 })
  if (existingCategories.totalDocs === 0) {
    for (const [index, category] of categoriesEn.entries()) {
      const created = await payload.create({
        collection: 'product-categories',
        locale: 'en',
        data: { name: category.name, slug: category.slug, order: index } as never,
      })
      await payload.update({
        collection: 'product-categories',
        id: created.id,
        locale: 'id',
        data: { name: categoriesId[index].name } as never,
      })
      categoryIdBySlug.set(category.slug, created.id)
    }
    payload.logger.info(`Seeded ${categoriesEn.length} product categories`)
  } else {
    const all = await payload.find({ collection: 'product-categories', limit: 100 })
    all.docs.forEach((d: Any) => categoryIdBySlug.set(d.slug, d.id))
  }

  const venueIdByName = new Map<string, unknown>()
  const existingVenues = await payload.find({ collection: 'venues', limit: 1 })
  if (existingVenues.totalDocs === 0) {
    for (const venue of venuesEn) {
      const created = await payload.create({
        collection: 'venues',
        locale: 'en',
        data: { name: venue.name } as never,
      })
      venueIdByName.set(venue.name, created.id)
    }
    payload.logger.info(`Seeded ${venuesEn.length} venues`)
  } else {
    const all = await payload.find({ collection: 'venues', limit: 100 })
    all.docs.forEach((d: Any) => venueIdByName.set(d.name, d.id))
  }

  const productIdBySlug = new Map<string, unknown>()
  const existingProducts = await payload.find({ collection: 'products', limit: 1 })
  if (existingProducts.totalDocs === 0) {
    for (const [index, product] of productsEn.entries()) {
      const venueIds = product.venues
        .map((v) => venueIdByName.get(v.name))
        .filter((v) => v !== undefined)

      const created = await payload.create({
        collection: 'products',
        locale: 'en',
        data: {
          ...productData(product, categoryIdBySlug.get(product.category?.slug ?? ''), venueIds),
          order: index,
        } as never,
      })

      const saved = (await payload.findByID({
        collection: 'products',
        id: created.id,
        locale: 'en',
      })) as unknown as Any

      await payload.update({
        collection: 'products',
        id: created.id,
        locale: 'id',
        data: mergeIds(
          productData(productsId[index], categoryIdBySlug.get(productsId[index].category?.slug ?? ''), venueIds),
          saved,
        ) as never,
      })

      productIdBySlug.set(product.slug, created.id)
    }
    payload.logger.info(`Seeded ${productsEn.length} products`)
  } else {
    const all = await payload.find({ collection: 'products', limit: 100 })
    all.docs.forEach((d: Any) => productIdBySlug.set(d.slug, d.id))
  }

  const existingJourneys = await payload.find({ collection: 'journeys', limit: 1 })
  if (existingJourneys.totalDocs === 0) {
    for (const [index, journey] of journeysEn.entries()) {
      const created = await payload.create({
        collection: 'journeys',
        locale: 'en',
        data: { ...journeyData(journey, productIdBySlug), order: index } as never,
      })

      const saved = (await payload.findByID({
        collection: 'journeys',
        id: created.id,
        locale: 'en',
      })) as unknown as Any

      await payload.update({
        collection: 'journeys',
        id: created.id,
        locale: 'id',
        data: mergeIds(journeyData(journeysId[index], productIdBySlug), saved) as never,
      })
    }
    payload.logger.info(`Seeded ${journeysEn.length} journeys`)
  }

  payload.logger.info('Done. Create your first admin user at /admin.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

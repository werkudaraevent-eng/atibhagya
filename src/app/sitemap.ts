import type { MetadataRoute } from 'next'

import { getEvents, getJourneys, getProducts } from '@/lib/content'
import { locales } from '@/lib/content/types'

/**
 * Every public page in both languages, with each entry pointing at its
 * counterpart in the other — so a search engine files the English and
 * Indonesian pages as one page in two languages rather than as duplicates.
 *
 * `lastModified` is the document's own timestamp. Stamping every entry with
 * "now" on each request told crawlers the whole site changed daily, which
 * they learn to ignore.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://atibhagya.com'
  const prefix = (locale: string) => (locale === 'id' ? '/id' : '')

  const [products, journeys, events] = await Promise.all([
    getProducts('en'),
    getJourneys('en'),
    getEvents('en'),
  ])

  const stamp = (value?: string) => (value ? new Date(value) : undefined)
  const latest = (values: (string | undefined)[]) =>
    values.filter((v): v is string => Boolean(v)).sort().at(-1)

  const pages: { path: string; lastModified?: Date; priority: number }[] = [
    { path: '', lastModified: stamp(latest(products.map((p) => p.updatedAt))), priority: 1 },
    { path: '/product', lastModified: stamp(latest(products.map((p) => p.updatedAt))), priority: 0.8 },
    { path: '/journey', lastModified: stamp(latest(journeys.map((j) => j.updatedAt))), priority: 0.8 },
    { path: '/about', priority: 0.8 },
    { path: '/privacy', priority: 0.3 },
    ...(events.length
      ? [{ path: '/events', lastModified: stamp(latest(events.map((e) => e.updatedAt))), priority: 0.8 }]
      : []),
    ...products.map((p) => ({ path: `/product/${p.slug}`, lastModified: stamp(p.updatedAt), priority: 0.7 })),
    ...journeys.map((j) => ({ path: `/journey/${j.slug}`, lastModified: stamp(j.updatedAt), priority: 0.7 })),
    // A live event outranks a product page; a past one is a record.
    ...events.map((e) => ({
      path: `/events/${e.slug}`,
      lastModified: stamp(e.updatedAt),
      priority: e.live ? 0.9 : 0.5,
    })),
  ]

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${base}${prefix(locale)}${page.path}`,
      ...(page.lastModified ? { lastModified: page.lastModified } : {}),
      changeFrequency: page.path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}${prefix(l)}${page.path}`])),
      },
    })),
  )
}

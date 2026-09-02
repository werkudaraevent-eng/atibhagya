import type { MetadataRoute } from 'next'

import { getJourneys, getProducts } from '@/lib/content'
import { locales } from '@/lib/content/types'

/**
 * Every public page in both languages, with each entry pointing at its
 * counterpart in the other — so a search engine files the English and
 * Indonesian pages as one page in two languages rather than as duplicates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://atibhagya.com'
  const prefix = (locale: string) => (locale === 'id' ? '/id' : '')

  const [products, journeys] = await Promise.all([getProducts('en'), getJourneys('en')])

  const paths = [
    '',
    '/product',
    '/journey',
    '/about',
    ...products.map((p) => `/product/${p.slug}`),
    ...journeys.map((j) => `/journey/${j.slug}`),
  ]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}${prefix(locale)}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : path.includes('/') && path.split('/').length > 2 ? 0.7 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}${prefix(l)}${path}`])),
      },
    })),
  )
}

import { InquiryModal } from '@/components/inquiry/InquiryModal'
import { getCategories, getInquiryCopy, getJourneys, getProducts, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'

export const revalidate = 300

const asArray = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

/**
 * Intercepts /inquiry when the visitor is already on the site, so the form
 * opens over the page that invited them — and the product or journey they came
 * from stays visible behind it.
 */
export default async function InterceptedInquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ product?: string | string[]; journey?: string | string[] }>
}) {
  const { locale: raw } = await params
  const { product, journey } = await searchParams
  const locale = raw as Locale

  const [products, journeys, categories, site, copy] = await Promise.all([
    getProducts(locale),
    getJourneys(locale),
    getCategories(locale),
    getSite(locale),
    getInquiryCopy(locale),
  ])

  return (
    <InquiryModal
      locale={locale}
      dict={{ ...withSite(dict(locale), site), inquiry: copy }}
      site={site}
      choices={{
        products: products.map((p) => ({ slug: p.slug, title: p.title })),
        journeys: journeys.map((j) => ({ slug: j.slug, title: j.title })),
        categories: categories.map((c) => ({ slug: c.slug, title: c.name })),
      }}
      initialProducts={asArray(product)}
      initialJourneys={asArray(journey)}
      homeHref={locale === 'id' ? '/id' : '/'}
    />
  )
}

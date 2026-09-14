import { notFound } from 'next/navigation'

import { Motion } from '@/components/Motion'
import { ProductDetail, productStages } from '@/components/products/ProductDetail'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageMarks } from '@/components/site/PageMarks'
import { getCatalogueCopy, getProduct, getProducts, getSite } from '@/lib/content'
import { toCard, type Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
import { isStaffRequest } from '@/lib/preview'

/**
 * The admin's live-preview target for a product.
 *
 * The public page reads published content only, so an unpublished change —
 * a new photograph, a reworded line — was invisible in the preview panel
 * until it went live, which defeated the point of previewing. This route
 * reads the draft instead. It renders on every request, never caches, and
 * refuses anyone without an admin session.
 */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale: raw, slug } = await params
  const locale = raw as Locale

  const [product, site, all, copy] = await Promise.all([
    getProduct(locale, slug, { draft: true }),
    getSite(locale),
    getProducts(locale),
    getCatalogueCopy(locale),
  ])
  const t = withSite(dict(locale), site)
  if (!product) notFound()

  const others = all.filter((p) => p.slug !== product.slug)
  const sameCategory = others.filter((p) => p.category?.slug === product.category?.slug)
  const related = [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))]
    .slice(0, 5)
    .map(toCard)

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />
      <PageMarks stages={productStages(t, related.length > 0)} label={t.yourPath} />
      <main id="main">
        <ProductDetail
          product={product}
          locale={locale}
          dict={{ ...t, products: { ...t.products, detailEyebrow: copy.products.detailEyebrow } }}
          related={related}
        />
      </main>
      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

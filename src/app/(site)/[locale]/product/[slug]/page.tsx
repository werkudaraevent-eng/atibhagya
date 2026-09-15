import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Motion } from '@/components/Motion'
import { ProductDetail, productStages } from '@/components/products/ProductDetail'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageMarks } from '@/components/site/PageMarks'
import { getCatalogueCopy, getProduct, getProducts, getSite } from '@/lib/content'
import { locales, toCard, type Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'

export const revalidate = 300

export async function generateStaticParams() {
  const products = await getProducts('en')
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProduct(locale as Locale, slug)
  if (!product) return {}

  const path = `/product/${product.slug}`
  return {
    title: `${product.title} · Atibhagya`,
    description: product.description,
    alternates: {
      canonical: locale === 'id' ? `/id${path}` : path,
      languages: { en: path, id: `/id${path}` },
    },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.heroImage.src ? [product.heroImage.src] : [],
      type: 'article',
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale

  const [product, site, all, copy] = await Promise.all([
    getProduct(locale, slug),
    getSite(locale),
    getProducts(locale),
    getCatalogueCopy(locale),
  ])
  const t = withSite(dict(locale), site)
  if (!product) notFound()

  // Same category first; if that is thin, fill from the rest of the catalogue.
  const others = all.filter((p) => p.slug !== product.slug)
  const sameCategory = others.filter((p) => p.category?.slug === product.category?.slug)
  const related = [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))]
    .slice(0, 5)
    .map(toCard)

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />
      {/* Outside <main>: its entrance transform would pin these overlays. */}
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

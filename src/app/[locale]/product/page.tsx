import type { Metadata } from 'next'

import { Motion } from '@/components/Motion'
import { CatalogueIndex } from '@/components/products/CatalogueIndex'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getCategories, getProducts, getSite } from '@/lib/content'
import { toCard, type Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = dict(locale as Locale)

  return {
    title: `${t.nav.products} · Atibhagya`,
    description: t.products.intro,
    alternates: {
      canonical: locale === 'id' ? '/id/product' : '/product',
      languages: { en: '/product', id: '/id/product' },
    },
  }
}

export default async function ProductListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = raw as Locale
  const t = dict(locale)

  const [products, categories, site] = await Promise.all([
    getProducts(locale),
    getCategories(locale),
    getSite(locale),
  ])

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      <CatalogueIndex />

      <main>
        <header className={page.pageHead}>
          <div className={page.container}>
            <div className={page.eyebrow}>{t.products.eyebrow}</div>
            <h1 className={page.headline} data-headline>
              <Lines text={t.products.headline} />
            </h1>
            <p className={page.lede}>{t.products.intro}</p>
          </div>
        </header>

        <section className={page.section} style={{ paddingTop: 0 }}>
          <div className={page.container}>
            <ProductBrowser
              products={products.map(toCard)}
              categories={categories}
              locale={locale}
              dict={t}
            />
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

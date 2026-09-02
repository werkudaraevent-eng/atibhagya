import { Motion } from '@/components/Motion'
import { CatalogueIndex } from '@/components/products/CatalogueIndex'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getCatalogueCopy, getCategories, getProducts, getSite } from '@/lib/content'
import { toCard, type Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'

type Props = {
  locale: Locale
  /** Read the page headings as they are being edited rather than as published. */
  draft?: boolean
}

/**
 * The product listing in full. Shared by the public route and the admin's
 * draft preview of the catalogue headings.
 */
export async function ProductListScreen({ locale, draft = false }: Props) {
  const t = dict(locale)

  const [products, categories, site, copy] = await Promise.all([
    getProducts(locale),
    getCategories(locale),
    getSite(locale, { draft }),
    getCatalogueCopy(locale, { draft }),
  ])

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      <CatalogueIndex />

      <main>
        <header className={page.pageHead}>
          <div className={page.container}>
            <div className={page.eyebrow}>{copy.products.eyebrow}</div>
            <h1 className={page.headline} data-headline>
              <Lines text={copy.products.headline} />
            </h1>
            <p className={page.lede}>{copy.products.intro}</p>
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

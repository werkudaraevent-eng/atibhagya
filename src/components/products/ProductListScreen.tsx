import { Motion } from '@/components/Motion'
import { ProductBrowser } from '@/components/products/ProductBrowser'
import { Footer } from '@/components/site/Footer'
import { PageMarks } from '@/components/site/PageMarks'
import { Divider } from '@/components/site/Ornament'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getCatalogueCopy, getCategories, getProducts, getSite } from '@/lib/content'
import { toCard, type Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
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

  const [products, categories, site, copy] = await Promise.all([
    getProducts(locale),
    getCategories(locale),
    getSite(locale, { draft }),
    getCatalogueCopy(locale, { draft }),
  ])
  const t = withSite(dict(locale), site)

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      <PageMarks
        stages={[
          { id: 'top', label: copy.products.eyebrow },
          { id: 'catalogue', label: t.nav.products },
          { id: 'foot', label: t.footer.enquiries },
        ]}
        label={t.yourPath}
      />

      <main id="main">
        <header id="top" className={page.pageHead} data-stage={copy.products.eyebrow}>
          <div className={`${page.container} ${page.headerCenter}`}>
            <div className={page.eyebrow}>{copy.products.eyebrow}</div>
            <h1 className={page.headlineCenter} data-headline>
              <Lines text={copy.products.headline} />
            </h1>
            <p className={page.lede}>{copy.products.intro}</p>
            <Divider mark="wave" />
          </div>
        </header>

        <section id="catalogue" className={page.section} style={{ paddingTop: 0 }} data-stage={t.nav.products}>
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

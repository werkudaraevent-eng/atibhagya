import { Motion } from '@/components/Motion'
import { ClosingCta } from '@/components/home/ClosingCta'
import { Hero } from '@/components/home/Hero'
import { Why } from '@/components/home/Why'
import { ProductGrid } from '@/components/products/ProductCard'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getFeaturedProducts, getHome, getSite } from '@/lib/content'
import { toCard, type Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'

type Props = {
  locale: Locale
  /** Read the page as it is being edited rather than as published. */
  draft?: boolean
}

/**
 * The home page in full. Shared by the public route and the admin's draft
 * preview, which differ only in what they read.
 */
export async function HomeScreen({ locale, draft = false }: Props) {
  const t = dict(locale)
  const prefix = locale === 'id' ? '/id' : ''

  const [home, site, featured] = await Promise.all([
    getHome(locale, { draft }),
    getSite(locale),
    getFeaturedProducts(locale),
  ])

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />

      <main>
        <Hero hero={home.hero} ctaHref={`${prefix}/product`} />
        <Why why={home.why} />

        <section className={`${page.section} ${page.sectionAlt}`}>
          <div className={page.container}>
            <div className={page.eyebrow} data-fade>
              {home.featured.eyebrow}
            </div>
            <h2 className={page.headline} data-headline style={{ marginBottom: 'clamp(40px, 6vh, 72px)' }}>
              <Lines text={home.featured.headline} />
            </h2>
            <ProductGrid products={featured.map(toCard)} locale={locale} />
          </div>
        </section>

        <ClosingCta cta={home.cta} href={`${prefix}/inquiry`} />
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

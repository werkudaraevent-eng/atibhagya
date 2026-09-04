import { Motion } from '@/components/Motion'
import { ClosingCta } from '@/components/home/ClosingCta'
import { Hero } from '@/components/home/Hero'
import { Why } from '@/components/home/Why'
import { ProductGrid } from '@/components/products/ProductCard'
import { Footer } from '@/components/site/Footer'
import { SectionMark } from '@/components/site/Ornament'
import { Nav } from '@/components/site/Nav'
import { PageMarks } from '@/components/site/PageMarks'
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
    getSite(locale, { draft }),
    getFeaturedProducts(locale),
  ])

  // The stops on the path indicator, in the words the sections already use.
  const stages = [
    { id: 'top', label: 'Atibhagya' },
    { id: 'why', label: home.why.eyebrow },
    { id: 'featured', label: home.featured.eyebrow },
    { id: 'inquiry', label: t.nav.inquiry },
    { id: 'foot', label: t.footer.enquiries },
  ]

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />
      <PageMarks stages={stages} label={t.yourPath} />

      <main id="main">
        <Hero hero={home.hero} ctaHref={`${prefix}/product`} />
        <Why why={home.why} />

        <section
          id="featured"
          className={`${page.section} ${page.sectionAlt}`}
          data-stage={home.featured.eyebrow}
          data-chapter="02"
        >
          <div className={page.container}>
            <SectionMark number="02" mark="wave" label={home.featured.eyebrow} align="start" />
            <h2 className={page.headline} data-words style={{ marginBottom: 'clamp(40px, 6vh, 72px)' }}>
              <Lines text={home.featured.headline} />
            </h2>
            <ProductGrid products={featured.map(toCard)} locale={locale} />
          </div>
        </section>

        <ClosingCta cta={home.cta} href={`${prefix}/inquiry`} stage={t.nav.inquiry} />
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

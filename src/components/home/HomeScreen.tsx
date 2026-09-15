import { Motion } from '@/components/Motion'
import { ClosingCta } from '@/components/home/ClosingCta'
import { Hero } from '@/components/home/Hero'
import { HomeEvent } from '@/components/home/HomeEvent'
import { Why } from '@/components/home/Why'
import { ProductGrid } from '@/components/products/ProductCard'
import { Footer } from '@/components/site/Footer'
import { SectionMark } from '@/components/site/Ornament'
import { Nav } from '@/components/site/Nav'
import { PageMarks } from '@/components/site/PageMarks'
import page from '@/components/site/Page.module.css'
import { getFeaturedProducts, getHome, getHomeEvent, getSite } from '@/lib/content'
import { toCard, type Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
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
  const prefix = locale === 'id' ? '/id' : ''

  const [home, site, featured] = await Promise.all([
    getHome(locale, { draft }),
    getSite(locale, { draft }),
    getFeaturedProducts(locale),
  ])
  const t = withSite(dict(locale), site)
  // The season's chapter, while there is one still to come.
  const event = await getHomeEvent(locale, home.event.featuredId)

  // The stops on the path indicator, in the words the sections already use.
  const stages = [
    { id: 'top', label: 'Atibhagya' },
    { id: 'why', label: home.why.eyebrow },
    { id: 'featured', label: home.featured.eyebrow },
    ...(event ? [{ id: 'event', label: home.event.label }] : []),
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
          <div className={page.wideContainer}>
            <div className={page.headerCenter}>
              <SectionMark label={home.featured.eyebrow} align="center" />
              <h2 className={page.headlineCenter} data-words>
                <Lines text={home.featured.headline} />
              </h2>
            </div>
            <ProductGrid products={featured.map(toCard)} locale={locale} />
          </div>
        </section>

        {event ? <HomeEvent event={event} copy={home.event} locale={locale} number="03" /> : null}

        <ClosingCta cta={home.cta} href={`${prefix}/inquiry`} stage={t.nav.inquiry} />
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

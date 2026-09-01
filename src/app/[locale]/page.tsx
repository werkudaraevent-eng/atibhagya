import type { Metadata } from 'next'

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

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const home = await getHome(locale as Locale)

  return {
    title: home.meta.title,
    description: home.meta.description,
    alternates: {
      canonical: locale === 'id' ? '/id' : '/',
      languages: { en: '/', id: '/id' },
    },
    openGraph: {
      title: home.meta.title,
      description: home.meta.description,
      images: home.hero.image.src ? [home.hero.image.src] : [],
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = raw as Locale
  const t = dict(locale)
  const prefix = locale === 'id' ? '/id' : ''

  const [home, site, featured] = await Promise.all([
    getHome(locale),
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

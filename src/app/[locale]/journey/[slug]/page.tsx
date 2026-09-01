import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CreditImage } from '@/components/CreditImage'
import { Motion } from '@/components/Motion'
import { Itinerary } from '@/components/journeys/Itinerary'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getJourney, getJourneys, getSite } from '@/lib/content'
import { locales, type Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'
import styles from './journey-detail.module.css'

export const revalidate = 300

export async function generateStaticParams() {
  const journeys = await getJourneys('en')
  return locales.flatMap((locale) => journeys.map((j) => ({ locale, slug: j.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const journey = await getJourney(locale as Locale, slug)
  if (!journey) return {}

  const path = `/journey/${journey.slug}`
  return {
    title: `${journey.title} · Atibhagya`,
    description: journey.positioning ?? journey.description,
    alternates: {
      canonical: locale === 'id' ? `/id${path}` : path,
      languages: { en: path, id: `/id${path}` },
    },
    openGraph: {
      title: journey.title,
      description: journey.positioning ?? journey.description,
      images: journey.heroImage.src ? [journey.heroImage.src] : [],
      type: 'article',
    },
  }
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = raw as Locale
  const t = dict(locale)
  const prefix = locale === 'id' ? '/id' : ''

  const [journey, site] = await Promise.all([getJourney(locale, slug), getSite(locale)])
  if (!journey) notFound()

  const inquiryHref = `${prefix}/inquiry?journey=${encodeURIComponent(journey.slug)}`

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      <main>
        <header className={styles.head}>
          <div className={page.container}>
            <div className={page.eyebrow}>{t.journeys.detailEyebrow}</div>
            <h1 className={styles.title} data-headline>{journey.title}</h1>
            {journey.positioning ? <p className={styles.positioning}>{journey.positioning}</p> : null}
            <div className={styles.actions}>
              <Link href={inquiryHref} className={page.buttonPrimary}>
                {t.journeys.inquire}
              </Link>
            </div>
          </div>
        </header>

        <div className={styles.hero} data-clip>
          <div className={styles.para} data-para>
            <CreditImage image={journey.heroImage} sizes="100vw" priority />
          </div>
        </div>

        <section className={page.section}>
          <div className={page.container}>
            {journey.description ? (
              <p className={styles.description} data-fade>
                {journey.description}
              </p>
            ) : null}

            <Itinerary journey={journey} locale={locale} dict={t} />
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

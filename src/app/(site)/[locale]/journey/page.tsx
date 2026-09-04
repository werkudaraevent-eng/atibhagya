import type { Metadata } from 'next'

import { CreditImage } from '@/components/CreditImage'
import { Motion } from '@/components/Motion'
import { JourneyCards } from '@/components/journeys/JourneyCards'
import { Footer } from '@/components/site/Footer'
import { PageMarks } from '@/components/site/PageMarks'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getCatalogueCopy, getJourneys, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './journey-list.module.css'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = dict(locale as Locale)

  return {
    title: `${t.nav.journeys} · Atibhagya`,
    description: t.journeys.intro,
    alternates: {
      canonical: locale === 'id' ? '/id/journey' : '/journey',
      languages: { en: '/journey', id: '/id/journey' },
    },
  }
}

export default async function JourneyListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = raw as Locale

  const [journeys, site, copy] = await Promise.all([
    getJourneys(locale),
    getSite(locale),
    getCatalogueCopy(locale),
  ])
  const t = withSite(dict(locale), site)
  const opening = journeys[0]?.heroImage

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />
      <PageMarks
        stages={[
          { id: 'top', label: copy.journeys.eyebrow },
          { id: 'journeys', label: t.nav.journeys },
          { id: 'foot', label: t.footer.enquiries },
        ]}
        label={t.yourPath}
      />

      <main id="main">
        {/* Journey is the most experiential content type, so it opens full width. */}
        <div id="top" className={styles.opening} data-stage={copy.journeys.eyebrow}>
          {opening ? (
            <div className={styles.openingImage} data-zoom>
              <CreditImage image={opening} sizes="100vw" priority />
            </div>
          ) : null}
          <div className={styles.openingScrim} />
          <div className={styles.openingContent} data-heroword>
            <div className={styles.openingEyebrow}>{copy.journeys.eyebrow}</div>
            <h1 className={styles.openingHeadline} data-headline>
              <Lines text={copy.journeys.headline} />
            </h1>
            <p className={styles.openingLede}>{copy.journeys.intro}</p>
          </div>
        </div>

        <section id="journeys" className={page.section} data-stage={t.nav.journeys} data-chapter="01">
          <div className={page.container}>
            {journeys.length === 0 ? (
              <p className={page.lede}>{t.journeys.empty}</p>
            ) : (
              <JourneyCards journeys={journeys} locale={locale} dict={t} />
            )}
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

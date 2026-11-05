import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CreditImage } from '@/components/CreditImage'
import { Motion } from '@/components/Motion'
import { Itinerary } from '@/components/journeys/Itinerary'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { Footer } from '@/components/site/Footer'
import { PageMarks } from '@/components/site/PageMarks'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getCatalogueCopy, getJourney, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
import { isStaffRequest } from '@/lib/preview'
import styles from '../../../journey/[slug]/journey-detail.module.css'

/** The admin's live-preview target for a journey. See the product preview. */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function JourneyPreviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale: raw, slug } = await params
  const locale = raw as Locale
  const prefix = locale === 'id' ? '/id' : ''

  const [journey, site, copy] = await Promise.all([
    getJourney(locale, slug, { draft: true }),
    getSite(locale),
    getCatalogueCopy(locale),
  ])
  const t = withSite(dict(locale), site)
  if (!journey) notFound()

  const inquiryHref = `${prefix}/inquiry?journey=${encodeURIComponent(journey.slug)}`

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />
      <PageMarks
        stages={[
          { id: 'top', label: copy.journeys.detailEyebrow },
          { id: 'itinerary', label: t.journeys.itinerary },
          { id: 'foot', label: t.footer.enquiries },
        ]}
        label={t.yourPath}
      />

      <main id="main">
        <header id="top" className={styles.heroHeader} data-stage={copy.journeys.detailEyebrow} data-chapter="01">
          <div className={styles.heroMedia} data-open>
            <div className={styles.para} data-para>
              <CreditImage
                image={journey.heroImage}
                sizes="100vw"
                priority
              />
            </div>
            <div className={styles.heroOverlay} />

            <div className={styles.heroContent} data-heroword>
              <Breadcrumb
                label={t.youAreHere}
                trail={[
                  { label: copy.journeys.detailEyebrow, href: `${prefix}/journey` },
                  { label: journey.title },
                ]}
                className={styles.heroBreadcrumb}
              />
              <h1 className={styles.title} data-headline>{journey.title}</h1>
              {journey.positioning ? <p className={styles.positioning}>{journey.positioning}</p> : null}
              <div className={styles.actions} data-fade>
                <Link href={inquiryHref} className={styles.inquireBtn}>
                  {t.journeys.inquire}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section id="itinerary" className={page.section} data-stage={t.journeys.itinerary} data-chapter="02">
          <div className={page.wideContainer}>
            {journey.description ? (
              <p className={styles.description} data-fade>
                {journey.description}
              </p>
            ) : null}
            {/* The days are h3s; this keeps the outline from jumping h1 → h3. */}
            <h2 className="visuallyHidden">{t.journeys.itinerary}</h2>
            <Itinerary journey={journey} locale={locale} dict={t} />
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

import type { Metadata } from 'next'

import { Motion } from '@/components/Motion'
import { EventList } from '@/components/events/EventList'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { Divider, SectionMark } from '@/components/site/Ornament'
import { PageMarks } from '@/components/site/PageMarks'
import page from '@/components/site/Page.module.css'
import { getEvents, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './events-list.module.css'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = dict(locale as Locale)

  return {
    title: `${t.nav.events} · Atibhagya`,
    description: t.events.intro,
    alternates: {
      canonical: locale === 'id' ? '/id/events' : '/events',
      languages: { en: '/events', id: '/id/events' },
    },
  }
}

/**
 * Every event, the ones still to come first. Opens on the page colour, like
 * the catalogue: the events themselves carry the photographs.
 */
export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = raw as Locale

  const [events, site] = await Promise.all([getEvents(locale), getSite(locale)])
  const t = withSite(dict(locale), site)
  const upcoming = events.filter((e) => e.live)
  const past = events.filter((e) => !e.live)

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />
      <PageMarks
        stages={[
          { id: 'top', label: t.events.eyebrow },
          ...(upcoming.length ? [{ id: 'upcoming', label: t.events.upcoming }] : []),
          ...(past.length ? [{ id: 'past', label: t.events.past }] : []),
          { id: 'foot', label: t.footer.enquiries },
        ]}
        label={t.yourPath}
      />

      <main id="main">
        <header id="top" className={page.pageHead} data-stage={t.events.eyebrow}>
          <div className={`${page.container} ${page.headerCenter}`}>
            <div className={page.eyebrow} data-fade>
              {t.events.eyebrow}
            </div>
            <h1 className={page.headlineCenter} data-headline>
              <Lines text={t.events.headline} />
            </h1>
            <p className={page.lede} data-fade>
              {t.events.intro}
            </p>
            <Divider mark="wave" />
          </div>
        </header>

        {events.length === 0 ? (
          <section className={page.section}>
            <div className={`${page.container} ${page.headerCenter}`}>
              <p className={page.lede}>{t.events.empty}</p>
            </div>
          </section>
        ) : null}

        {upcoming.length ? (
          <section
            id="upcoming"
            className={`${page.section} ${styles.first}`}
            data-stage={t.events.upcoming}
            data-chapter="01"
          >
            <div className={page.container}>
              <SectionMark number="01" mark="wave" label={t.events.upcoming} align="center" />
              <EventList events={upcoming} locale={locale} dict={t} lead />
            </div>
          </section>
        ) : null}

        {past.length ? (
          <section
            id="past"
            className={
              upcoming.length ? `${page.section} ${page.sectionAlt}` : `${page.section} ${page.sectionAlt} ${styles.first}`
            }
            data-stage={t.events.past}
            data-chapter={upcoming.length ? '02' : '01'}
          >
            <div className={page.container}>
              <SectionMark
                number={upcoming.length ? '02' : '01'}
                mark="macron"
                label={t.events.past}
                align="center"
              />
              <EventList events={past} locale={locale} dict={t} />
            </div>
          </section>
        ) : null}
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

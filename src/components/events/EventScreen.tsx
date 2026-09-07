import { notFound } from 'next/navigation'

import { Motion } from '@/components/Motion'
import { EventClosing } from '@/components/events/EventClosing'
import { EventDays } from '@/components/events/EventDays'
import { EventHero } from '@/components/events/EventHero'
import { EventIntro } from '@/components/events/EventIntro'
import { EventPlace } from '@/components/events/EventPlace'
import { JourneyStage } from '@/components/events/JourneyStage'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { PageMarks } from '@/components/site/PageMarks'
import type { Stage } from '@/components/site/PathIndicator'
import { getEvent, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
import styles from './EventScreen.module.css'

type Props = {
  locale: Locale
  slug: string
  /** Read the event as it is being edited rather than as published. */
  draft?: boolean
}

/**
 * An event page in full: the opening, then only the chapters the team has
 * filled, numbered in the order they appear. Shared by the public route
 * and the admin's draft preview.
 */
export async function EventScreen({ locale, slug, draft = false }: Props) {
  const prefix = locale === 'id' ? '/id' : ''
  const [event, site] = await Promise.all([getEvent(locale, slug, { draft }), getSite(locale, { draft })])
  if (!event) notFound()
  const t = withSite(dict(locale), site)

  // Chapters exist only when there is something in them.
  const hasIntro = Boolean(event.intro.headline || event.intro.body)
  const hasDays = event.days.columns.length > 0
  const hasPlace = Boolean(event.place.headline || event.place.body || event.place.image.src)
  const hasJourneys = event.journeys.list.length > 0
  const hasClosing = Boolean(event.closing.headline || event.closing.body)

  let n = 0
  const next = () => String(++n).padStart(2, '0')
  const chapters = {
    intro: hasIntro ? next() : '',
    days: hasDays ? next() : '',
    place: hasPlace ? next() : '',
    journeys: hasJourneys ? next() : '',
  }

  const labels = {
    intro: event.intro.label ?? t.events.detailEyebrow,
    days: event.days.label ?? t.events.toDays,
    place: event.place.label ?? event.title,
    journeys: event.journeys.label ?? t.nav.journeys,
    closing: event.closing.eyebrow ?? t.nav.inquiry,
  }

  const stages: Stage[] = [
    { id: 'top', label: event.eyebrow ?? t.events.detailEyebrow },
    ...(hasIntro ? [{ id: 'intro', label: labels.intro }] : []),
    ...(hasDays ? [{ id: 'days', label: labels.days }] : []),
    ...(hasPlace ? [{ id: 'place', label: labels.place }] : []),
    ...(hasJourneys ? [{ id: 'journeys', label: labels.journeys }] : []),
    ...(hasClosing ? [{ id: 'enquire', label: labels.closing }] : []),
    { id: 'foot', label: t.footer.enquiries },
  ]

  const inquiryHref = `${prefix}/inquiry`

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} />
      <PageMarks stages={stages} label={t.yourPath} />

      <main id="main">
        <EventHero
          event={event}
          locale={locale}
          dict={t}
          journeysId={hasJourneys ? 'journeys' : undefined}
          daysId={hasDays ? 'days' : undefined}
        />

        {!event.live ? <p className={styles.ended}>{t.events.ended}</p> : null}

        {hasIntro ? (
          <EventIntro intro={event.intro} id="intro" number={chapters.intro} stage={labels.intro} />
        ) : null}

        {hasDays ? <EventDays days={event.days} id="days" number={chapters.days} stage={labels.days} /> : null}

        {hasPlace ? (
          <EventPlace place={event.place} id="place" number={chapters.place} stage={labels.place} />
        ) : null}

        {hasJourneys ? (
          <JourneyStage
            journeys={event.journeys.list}
            defaultSlug={event.journeys.defaultSlug}
            locale={locale}
            dict={t}
            pdfUrl={event.pdfUrl}
            id="journeys"
            number={chapters.journeys}
            stage={labels.journeys}
            headline={event.journeys.headline}
          />
        ) : null}

        {hasClosing ? (
          <EventClosing
            closing={event.closing}
            id="enquire"
            stage={labels.closing}
            inquiryHref={inquiryHref}
            dict={t}
          />
        ) : null}
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

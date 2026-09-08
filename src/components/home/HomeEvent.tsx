import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import { shortDate } from '@/components/events/dates'
import { SectionMark } from '@/components/site/Ornament'
import page from '@/components/site/Page.module.css'
import type { EventCard, HomeContent, Locale } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './HomeEvent.module.css'

type Props = {
  event: EventCard
  copy: HomeContent['event']
  locale: Locale
  number: string
}

/**
 * The season's chapter on the home page: a photograph with its dates, the
 * event's own sentence, the journeys that lead there, one invitation.
 * Rendered only while an event is published and still to come.
 */
export function HomeEvent({ event, copy, locale, number }: Props) {
  const prefix = locale === 'id' ? '/id' : ''
  const href = `${prefix}/events/${event.slug}`

  return (
    <section id="event" className={page.section} data-stage={copy.label} data-chapter={number}>
      <div className={page.container}>
        <SectionMark number={number} mark="macron" label={copy.label} align="start" />

        <div className={styles.grid}>
          <Link href={href} className={styles.frame} data-open>
            <div className={styles.para} data-para>
              <CreditImage image={event.home.image} sizes="(max-width: 860px) 100vw, 50vw" insideLink />
            </div>
            <div className={styles.frameScrim} aria-hidden="true" />
            {event.dates.length ? (
              <div className={styles.dates}>
                {event.dates.slice(0, 2).map((d) => (
                  <div key={`${d.date}-${d.label}`} className={styles.date}>
                    <span className={styles.dateLabel}>{d.label}</span>
                    <span className={styles.dateValue}>{shortDate(d.date, locale)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </Link>

          <div>
            {event.eyebrow ? (
              <div className={page.eyebrow} data-fade>
                {event.eyebrow}
              </div>
            ) : null}
            <h2 className={styles.headline} data-words>
              <Lines text={event.home.headline} />
            </h2>
            {event.home.body ? (
              <p className={styles.body} data-fade>
                <Lines text={event.home.body} />
              </p>
            ) : null}

            {event.journeys.length ? (
              <ul className={styles.journeys} data-fade>
                {event.journeys.map((j) => (
                  <li key={j.slug}>
                    <Link href={`${prefix}/journey/${j.slug}`} className={styles.journey}>
                      <span className={styles.journeyLen}>{j.durationShort ?? ''}</span>
                      <span className={styles.journeyName}>{j.title}</span>
                      {j.summary ? <span className={styles.journeyKicker}>{j.summary}</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className={styles.actions} data-fade>
              <Link href={href} className={styles.button}>
                {copy.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

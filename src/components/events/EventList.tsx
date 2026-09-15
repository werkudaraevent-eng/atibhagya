import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import type { EventContent, Locale } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import { dateRange } from './dates'
import styles from './EventList.module.css'

type Props = {
  events: EventContent[]
  locale: Locale
  dict: Dict
  /** Upcoming events are set larger: photograph beside the words. */
  lead?: boolean
}

/**
 * Events as rows, in the journey list's voice: a running number, a
 * photograph, the words. Upcoming ones lead with their dates and journeys;
 * past ones keep to a line, the way a programme's back page lists seasons.
 */
export function EventList({ events, locale, dict, lead = false }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  return (
    <div className={lead ? `${styles.list} ${styles.listLead}` : styles.list}>
      {events.map((event, index) => (
        <Link
          key={event.id}
          href={`${prefix}/events/${event.slug}`}
          className={lead ? `${styles.row} ${styles.rowLead}` : styles.row}
          data-fade
        >
          <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
          {lead ? (
            <div className={styles.image}>
              <CreditImage
                image={event.home.image}
                sizes="(max-width: 780px) 100vw, 45vw"
                insideLink
              />
            </div>
          ) : null}
          <div className={styles.caption}>
            <div className={styles.when}>{dateRange(event.dates, locale)}</div>
            <h3 className={styles.title}>{event.title}</h3>
            {lead ? (
              <>
                <p className={styles.line}>
                  <Lines text={event.home.headline} />
                </p>
                {event.journeys.list.length ? (
                  <ul className={styles.journeys}>
                    {event.journeys.list.map((j) => (
                      <li key={j.slug} className={styles.journey}>
                        {j.durationShort ? <span className={styles.journeyLen}>{j.durationShort}</span> : null}
                        <span className={styles.journeyName}>{j.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : null}
            <span className={styles.more}>
              <span>{dict.readMore}</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.moreArrow}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

import Link from 'next/link'
import type { CSSProperties } from 'react'

import { CreditImage } from '@/components/CreditImage'
import page from '@/components/site/Page.module.css'
import type { EventContent, Locale } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import { shortDate } from './dates'
import styles from './EventHero.module.css'

type Props = {
  event: EventContent
  locale: Locale
  dict: Dict
  /** Anchors of the chapters the two invitations lead to; absent when the chapter is. */
  journeysId?: string
  daysId?: string
}

/**
 * The opening: a full-bleed photograph, the words low and to the left, the
 * dates as a column at the right — the way a programme prints them.
 */
export function EventHero({ event, locale, dict, journeysId, daysId }: Props) {
  const t = dict.events

  return (
    <section
      id="top"
      className={styles.hero}
      data-stage={event.eyebrow ?? t.detailEyebrow}
      style={{ '--hero-darken': event.heroDarken } as CSSProperties}
    >
      <div className={styles.zoom} data-zoom>
        <CreditImage image={event.heroImage} sizes="100vw" priority />
      </div>
      <div className={styles.scrim} />
      <div className={styles.veil} data-heroveil aria-hidden="true" />

      <div className={styles.word} data-heroword>
        <div className={styles.grid}>
          <div className={styles.text}>
            {event.eyebrow ? (
              <div className={styles.eyebrow} data-fade data-delay="0.15">
                {event.eyebrow}
              </div>
            ) : null}
            <h1 className={styles.headline} data-words data-delay="0.4">
              <Lines text={event.headline} />
            </h1>
            {event.statement ? (
              <p className={styles.statement} data-fade data-delay="1.1">
                <Lines text={event.statement} />
              </p>
            ) : null}
            {journeysId || daysId ? (
              <div className={styles.actions} data-fade data-delay="1.4">
                {journeysId ? (
                  <Link href={`#${journeysId}`} className={page.buttonGhost}>
                    {t.toJourneys}
                  </Link>
                ) : null}
                {daysId ? (
                  <Link href={`#${daysId}`} className={styles.textLink}>
                    {t.toDays}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          {event.dates.length ? (
            <dl className={styles.dates} data-fade data-delay="0.9">
              {event.dates.map((d) => (
                <div key={`${d.date}-${d.label}`} className={styles.date}>
                  <dt className={styles.dateLabel}>{d.label}</dt>
                  <dd className={styles.dateValue}>{shortDate(d.date, locale)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <div className={styles.cue} aria-hidden="true">
        <span className={styles.cueLine} />
      </div>
    </section>
  )
}

import Link from 'next/link'

import type { Journey, Locale } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import styles from './Itinerary.module.css'

type Props = {
  journey: Journey
  locale: Locale
  dict: Dict
}

/**
 * The itinerary is the main storytelling surface; the overview stays
 * secondary. An item may reference a product, a venue and facilitators — or
 * none of them, in which case it is simply a custom activity.
 */
export function Itinerary({ journey, locale, dict }: Props) {
  const t = dict.journeys
  const prefix = locale === 'id' ? '/id' : ''

  const facts = [
    journey.durationText ? { key: t.duration, value: journey.durationText } : null,
    journey.suggestedPax ? { key: t.pax, value: journey.suggestedPax } : null,
    journey.locationPreference ? { key: t.location, value: journey.locationPreference } : null,
    journey.facilities.length ? { key: t.facilities, list: journey.facilities } : null,
    journey.inclusions.length ? { key: t.inclusion, list: journey.inclusions } : null,
    journey.exclusions.length ? { key: t.exclusion, list: journey.exclusions } : null,
  ].filter(Boolean) as { key: string; value?: string; list?: string[] }[]

  return (
    <>
      <div className={styles.days}>
        {journey.days.map((day, index) => (
          <div key={`${day.title}-${index}`} className={styles.day} data-fade id={`day-${index + 1}`}>
            <span className={styles.dayNumber}>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <div className={styles.dayHeader}>
                <div className={styles.dayLabel}>
                  {t.day} {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className={styles.dayTitle}>{day.title}</h3>
                {day.note ? <p className={styles.dayNote}>{day.note}</p> : null}
              </div>

              <ul className={styles.items}>
                {day.items.map((item, i) => {
                  const meta = [item.venueName, ...item.facilitatorNames].filter(Boolean)
                  return (
                    <li key={`${item.title}-${i}`} className={styles.item}>
                      <span className={styles.time}>{item.time ?? ''}</span>
                      <span>
                        <span className={styles.itemTitle}>
                          {item.productSlug ? (
                            <Link
                              href={`${prefix}/product/${item.productSlug}`}
                              className={styles.itemLink}
                            >
                              {item.title}
                            </Link>
                          ) : (
                            item.title
                          )}
                        </span>
                        {meta.length ? (
                          <span className={styles.itemMeta}>{meta.join(' · ')}</span>
                        ) : null}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {facts.length ? (
        <div className={styles.overview}>
          {facts.map((fact) => (
            <div key={fact.key} className={styles.fact} data-fade>
              <div className={styles.factKey}>{fact.key}</div>
              {fact.value ? <div className={styles.factValue}>{fact.value}</div> : null}
              {fact.list ? (
                <ul className={styles.factList}>
                  {fact.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

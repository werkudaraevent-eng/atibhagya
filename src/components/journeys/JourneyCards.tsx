import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import type { Journey, Locale } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import styles from './JourneyCards.module.css'

type Props = {
  journeys: Journey[]
  locale: Locale
  dict: Dict
}

export function JourneyCards({ journeys, locale, dict }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  return (
    <div className={styles.list}>
      {journeys.map((journey, index) => (
        <Link
          key={journey.id}
          href={`${prefix}/journey/${journey.slug}`}
          className={styles.row}
          data-fade
        >
          <div className={styles.numberCol}>
            <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div className={styles.image}>
            <CreditImage
              image={journey.heroImage}
              sizes="(max-width: 780px) 100vw, 45vw"
              insideLink
            />
          </div>
          <div className={styles.caption}>
            <h3 className={styles.title}>{journey.title}</h3>
            {journey.summary ? <div className={styles.summary}>{journey.summary}</div> : null}
            {journey.positioning ? (
              <p className={styles.positioning}>{journey.positioning}</p>
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

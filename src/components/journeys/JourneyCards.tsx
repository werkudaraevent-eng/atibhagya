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
          <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
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
            <span className={styles.more}>{dict.readMore}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

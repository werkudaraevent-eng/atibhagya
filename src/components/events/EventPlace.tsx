import { CreditImage } from '@/components/CreditImage'
import { SectionMark } from '@/components/site/Ornament'
import page from '@/components/site/Page.module.css'
import type { EventContent } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './EventPlace.module.css'

type Props = {
  place: EventContent['place']
  id: string
  number: string
  stage: string
}

/** The place itself: a tall photograph beside one large number and its story. */
export function EventPlace({ place, id, number, stage }: Props) {
  return (
    <section id={id} className={page.section} data-stage={stage} data-chapter={number}>
      <div className={`${page.container} ${styles.grid}`}>
        <div className={styles.frame} data-open>
          <div className={styles.para} data-para>
            <CreditImage image={place.image} sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
        </div>

        <div>
          <SectionMark number={number} mark="sprout" label={stage} align="start" />
          {place.number ? (
            <div className={styles.figure} data-fade>
              <span className={styles.number}>{place.number}</span>
              {place.caption ? (
                <span className={styles.caption}>
                  <Lines text={place.caption} />
                </span>
              ) : null}
            </div>
          ) : null}
          {place.headline ? (
            <h2 className={styles.headline} data-words>
              <Lines text={place.headline} />
            </h2>
          ) : null}
          {place.body ? (
            <p className={styles.body} data-fade>
              <Lines text={place.body} />
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

import { SectionMark } from '@/components/site/Ornament'
import page from '@/components/site/Page.module.css'
import type { EventContent } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './EventIntro.module.css'

type Props = {
  intro: EventContent['intro']
  id: string
  number: string
  stage: string
}

/** Why the brand walks to this event: a chapter mark, a sentence, a paragraph. */
export function EventIntro({ intro, id, number, stage }: Props) {
  return (
    <section id={id} className={`${page.section} ${styles.section}`} data-stage={stage} data-chapter={number}>
      <div className={`${page.container} ${styles.container}`}>
        <SectionMark number={number} mark="wave" label={stage} align="center" />
        {intro.headline ? (
          <h2 className={styles.headline} data-words>
            <Lines text={intro.headline} />
          </h2>
        ) : null}
        {intro.body ? (
          <p className={styles.body} data-fade>
            <Lines text={intro.body} />
          </p>
        ) : null}
      </div>
    </section>
  )
}

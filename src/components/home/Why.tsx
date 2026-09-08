import { SectionMark } from '@/components/site/Ornament'
import page from '@/components/site/Page.module.css'
import type { HomeContent } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './Why.module.css'

export function Why({ why }: { why: HomeContent['why'] }) {
  return (
    <section id="why" className={page.section} data-stage={why.eyebrow} data-chapter="01">
      <div className={page.container}>
        <div className={page.split}>
          <div>
            <SectionMark number="01" mark="sprout" label={why.eyebrow} align="start" />
            <h2 className={page.headline} data-words>
              <Lines text={why.headline} />
            </h2>
          </div>
          <p className={page.lede} data-fade>
            {why.body}
          </p>
        </div>

        <div className={styles.pillars}>
          {why.pillars.map((pillar) => (
            <div key={pillar.title} className={styles.pillar} data-fade>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarBody}>{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import page from '@/components/site/Page.module.css'
import type { HomeContent } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './Hero.module.css'

type Props = {
  hero: HomeContent['hero']
  ctaHref: string
}

/**
 * The first fold is the media. Text stays centred over it — the one place the
 * wireframe allows centre over editorial asymmetry.
 */
export function Hero({ hero, ctaHref }: Props) {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.zoom} data-zoom>
        <CreditImage image={hero.image} sizes="100vw" priority />
        {hero.video ? (
          <video className={styles.video} src={hero.video} autoPlay muted loop playsInline />
        ) : null}
      </div>

      <div className={styles.scrim} />

      <div className={styles.word} data-heroword>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.headline} data-headline>
          <Lines text={hero.headline} />
        </h1>
        <p className={styles.statement}>{hero.statement}</p>
        <div className={styles.actions}>
          <Link href={ctaHref} className={page.buttonGhost}>
            {hero.ctaLabel}
          </Link>
        </div>
      </div>

      <div className={styles.cue} aria-hidden="true">
        <span className={styles.cueLine} />
      </div>
    </section>
  )
}

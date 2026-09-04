import Link from 'next/link'
import type { CSSProperties } from 'react'

import { CreditImage } from '@/components/CreditImage'
import page from '@/components/site/Page.module.css'
import type { HomeContent } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './Hero.module.css'
import { HeroVideo } from './HeroVideo'

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
    <section
      className={styles.hero}
      id="top"
      data-stage="Atibhagya"
      style={{ '--hero-darken': hero.darken } as CSSProperties}
    >
      <div className={styles.zoom} data-zoom>
        <CreditImage image={hero.image} sizes="100vw" priority />
        {hero.video ? <HeroVideo src={hero.video} poster={hero.image.src} /> : null}
      </div>

      {/* The colour grade: navy in the shadows, warmth in the light, so any
          photograph an editor uploads settles into the brand's palette. */}
      <div className={styles.grade} aria-hidden="true" />
      <div className={styles.cast} aria-hidden="true" />
      <div className={styles.scrim} />
      {/* A breathing pool of light behind the words, and an ivory veil the
          page pulls over the photograph as it is left — the hero dissolves
          into the page colour rather than being cut off by it. */}
      <div className={styles.mist} aria-hidden="true" />
      <div className={styles.veil} data-heroveil aria-hidden="true" />

      <div className={styles.word} data-heroword>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.headline} data-words>
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

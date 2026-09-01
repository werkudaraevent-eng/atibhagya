import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import page from '@/components/site/Page.module.css'
import type { HomeContent } from '@/lib/content/types'
import styles from './ClosingCta.module.css'

type Props = {
  cta: HomeContent['cta']
  href: string
}

export function ClosingCta({ cta, href }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.para} data-para>
        <CreditImage image={cta.image} sizes="100vw" />
      </div>
      <div className={styles.scrim} />
      <div className={styles.content}>
        <h2 className={styles.headline} data-fade>
          {cta.headline}
        </h2>
        <p className={styles.body} data-fade>
          {cta.body}
        </p>
        <div className={styles.actions} data-fade>
          <Link href={href} className={page.buttonGhost}>
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

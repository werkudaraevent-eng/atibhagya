import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import { SectionMark } from '@/components/site/Ornament'
import page from '@/components/site/Page.module.css'
import type { EventContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './EventProducts.module.css'

type Props = {
  products: EventContent['products']
  eventSlug: string
  prefix: string
  id: string
  number: string
  stage: string
  dict: Dict
}

/**
 * The experiences offered at the event, as a plain grid rather than the
 * catalogue's slider: a visitor arriving from a shared link should see every
 * option at once. Each card opens the inquiry with that experience chosen and
 * the event attached, so the team can tell these inquiries apart.
 */
export function EventProducts({ products, eventSlug, prefix, id, number, stage, dict }: Props) {
  const t = dict.events

  return (
    <section id={id} className={`${page.section} ${styles.section}`} data-stage={stage} data-chapter={number}>
      <div className={page.container}>
        <SectionMark number={number} mark="wave" label={stage} align="center" />
        {products.headline ? (
          <h2 className={styles.headline} data-words>
            <Lines text={products.headline} />
          </h2>
        ) : null}

        <ul className={styles.grid}>
          {products.list.map((product) => {
            const detailHref = `${prefix}/product/${product.slug}`
            const enquireHref = `${prefix}/inquiry?product=${encodeURIComponent(product.slug)}&event=${encodeURIComponent(eventSlug)}`
            const line = product.highlightText || product.subtitle || product.description

            return (
              <li key={product.id} className={styles.card} data-fade>
                <Link href={detailHref} className={styles.image} tabIndex={-1} aria-hidden="true">
                  <CreditImage image={product.image} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" insideLink />
                </Link>
                <div className={styles.body}>
                  {product.categoryName ? <div className={styles.category}>{product.categoryName}</div> : null}
                  <h3 className={styles.title}>
                    <Link href={detailHref}>{product.title}</Link>
                  </h3>
                  {line ? <p className={styles.line}>{line}</p> : null}
                </div>
                <div className={styles.actions}>
                  <Link
                    href={enquireHref}
                    prefetch={true}
                    className={styles.enquire}
                    aria-label={`${t.enquireProduct}: ${product.title}`}
                  >
                    {t.enquireProduct}
                  </Link>
                  <Link href={detailHref} className={styles.details} aria-label={`${t.viewProduct}: ${product.title}`}>
                    {t.viewProduct}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

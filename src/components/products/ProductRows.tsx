import { Lines } from '@/lib/text'
import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import type { Locale, ProductCard } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { ElementMark } from './ElementMark'
import styles from './ProductRows.module.css'

type Props = {
  products: ProductCard[]
  locale: Locale
  dict: Dict
  /** Numbering continues across Load more, so the index never restarts. */
  startIndex?: number
}

/**
 * The catalogue as an editorial index rather than a card grid: one experience
 * per row, image-led at 58/42, sides swapping on every second row.
 *
 * On entry the photograph opens from its own top edge, the title rises out of
 * its mask, and the rule under "Read more" draws itself in. While scrolling,
 * the text column drifts a little slower than the image.
 */
export function ProductRows({ products, locale, dict, startIndex = 0 }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  return (
    <div className={styles.rows}>
      {products.map((product, i) => {
        const index = startIndex + i

        return (
          <Link
            key={product.id}
            href={`${prefix}/product/${product.slug}`}
            className={index % 2 === 1 ? `${styles.row} ${styles.rowAlt}` : styles.row}
            data-reveal
          >
            <figure className={`${styles.figure} ${styles.media}`}>
              <div className={styles.image} data-open>
                <CreditImage
                  image={product.image}
                  sizes="(max-width: 820px) 100vw, 58vw"
                  insideLink
                  hideCredit
                />
              </div>
              {product.image.credit ? (
                <figcaption className={styles.credit}>{product.image.credit}</figcaption>
              ) : null}
            </figure>

            <div className={styles.text} data-rowtext>
              <div className={styles.index}>
                {product.categoryName ? (
                  <span className={styles.category}>{product.categoryName}</span>
                ) : null}
                <span className={styles.element}>
                  <ElementMark
                    element={product.element}
                    label={dict.products.elements[product.element]}
                  />
                </span>
              </div>

              <h3 className={styles.title} data-headline>
                <Lines text={product.title} />
              </h3>
              {product.subtitle ? <div className={styles.subtitle}>{product.subtitle}</div> : null}
              {product.highlightText ? (
                <p className={styles.highlight}>{product.highlightText}</p>
              ) : null}

              <div className={styles.cueWrapper}>
                <span className={styles.cue}>
                  <span className={styles.cueText}>{dict.readMore}</span>
                  <svg
                    className={styles.cueArrow}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="3" y1="10" x2="16" y2="10" />
                    <polyline points="11 5 16 10 11 15" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

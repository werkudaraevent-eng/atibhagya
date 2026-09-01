import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import type { Locale, ProductCard } from '@/lib/content/types'
import styles from './ProductCard.module.css'

type Props = {
  products: ProductCard[]
  locale: Locale
}

export function ProductGrid({ products, locale }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`${prefix}/product/${product.slug}`}
          className={styles.card}
          data-fade
        >
          <div className={styles.image}>
            <CreditImage
              image={product.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
              insideLink
            />
          </div>
          <div className={styles.body}>
            <div className={styles.category}>{product.categoryName ?? ''}</div>
            <h3 className={styles.title}>{product.title}</h3>
            <div className={styles.subtitle}>{product.subtitle ?? ''}</div>
            <div className={styles.highlight}>{product.highlightText ?? ''}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import { useDragScroll } from '@/hooks/useDragScroll'
import type { Locale, ProductCard } from '@/lib/content/types'
import styles from './ProductCard.module.css'

type Props = {
  products: ProductCard[]
  locale: Locale
}

export function ProductGrid({ products, locale }: Props) {
  const prefix = locale === 'id' ? '/id' : ''
  const trackRef = useDragScroll<HTMLDivElement>({ momentum: true })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const [arrowTop, setArrowTop] = useState<number | undefined>(undefined)

  const updateArrowPosition = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const img = el.querySelector<HTMLElement>(`.${styles.image}`)
    if (img) {
      const imgRect = img.getBoundingClientRect()
      const trackRect = el.getBoundingClientRect()
      const topOffset = imgRect.top - trackRect.top + imgRect.height / 2
      setArrowTop(topOffset)
    }
  }, [])

  const checkScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    checkScroll()
    updateArrowPosition()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    window.addEventListener('resize', updateArrowPosition)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
      window.removeEventListener('resize', updateArrowPosition)
    }
  }, [checkScroll, updateArrowPosition, products])

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>(`.${styles.card}`)
    const cardWidth = card?.offsetWidth ?? 280
    const gap = parseFloat(window.getComputedStyle(el).gap || '32') || 32
    const scrollAmount = (cardWidth + gap) * (direction === 'right' ? 1 : -1)
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className={styles.sliderWrapper}>
      <button
        type="button"
        className={`${styles.navBtn} ${styles.prevBtn}`}
        style={arrowTop !== undefined ? { top: `${arrowTop}px` } : undefined}
        onClick={() => scrollByAmount('left')}
        disabled={!canScrollLeft}
        aria-label="Previous experiences"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className={`${styles.navBtn} ${styles.nextBtn}`}
        style={arrowTop !== undefined ? { top: `${arrowTop}px` } : undefined}
        onClick={() => scrollByAmount('right')}
        disabled={!canScrollRight}
        aria-label="Next experiences"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div ref={trackRef} className={styles.sliderTrack}>
        {products.map((product, i) => (
          <Link
            key={product.id}
            href={`${prefix}/product/${product.slug}`}
            className={styles.card}
            data-fade
            draggable={false}
          >
            <div className={styles.image} data-drift={(i % 3) - 1}>
              <CreditImage
                image={product.image}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                insideLink
              />
            </div>
            <div className={styles.body}>
              <div className={styles.category}>{product.categoryName ?? ''}</div>
              <h3 className={styles.title}>{product.title}</h3>
              {(product.highlightText || product.description || product.subtitle) && (
                <p className={styles.highlight}>
                  {product.highlightText || product.description || product.subtitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

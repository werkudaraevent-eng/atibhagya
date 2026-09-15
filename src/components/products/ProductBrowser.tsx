'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Locale, ProductCard, ProductCategory } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { ProductRows } from './ProductRows'
import styles from './ProductBrowser.module.css'

type Props = {
  products: ProductCard[]
  categories: ProductCategory[]
  locale: Locale
  dict: Dict
}

/**
 * Eight to start. The rows are tall and image-led, so eight already fills
 * several screens — and Load more keeps the footer reachable and the back
 * button honest, which infinite scroll does not.
 */
const PAGE = 8

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function ProductBrowser({ products, categories, locale, dict }: Props) {
  const t = dict.products

  const [category, setCategory] = useState<string | null>(null)
  const [term, setTerm] = useState('')
  const [shown, setShown] = useState(PAGE)

  // The filters live in the address as well as in state — `?category=`, `q=`
  // — so a narrowed listing can be shared, and the back button returns to the same view.
  const readFromUrl = useRef(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const wantedCategory = params.get('category')
    const wantedTerm = params.get('q') ?? ''

    if (wantedCategory && categories.some((c) => c.slug === wantedCategory)) setCategory(wantedCategory)
    if (wantedTerm) setTerm(wantedTerm.slice(0, 80))
    setShown(PAGE)
    readFromUrl.current = true
  }, [categories])

  // Write the filters back without adding history entries.
  useEffect(() => {
    if (!readFromUrl.current) return
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (term.trim()) params.set('q', term.trim())
    const search = params.toString()
    const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next)
    }
  }, [category, term])

  const haystacks = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of products) {
      map.set(
        p.id,
        normalise([p.title, p.subtitle, p.highlightText, p.categoryName].filter(Boolean).join(' ')),
      )
    }
    return map
  }, [products])

  const filtered = useMemo(() => {
    const needle = normalise(term.trim())
    return products.filter((p) => {
      if (category && p.categorySlug !== category) return false
      if (needle && !haystacks.get(p.id)?.includes(needle)) return false
      return true
    })
  }, [products, category, term, haystacks])

  const change = (fn: () => void) => {
    fn()
    setShown(PAGE)
  }

  const reset = () =>
    change(() => {
      setCategory(null)
      setTerm('')
    })

  const visible = filtered.slice(0, shown)
  const remaining = filtered.length - visible.length
  const narrowed = category !== null || term.trim() !== ''

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.categories} role="group" aria-label={t.filterCategory}>
          <button
            type="button"
            onClick={() => change(() => setCategory(null))}
            aria-pressed={category === null}
            className={category === null ? `${styles.filter} ${styles.filterActive}` : styles.filter}
          >
            {t.all}
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => change(() => setCategory(item.slug))}
              aria-pressed={category === item.slug}
              className={
                category === item.slug ? `${styles.filter} ${styles.filterActive}` : styles.filter
              }
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className={styles.search}>
          <input
            className={styles.searchInput}
            type="search"
            value={term}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            onChange={(e) => change(() => setTerm(e.target.value))}
          />
          {term ? (
            <button
              type="button"
              className={styles.clear}
              onClick={() => change(() => setTerm(''))}
              aria-label={t.clear}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {t.empty}
          {narrowed ? (
            <button type="button" className={styles.reset} onClick={reset}>
              {t.reset}
            </button>
          ) : null}
        </p>
      ) : (
        <>
          <ProductRows products={visible} locale={locale} dict={dict} />

          {remaining > 0 ? (
            <div className={styles.more}>
              <button
                type="button"
                className={styles.moreButton}
                onClick={() => setShown((n) => n + PAGE)}
              >
                {t.loadMore}
              </button>
              <span className={styles.moreCount}>
                {t.remaining.replace('{n}', String(remaining))}
              </span>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

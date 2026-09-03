'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Locale, ProductCard, ProductCategory } from '@/lib/content/types'
import { ELEMENTS } from '@/lib/elements'
import type { Dict } from '@/lib/i18n/ui'
import { AudienceSelect } from './AudienceSelect'
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
  const [audience, setAudience] = useState('')
  const [element, setElement] = useState('')
  const [term, setTerm] = useState('')
  const [shown, setShown] = useState(PAGE)

  // The filters live in the address as well as in state — `?category=`,
  // `for=`, `element=`, `q=` — so a narrowed listing can be shared, and the
  // back button returns to the same view. A product page's breadcrumb links
  // back here with `?category=` for the same reason.
  //
  // Read from `window.location` after mount, deliberately not via
  // `useSearchParams`: that hook needs a Suspense boundary on a static page,
  // and a boundary makes React hydrate this subtree late — after GSAP has
  // already written inline styles onto the rows — which fails hydration.
  const readFromUrl = useRef(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const wantedCategory = params.get('category')
    const wantedAudience = params.get('for') ?? ''
    const wantedElement = params.get('element') ?? ''
    const wantedTerm = params.get('q') ?? ''

    if (wantedCategory && categories.some((c) => c.slug === wantedCategory)) setCategory(wantedCategory)
    if (wantedAudience && wantedAudience in t.suitable) setAudience(wantedAudience)
    if (wantedElement && (ELEMENTS as readonly string[]).includes(wantedElement)) setElement(wantedElement)
    if (wantedTerm) setTerm(wantedTerm.slice(0, 80))
    setShown(PAGE)
    readFromUrl.current = true
  }, [categories, t.suitable])

  // Write the filters back without adding history entries: the back button
  // should leave the listing, not step through every keystroke.
  useEffect(() => {
    if (!readFromUrl.current) return
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (audience) params.set('for', audience)
    if (element) params.set('element', element)
    if (term.trim()) params.set('q', term.trim())
    const search = params.toString()
    const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next)
    }
  }, [category, audience, element, term])

  const audiences = useMemo(() => {
    const present = new Set<string>()
    products.forEach((p) => p.suitableFor.forEach((s) => present.add(s)))
    return Object.keys(t.suitable).filter((key) => present.has(key))
  }, [products, t.suitable])

  // Only the elements the catalogue actually holds, in their canonical order.
  const elements = useMemo(() => {
    const present = new Set(products.map((p) => p.element))
    return ELEMENTS.filter((e) => present.has(e))
  }, [products])

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
      if (audience && !p.suitableFor.includes(audience)) return false
      if (element && p.element !== element) return false
      if (needle && !haystacks.get(p.id)?.includes(needle)) return false
      return true
    })
  }, [products, category, audience, element, term, haystacks])

  const change = (fn: () => void) => {
    fn()
    setShown(PAGE)
  }

  const reset = () =>
    change(() => {
      setCategory(null)
      setAudience('')
      setElement('')
      setTerm('')
    })

  const visible = filtered.slice(0, shown)
  const remaining = filtered.length - visible.length
  const narrowed = category !== null || audience !== '' || element !== '' || term.trim() !== ''

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

        <div className={styles.aside}>
          {elements.length > 1 ? (
            <AudienceSelect
              label={t.elementLabel}
              options={[
                { value: '', label: t.anyElement },
                ...elements.map((e) => ({ value: e, label: t.elements[e] })),
              ]}
              value={element}
              onChange={(value) => change(() => setElement(value))}
            />
          ) : null}

          {audiences.length > 1 ? (
            <AudienceSelect
              label={t.forLabel}
              options={[
                { value: '', label: t.anyone },
                ...audiences.map((key) => ({ value: key, label: t.suitable[key] })),
              ]}
              value={audience}
              onChange={(value) => change(() => setAudience(value))}
            />
          ) : null}

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
      </div>

      <div className={styles.count} aria-live="polite">
        {t.showing
          .replace('{shown}', String(visible.length))
          .replace('{total}', String(filtered.length))}
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

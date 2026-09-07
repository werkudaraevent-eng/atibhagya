'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { SectionMark } from '@/components/site/Ornament'
import type { Journey, Locale } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './JourneyStage.module.css'

type Props = {
  journeys: Journey[]
  defaultSlug?: string
  locale: Locale
  dict: Dict
  pdfUrl?: string
  id: string
  number: string
  stage: string
  headline?: string
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/** The design's beats: detail crossfade, rows out, then rows back in staggered. */
const DAY_FADE = 180
const JOURNEY_SWAP = 320

/**
 * The journeys, as one stage that fits a screen: chips to choose a journey,
 * its days down the left, the chosen day's detail on the right. Click only —
 * nothing here is tied to scroll, and nothing opens on hover. A day of the
 * event itself turns the detail panel to night.
 */
export function JourneyStage({
  journeys,
  defaultSlug,
  locale,
  dict,
  pdfUrl,
  id,
  number,
  stage,
  headline,
}: Props) {
  const t = dict.events
  const prefix = locale === 'id' ? '/id' : ''
  const initial = Math.max(
    0,
    journeys.findIndex((j) => j.slug === defaultSlug),
  )

  const [pk, setPk] = useState(initial)
  const [day, setDay] = useState(0)
  /** Which arrival of the rows this is, so they re-enter after a swap. */
  const [entry, setEntry] = useState(0)
  const [detailHidden, setDetailHidden] = useState(false)
  const [rowsLeaving, setRowsLeaving] = useState(false)
  const timer = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // The ghost numeral drifts against the pointer — a fingertip of depth
  // behind the words. Pointer devices only, and never under reduced motion.
  useEffect(() => {
    const wrap = wrapRef.current
    const ghost = ghostRef.current
    if (!wrap || !ghost) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cur = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0
    const step = () => {
      cur.x += (cur.tx - cur.x) * 0.06
      cur.y += (cur.ty - cur.y) * 0.06
      ghost.style.transform = `translate(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px)`
      if (Math.abs(cur.tx - cur.x) > 0.1 || Math.abs(cur.ty - cur.y) > 0.1) raf = requestAnimationFrame(step)
      else raf = 0
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height
      cur.tx = nx * -22
      cur.ty = ny * -16
      wake()
    }
    const onLeave = () => {
      cur.tx = 0
      cur.ty = 0
      wake()
    }
    wrap.addEventListener('pointermove', onMove, { passive: true })
    wrap.addEventListener('pointerleave', onLeave)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!journeys.length) return null

  const journey = journeys[Math.min(pk, journeys.length - 1)]!
  const days = journey.days
  const n = days.length
  const di = Math.min(day, Math.max(0, n - 1))
  const current = days[di]
  const night = Boolean(current?.highlight)
  const nn = String(di + 1).padStart(2, '0')
  const dense = n > 6

  const pickDay = (i: number) => {
    if (i === di || i < 0 || i >= n) return
    window.clearTimeout(timer.current)
    setDetailHidden(true)
    timer.current = window.setTimeout(() => {
      setDay(i)
      setDetailHidden(false)
    }, DAY_FADE)
  }

  const pickJourney = (i: number) => {
    if (i === pk) return
    window.clearTimeout(timer.current)
    setDetailHidden(true)
    setRowsLeaving(true)
    timer.current = window.setTimeout(() => {
      setPk(i)
      setDay(0)
      setEntry((e) => e + 1)
      setRowsLeaving(false)
      setDetailHidden(false)
    }, JOURNEY_SWAP)
  }

  const onListKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? Math.min(n - 1, di + 1) : Math.max(0, di - 1)
    pickDay(next)
    listRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  const enquireHref = `${prefix}/inquiry?journey=${encodeURIComponent(journey.slug)}`
  const journeyHref = `${prefix}/journey/${journey.slug}`
  const fill = `${(((di + 0.5) / Math.max(1, n)) * 100).toFixed(1)}%`

  return (
    <section
      id={id}
      className={styles.section}
      data-stage={stage}
      data-chapter={number}
      data-dense={dense || undefined}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionMark number={number} mark="wave" label={stage} align="start" />
          {headline ? (
            <h2 className={styles.headline} data-fade>
              <Lines text={headline} />
            </h2>
          ) : null}
        </div>

        <div className={styles.chips} role="radiogroup" aria-label={t.chooseJourney}>
          <span className={styles.chipsLabel}>{t.chooseJourney}</span>
          {journeys.map((j, i) => (
            <button
              key={j.slug || i}
              type="button"
              role="radio"
              aria-checked={i === pk}
              className={styles.chip}
              onClick={() => pickJourney(i)}
            >
              <span className={styles.chipName}>{j.title}</span>
              {j.durationShort ? <span className={styles.chipLen}>{j.durationShort}</span> : null}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          <div
            ref={listRef}
            className={styles.list}
            data-leaving={rowsLeaving || undefined}
            onKeyDown={onListKey}
          >
            <span className={styles.track} aria-hidden="true" />
            <span className={styles.fill} style={{ height: fill }} aria-hidden="true" />
            {days.map((d, i) => {
              const on = i === di
              const past = i < di
              return (
                <button
                  key={`${entry}-${i}`}
                  type="button"
                  className={styles.row}
                  style={{ '--i': i } as React.CSSProperties}
                  aria-pressed={on}
                  data-on={on || undefined}
                  data-past={past || undefined}
                  data-hi={d.highlight || undefined}
                  onClick={() => pickDay(i)}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.rowN}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{d.title}</span>
                    {d.kicker ? <span className={styles.rowKicker}>{d.kicker}</span> : null}
                  </span>
                </button>
              )
            })}
            <span className={styles.rowEnd} aria-hidden="true" />
          </div>

          <div ref={wrapRef} className={styles.detailWrap} data-night={night || undefined}>
            <div className={styles.glow} aria-hidden="true" />
            <div ref={ghostRef} className={styles.ghost} aria-hidden="true">
              {nn}
            </div>

            <div className={styles.detail} data-hidden={detailHidden || undefined} aria-live="polite">
              {current ? (
                <>
                  <div className={styles.dayLine}>
                    <span className={styles.odometer} aria-label={`${t.day} ${nn}`}>
                      <Odometer digit={nn[0]!} />
                      <Odometer digit={nn[1]!} late />
                    </span>
                    <span className={styles.dayKicker}>
                      {t.day} {nn}
                      {current.kicker ? ` · ${current.kicker}` : ''}
                    </span>
                  </div>
                  <h3 className={styles.dayTitle} key={`${pk}-${di}`}>
                    <Words text={current.title} />
                  </h3>
                  {current.note ? <p className={styles.dayBody}>{current.note}</p> : null}
                  {current.items.length ? (
                    <p className={styles.items}>
                      {current.items.map((item, i) => (
                        <span key={`${item.title}-${i}`}>
                          <em className={styles.itemName}>
                            {item.productSlug ? (
                              <Link href={`${prefix}/product/${item.productSlug}`} className={styles.itemLink}>
                                {item.title}
                              </Link>
                            ) : (
                              item.title
                            )}
                          </em>
                          {item.productLine ? ` — ${item.productLine}` : ''}
                          {i < current.items.length - 1 ? ' ' : ''}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className={styles.foot}>
              <span className={styles.footWords}>
                {[journey.durationText, journey.summary].filter(Boolean).join(' · ')}
              </span>
              <div className={styles.footActions}>
                <Link href={enquireHref} className={styles.ghostButton}>
                  {t.enquire}
                </Link>
                <Link href={journeyHref} className={styles.footLink}>
                  {t.viewJourney}
                </Link>
                {pdfUrl ? (
                  <a href={pdfUrl} className={styles.footLink} target="_blank" rel="noopener noreferrer">
                    {t.pdf}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** One rolling digit: a column of ten, translated to the one in view. */
function Odometer({ digit, late }: { digit: string; late?: boolean }) {
  const d = Number(digit) || 0
  return (
    <span className={styles.digitWindow}>
      <span
        className={late ? `${styles.digitStack} ${styles.digitLate}` : styles.digitStack}
        style={{ transform: `translateY(-${d}em)` }}
      >
        {DIGITS.map((g) => (
          <span key={g} className={styles.digit}>
            {g}
          </span>
        ))}
      </span>
    </span>
  )
}

/** The title, a word at a time, each settling from a blur 70ms after the last. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).map((word, i) => (
        <span key={`${word}-${i}`} className={styles.word} style={{ '--i': i } as React.CSSProperties}>
          {word}
          {' '}
        </span>
      ))}
    </>
  )
}

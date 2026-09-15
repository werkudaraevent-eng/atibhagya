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
  const sectionRef = useRef<HTMLElement>(null)
  const lastWheelTime = useRef(0)
  const wheelDelta = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const journey = journeys.length > 0 ? journeys[Math.min(pk, journeys.length - 1)]! : null
  const days = journey?.days ?? []
  const n = days.length
  const di = Math.min(day, Math.max(0, n - 1))
  const current = days[di]
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

  const stateRef = useRef({ di, n, pickDay })
  useEffect(() => {
    stateRef.current = { di, n, pickDay }
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      const { di: curDi, n: totalN, pickDay: curPickDay } = stateRef.current

      // Mentok atas (Day 01) dan scroll ke atas -> biarkan scroll halaman
      if (e.deltaY < 0 && curDi <= 0) {
        return
      }

      // Mentok bawah (Hari Terakhir) dan scroll ke bawah -> biarkan scroll halaman
      if (e.deltaY > 0 && curDi >= totalN - 1) {
        return
      }

      // Masih di dalam rentang itinerary: cegah scroll halaman dan ganti hari
      e.preventDefault()
      e.stopPropagation()

      const now = Date.now()
      wheelDelta.current += e.deltaY

      const threshold = 20
      const cooldown = 180

      if (now - lastWheelTime.current > cooldown && Math.abs(wheelDelta.current) >= threshold) {
        if (wheelDelta.current > 0 && curDi < totalN - 1) {
          curPickDay(curDi + 1)
          lastWheelTime.current = now
        } else if (wheelDelta.current < 0 && curDi > 0) {
          curPickDay(curDi - 1)
          lastWheelTime.current = now
        }
        wheelDelta.current = 0
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const activeBtn = list.querySelectorAll<HTMLButtonElement>('button')[di]
    if (activeBtn) {
      activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [di, pk])

  const onListKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? Math.min(n - 1, di + 1) : Math.max(0, di - 1)
    pickDay(next)
    listRef.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  if (!journeys.length || !journey || !current) return null

  const enquireHref = `${prefix}/inquiry?journey=${encodeURIComponent(journey.slug)}`
  const journeyHref = `${prefix}/journey/${journey.slug}`
  const fill = `${(((di + 0.5) / Math.max(1, n)) * 100).toFixed(1)}%`

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.section}
      data-stage={stage}
      data-chapter={number}
      data-dense={dense || undefined}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionMark number={number} mark="wave" label={stage} align="center" />
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

          <div ref={wrapRef} className={styles.detailWrap}>
            <div className={styles.glow} aria-hidden="true" />

            <div className={styles.detail} data-hidden={detailHidden || undefined} aria-live="polite">
              {current ? (
                <>
                  <div className={styles.dayLine}>
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
                <Link href={enquireHref} prefetch={true} className={styles.ghostButton}>
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

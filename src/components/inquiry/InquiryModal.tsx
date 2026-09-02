'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { Locale, SiteContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { InquiryForm, type Choices } from './InquiryForm'
import styles from './InquiryModal.module.css'

type Props = {
  locale: Locale
  dict: Dict
  site: SiteContent
  choices: Choices
  initialProducts?: string[]
  initialJourneys?: string[]
  homeHref: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Longest transition in InquiryModal.module.css, plus a little headroom. */
const EXIT_MS = 520

/**
 * The inquiry as an intercepted dialog: `/inquiry` still has its own URL and
 * still renders as a full page on a direct visit, but arriving from a product
 * or journey lifts it over the page instead of replacing it — which is also
 * how the prefill keeps its context.
 */
export function InquiryModal({ homeHref, ...formProps }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const strandedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restoreFocusTo = useRef<HTMLElement | null>(null)
  // Guards the exit outside React state: a state updater can be invoked more
  // than once for a single update, and scheduling history navigation from
  // inside one sends the visitor back further than they asked to go.
  const closingRef = useRef(false)

  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)

    exitTimer.current = setTimeout(() => {
      router.back()
      // If history had nowhere to go, we are still mounted a moment later.
      strandedTimer.current = setTimeout(() => router.replace(homeHref), 500)
    }, EXIT_MS)
  }, [router, homeHref])

  useEffect(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null
    const frame = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current)
      if (strandedTimer.current) clearTimeout(strandedTimer.current)
    },
    [],
  )

  // Hold the page still behind the dialog, without the width jump that hiding
  // the scrollbar would otherwise cause.
  useEffect(() => {
    const root = document.documentElement
    const gap = window.innerWidth - root.clientWidth
    const previousOverflow = root.style.overflow
    const previousPadding = root.style.paddingRight

    root.style.overflow = 'hidden'
    if (gap > 0) root.style.paddingRight = `${gap}px`

    return () => {
      root.style.overflow = previousOverflow
      root.style.paddingRight = previousPadding
      restoreFocusTo.current?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [close])

  // Focus lands on the panel rather than the first field, so the invitation is
  // read before anything is asked.
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  const t = formProps.dict.inquiry

  return (
    <div
      className={[styles.root, open && !closing ? styles.open : '', closing ? styles.closing : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label={formProps.dict.close}>
          <span className={styles.closeGlyph} aria-hidden="true" />
        </button>

        <InquiryForm
          {...formProps}
          onDone={close}
          heading={
            <>
              <div className={styles.eyebrow}>{t.eyebrow}</div>
              <h2 className={styles.headline} id="inquiry-title">
                {t.headline}
              </h2>
              <p className={styles.lede}>{t.lede}</p>
            </>
          }
        />
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'

export const SCROLL_KEY = 'atibhagya:scroll'

/**
 * Keeps the reader's place across a language switch.
 *
 * English and Indonesian live under different root segments, so switching
 * is a full page load, and a full page load starts at the top — the reader
 * who was halfway down the catalogue lands back on the hero. The switch
 * notes the scroll position first; this puts it back before the page's
 * entrance motion measures anything.
 */
export function RestoreScroll() {
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = sessionStorage.getItem(SCROLL_KEY)
      if (saved !== null) sessionStorage.removeItem(SCROLL_KEY)
    } catch {
      // Storage unavailable: nothing to restore.
    }
    if (saved === null) return

    const y = Number(saved)
    if (!Number.isFinite(y) || y <= 0) return

    // The browser's own restoration would fight this on a fresh URL.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const jump = () => window.scrollTo({ top: y, left: 0, behavior: 'instant' as ScrollBehavior })
    jump()
    // Once more after layout has settled (fonts, images with known sizes).
    const frame = requestAnimationFrame(() => requestAnimationFrame(jump))
    return () => cancelAnimationFrame(frame)
  }, [])

  return null
}

/** Called by the language switch just before it navigates. */
export function rememberScroll() {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)))
  } catch {
    // Storage unavailable: the reader starts at the top, as before.
  }
}

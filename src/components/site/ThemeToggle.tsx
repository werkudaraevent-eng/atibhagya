'use client'

import { useEffect, useId, useState } from 'react'

import styles from './ThemeToggle.module.css'

export const THEME_KEY = 'atibhagya:theme'

type Theme = 'light' | 'dark'

/**
 * Runs before anything paints, so the page never flashes the wrong theme.
 * Inlined into <head> by the layout; kept here so the key and the logic
 * live next to the control that changes them.
 */
export const THEME_SCRIPT = `(function(){try{var k='${THEME_KEY}';var s=localStorage.getItem(k);var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`

/** The 8 rays of the sun, as line endpoints on a 24-unit grid. */
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4
  return {
    x1: 12 + Math.cos(a) * 8.2,
    y1: 12 + Math.sin(a) * 8.2,
    x2: 12 + Math.cos(a) * 10.4,
    y2: 12 + Math.sin(a) * 10.4,
  }
})

type Props = {
  /** Accessible names: what pressing the control will do. */
  toDark: string
  toLight: string
  className?: string
}

/**
 * Light or dark, as a small eclipse.
 *
 * A sun with eight rays; pressing it slides a shadow across the disc until
 * a crescent is left and the rays fold away — one motion, no words, the
 * same gesture in reverse to come back. The choice is remembered, and until
 * one is made the site follows the system.
 */
export function ThemeToggle({ toDark, toLight, className }: Props) {
  const maskId = useId()
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    // Let colours cross-fade for this one change only, then remove the
    // blanket transition so it never interferes with the site's own motion.
    root.setAttribute('data-theme-transition', '')
    root.dataset.theme = next
    window.setTimeout(() => root.removeAttribute('data-theme-transition'), 600)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Private mode: the choice lasts for this visit.
    }
    setTheme(next)
  }

  const dark = theme === 'dark'

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      onClick={toggle}
      aria-label={dark ? toLight : toDark}
      aria-pressed={dark}
      title={dark ? toLight : toDark}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <mask id={maskId}>
          <rect width="24" height="24" fill="#fff" />
          {/* The shadow that turns the sun into a moon. */}
          <circle className={styles.shadow} cx="26" cy="9" r="6.4" fill="#000" />
        </mask>
        <circle
          className={styles.disc}
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g className={styles.rays} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          {RAYS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
          ))}
        </g>
      </svg>
    </button>
  )
}

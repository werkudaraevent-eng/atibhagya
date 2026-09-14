'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import type { Locale } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import styles from './Nav.module.css'

type Props = {
  locale: Locale
  dict: Dict
  /**
   * `dark` sits transparent over an immersive hero and turns ivory on scroll;
   * `light` is ivory from the start, for pages that open on the page colour.
   */
  tone?: 'dark' | 'light'
}

export function Nav({ locale, dict, tone = 'dark' }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || '/'
  const prefix = locale === 'id' ? '/id' : ''
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // The open menu covers the page: the page must not scroll beneath it, and
  // the keyboard belongs to the menu — Escape closes it, focus moves to its
  // first destination and comes back to the button when it closes.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const panel = panelRef.current
    const toggle = toggleRef.current
    const gap = window.innerWidth - root.clientWidth
    const previousOverflow = root.style.overflow
    const previousPadding = root.style.paddingRight
    root.style.overflow = 'hidden'
    if (gap > 0) root.style.paddingRight = `${gap}px`

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    // After the curtain has begun to rise, so the focus ring lands on a
    // visible link rather than on one still fading in.
    const focus = window.setTimeout(() => {
      panel?.querySelector<HTMLElement>('a')?.focus()
    }, 120)

    return () => {
      root.style.overflow = previousOverflow
      root.style.paddingRight = previousPadding
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focus)
      // Only when focus was inside the menu: a navigation moves it elsewhere.
      if (panel?.contains(document.activeElement)) toggle?.focus()
    }
  }, [open])

  // A navigation closes the menu, so a new page never opens under it.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { label: dict.nav.products, href: `${prefix}/product` },
    { label: dict.nav.journeys, href: `${prefix}/journey` },
    { label: dict.nav.about, href: `${prefix}/about` },
    // The season, while there is one: a live event by its own word, marked
    // with a breathing gold point; otherwise the events page, unmarked.
    ...(dict.eventLink
      ? [{ label: dict.eventLink.label, href: `${prefix}${dict.eventLink.href}`, live: dict.eventLink.live }]
      : []),
  ]
  const inquiryHref = `${prefix}/inquiry`

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const isEventPage = (href: string) => href.includes('/events')

  return (
    // `data-menu-open`, not `data-open`: the latter is the motion system's
    // "image opening from its top edge" hook, and the stylesheet clips
    // anything carrying it until GSAP reveals it.
    <div className={styles.nav} data-role="nav" data-tone={tone} data-menu-open={open || undefined}>
      <div className={styles.inner}>
        <Link href={prefix || '/'} className={styles.logoLink}>
          <Image
            src="/logo-atibhagya-gold.png"
            alt="Atibhagya"
            width={138}
            height={34}
            className={styles.logo}
            priority
          />
        </Link>

        <div className={styles.links}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                styles.link,
                isActive(link.href) || (isEventPage(link.href) && pathname.includes('/events'))
                  ? styles.linkActive
                  : '',
                'live' in link && link.live ? styles.linkLive : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {'live' in link && link.live ? <span className={styles.livePoint} aria-hidden="true" /> : null}
              {link.label}
            </Link>
          ))}

          <LanguageSwitcher
            locale={locale}
            label={dict.languageLabel}
            className={styles.lang}
            itemClassName={styles.langLink}
            currentClassName={styles.langCurrent}
            separatorClassName={styles.langSep}
          />

          <ThemeToggle
            toDark={dict.theme.toDark}
            toLight={dict.theme.toLight}
            className={styles.theme}
          />

          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="nav-panel"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? dict.close : dict.menu}
          </button>

          <Link href={inquiryHref} prefetch={true} className={styles.cta}>
            {dict.nav.inquiry}
          </Link>
        </div>
      </div>

      {/* Small screens: the menu as a full-height curtain under the header. */}
      <div
        ref={panelRef}
        id="nav-panel"
        className={open ? `${styles.panel} ${styles.panelOpen}` : styles.panel}
        aria-hidden={!open}
      >
        <nav className={styles.panelLinks} aria-label={dict.menu}>
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href) || (isEventPage(link.href) && pathname.includes('/events'))
                  ? styles.panelLinkActive
                  : undefined
              }
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }}
              onClick={() => setOpen(false)}
            >
              {'live' in link && link.live ? <span className={styles.livePoint} aria-hidden="true" /> : null}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.panelFoot}>
          <LanguageSwitcher
            locale={locale}
            label={dict.languageLabel}
            className={styles.lang}
            itemClassName={styles.langLink}
            currentClassName={styles.langCurrent}
            separatorClassName={styles.langSep}
            onNavigate={() => setOpen(false)}
          />
          <ThemeToggle
            toDark={dict.theme.toDark}
            toLight={dict.theme.toLight}
            className={styles.theme}
          />
          <Link href={inquiryHref} prefetch={true} className={styles.cta} onClick={() => setOpen(false)}>
            {dict.nav.inquiry}
          </Link>
        </div>
      </div>

      <div className={styles.progress} data-role="progress" />
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
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

  const links = [
    { label: dict.nav.products, href: `${prefix}/product` },
    { label: dict.nav.journeys, href: `${prefix}/journey` },
    { label: dict.nav.about, href: `${prefix}/about` },
  ]
  const inquiryHref = `${prefix}/inquiry`

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className={styles.nav} data-role="nav" data-tone={tone}>
      <div className={styles.inner}>
        <Link href={prefix || '/'} className={styles.logoLink}>
          <Image
            src="/logo-atibhagya-gold.png"
            alt="Atibhagya"
            width={106}
            height={26}
            className={styles.logo}
            priority
          />
        </Link>

        <div className={styles.links}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
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

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="nav-panel"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? dict.close : dict.menu}
          </button>

          <Link href={inquiryHref} className={styles.cta}>
            {dict.nav.inquiry}
          </Link>
        </div>
      </div>

      <div id="nav-panel" className={open ? `${styles.panel} ${styles.panelOpen}` : styles.panel}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
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
          onNavigate={() => setOpen(false)}
        />
        <Link href={inquiryHref} className={styles.cta} onClick={() => setOpen(false)}>
          {dict.nav.inquiry}
        </Link>
      </div>

      <div className={styles.progress} data-role="progress" />
    </div>
  )
}

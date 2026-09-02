'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

import { rememberScroll } from '@/components/site/RestoreScroll'
import { locales, type Locale } from '@/lib/content/types'

type Props = {
  locale: Locale
  label: string
  className: string
  itemClassName: string
  currentClassName: string
  separatorClassName: string
  onNavigate?: () => void
}

/**
 * EN · ID, pointing at the same page in the other language.
 *
 * The URL strategy is `/` for English and `/id/…` for Indonesian, so the
 * counterpart is the current path with that prefix added or removed — the
 * guest keeps their place instead of being dropped back on the homepage.
 */
export function LanguageSwitcher({
  locale,
  label,
  className,
  itemClassName,
  currentClassName,
  separatorClassName,
  onNavigate,
}: Props) {
  const pathname = usePathname() || '/'
  const isIndonesian = pathname === '/id' || pathname.startsWith('/id/')
  const bare = isIndonesian ? pathname.slice(3) || '/' : pathname

  const hrefFor = (target: Locale) =>
    target === 'id' ? `/id${bare === '/' ? '' : bare}` : bare

  return (
    <nav className={className} aria-label={label}>
      {locales.map((code, index) => (
        <Fragment key={code}>
          {index > 0 ? (
            <span className={separatorClassName} aria-hidden="true">
              ·
            </span>
          ) : null}
          <Link
            href={hrefFor(code)}
            hrefLang={code}
            aria-current={code === locale ? 'true' : undefined}
            className={code === locale ? `${itemClassName} ${currentClassName}` : itemClassName}
            onClick={() => {
              // A different root segment means a full page load; keep the
              // reader's place through it.
              if (code !== locale) rememberScroll()
              onNavigate?.()
            }}
          >
            {code.toUpperCase()}
          </Link>
        </Fragment>
      ))}
    </nav>
  )
}

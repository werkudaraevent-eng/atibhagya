import Link from 'next/link'

import { serverURL } from '@/lib/server-url'
import styles from './Breadcrumb.module.css'

export type Crumb = { label: string; href?: string }

type Props = {
  trail: Crumb[]
  /** Accessible name for the landmark, e.g. "You are here". */
  label: string
  className?: string
}

/**
 * The small line above a detail page's title, as a path back out.
 *
 * It sits where the eyebrow sat and keeps the eyebrow's voice — small caps,
 * gold — so nothing new arrives on the page; the label the reader was already
 * looking at simply becomes a way home.
 *
 * The last crumb is the page itself. It stays in the markup for assistive
 * technology and for the structured data, but is not drawn: the title
 * directly beneath already says where you are, and repeating it in capitals
 * only pushed the line onto two rows.
 *
 * Also emits BreadcrumbList structured data, which is what lets a search
 * result show "Atibhagya › Product › Rituals & Ceremony" under the title.
 */
export function Breadcrumb({ trail, label, className }: Props) {
  const base = serverURL
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${base}${crumb.href}` } : {}),
    })),
  }

  return (
    <nav className={[styles.nav, className].filter(Boolean).join(' ')} aria-label={label}>
      <ol className={styles.list}>
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1
          return (
            <li
              key={`${crumb.label}-${i}`}
              className={last ? 'visuallyHidden' : styles.item}
            >
              {crumb.href && !last ? (
                <Link href={crumb.href} className={styles.link}>
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
              )}
              {i < trail.length - 2 ? <span className={styles.sep} aria-hidden="true" /> : null}
            </li>
          )
        })}
      </ol>
      <script
        type="application/ld+json"
        // A title containing "</script>" would otherwise close the tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </nav>
  )
}

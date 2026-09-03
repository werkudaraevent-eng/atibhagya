'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from '@/app/(site)/not-found.module.css'

/**
 * The 404 in the reader's language. A not-found page gets no route params,
 * so the language is read from the address that failed: `/id/…` is
 * Indonesian, anything else English.
 */
const COPY = {
  en: {
    headline: 'This path leads nowhere on the estate.',
    back: 'Return to the estate',
    home: '/',
  },
  id: {
    headline: 'Jalan ini tidak menuju ke mana pun.',
    back: 'Kembali ke beranda',
    home: '/id',
  },
} as const

export function NotFoundBody() {
  const pathname = usePathname() ?? '/'
  const t = pathname === '/id' || pathname.startsWith('/id/') ? COPY.id : COPY.en

  return (
    <main className={styles.page} id="main">
      <div className={styles.eyebrow}>Atibhagya</div>
      <h1 className={styles.headline}>{t.headline}</h1>
      <div className={styles.rule} />
      <Link className={styles.link} href={t.home}>
        {t.back}
      </Link>
    </main>
  )
}

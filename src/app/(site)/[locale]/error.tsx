'use client'

import { useEffect } from 'react'

import styles from '@/app/(site)/not-found.module.css'
import type { Locale } from '@/lib/content/types'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

const COPY: Record<Locale, { headline: string; body: string; retry: string }> = {
  en: {
    headline: 'Something on our side did not answer.',
    body: 'Nothing you did caused it. Try once more; if it keeps happening, write to us directly.',
    retry: 'Try again',
  },
  id: {
    headline: 'Ada yang tidak menjawab di sisi kami.',
    body: 'Bukan karena Anda. Coba sekali lagi; jika terus terjadi, tulis langsung kepada kami.',
    retry: 'Coba lagi',
  },
}

/**
 * When a page throws — the database unreachable on an uncached route, a
 * bug — the reader gets this instead of Next's default panel, in the site's
 * own dress and language. `reset` re-renders the segment.
 */
export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error('[atibhagya] Page error:', error)
  }, [error])

  const locale: Locale =
    typeof window !== 'undefined' && /^\/id(\/|$)/.test(window.location.pathname) ? 'id' : 'en'
  const t = COPY[locale]

  return (
    <main className={styles.page} id="main">
      <div className={styles.eyebrow}>Atibhagya</div>
      <h1 className={styles.headline}>{t.headline}</h1>
      <p className={styles.body}>{t.body}</p>
      <div className={styles.rule} />
      <button type="button" className={styles.button} onClick={reset}>
        {t.retry}
      </button>
    </main>
  )
}

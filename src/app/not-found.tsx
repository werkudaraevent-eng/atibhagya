import Link from 'next/link'

import { karla, marcellus } from '@/lib/fonts'
import styles from './not-found.module.css'
import './globals.css'

export const metadata = {
  title: 'Not found · Atibhagya',
}

/**
 * The app has one root layout per locale, so the global 404 carries its own
 * document. It also keeps Next from falling through to its built-in page for
 * paths that do not match a locale.
 */
export default function NotFound() {
  return (
    <html lang="en" className={`${marcellus.variable} ${karla.variable}`}>
      <body>
        <main className={styles.page}>
          <div className={styles.eyebrow}>Atibhagya</div>
          <h1 className={styles.headline}>This path leads nowhere on the estate.</h1>
          <div className={styles.rule} />
          <Link className={styles.link} href="/">
            Return to the estate
          </Link>
        </main>
      </body>
    </html>
  )
}

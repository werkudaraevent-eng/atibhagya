import Link from 'next/link'

import styles from './not-found.module.css'

export const metadata = {
  title: 'Not found · Atibhagya',
}

/** The site-wide 404, inside the site's own document. */
export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.eyebrow}>Atibhagya</div>
      <h1 className={styles.headline}>This path leads nowhere on the estate.</h1>
      <div className={styles.rule} />
      <Link className={styles.link} href="/">
        Return to the estate
      </Link>
    </main>
  )
}

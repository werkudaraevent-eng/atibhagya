import { Motion } from '@/components/Motion'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getSite } from '@/lib/content'
import { getPrivacy } from '@/lib/content/privacy'
import { fillPrivacyTokens } from '@/lib/content/privacy-defaults'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'

import styles from './privacy.module.css'

type Props = {
  locale: Locale
  /** Read the page as it is being edited rather than as published. */
  draft?: boolean
}

const LANG: Record<Locale, string> = { en: 'en-GB', id: 'id-ID' }

/**
 * The privacy policy. No motion and no ornaments in the policy itself: it is
 * read, sometimes carefully, and nothing should stand between the reader and
 * the text. <Motion /> is still mounted because the shared footer starts
 * hidden (data-fade, data-headline) until it reveals it; without it the
 * footer stayed blank on this page.
 */
export async function PrivacyScreen({ locale, draft = false }: Props) {
  const [privacy, site] = await Promise.all([
    getPrivacy(locale, { draft }),
    getSite(locale, { draft }),
  ])
  const t = withSite(dict(locale), site)
  const fill = (text: string) =>
    fillPrivacyTokens(text, { email: site.email, months: privacy.retentionMonths })
  const updated = new Date(`${privacy.updated}T12:00:00`).toLocaleDateString(LANG[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      <main id="main">
        <header className={page.pageHead}>
          <div className={styles.column}>
            <div className={page.eyebrow}>{privacy.eyebrow}</div>
            <h1 className={page.headline}>{privacy.headline}</h1>
            <p className={styles.lede}>{privacy.lede}</p>
            <p className={styles.updated}>
              {t.privacy.updated} <time dateTime={privacy.updated}>{updated}</time>
            </p>
          </div>
        </header>

        <div className={page.section} style={{ paddingTop: 0 }}>
          <div className={styles.column}>
            {privacy.sections.map((section) => (
              <section key={section.heading} className={styles.section}>
                <h2 className={styles.heading}>{section.heading}</h2>
                <p className={styles.body}>{fill(section.body)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

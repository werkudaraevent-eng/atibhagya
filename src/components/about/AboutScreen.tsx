import Link from 'next/link'

import styles from '@/app/(site)/[locale]/about/about.module.css'
import { CreditImage } from '@/components/CreditImage'
import { Motion } from '@/components/Motion'
import { Footer } from '@/components/site/Footer'
import { PageMarks } from '@/components/site/PageMarks'
import { Divider } from '@/components/site/Ornament'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getAbout, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict, withSite } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'

type Props = {
  locale: Locale
  /** Read the page as it is being edited rather than as published. */
  draft?: boolean
}

/**
 * The about page in full. Shared by the public route and the admin's draft
 * preview, which differ only in what they read.
 */
export async function AboutScreen({ locale, draft = false }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  const [about, site] = await Promise.all([
    getAbout(locale, { draft }),
    getSite(locale, { draft }),
  ])
  const t = withSite(dict(locale), site)

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      <PageMarks
        stages={[
          { id: 'top', label: about.eyebrow },
          { id: 'story', label: t.nav.about },
          { id: 'foot', label: t.footer.enquiries },
        ]}
        label={t.yourPath}
      />

      {/* A centred column, but one left edge inside it. */}
      <main id="main">
        <header id="top" className={page.pageHead} data-stage={about.eyebrow} data-chapter="01">
          <div className={styles.centred}>
            <div className={page.eyebrow}>{about.eyebrow}</div>
            <h1 className={page.headline} data-headline>
              <Lines text={about.headline} />
            </h1>
            <p className={styles.lede}>{about.lede}</p>
            <Divider mark="wave" />
          </div>
        </header>

        <section
          id="story"
          className={page.section}
          style={{ paddingTop: 0 }}
          data-stage={t.nav.about}
          data-chapter="02"
        >
          <div className={styles.centred}>
            {about.body.map((paragraph, i) => (
              <p key={i} className={styles.paragraph} data-fade>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.image} data-clip>
            <div className={styles.para} data-para>
              <CreditImage image={about.image} sizes="(max-width: 1160px) 100vw, 1160px" />
            </div>
          </div>

          <Divider mark="sprout" />
          <p className={styles.statement} data-fade>
            {about.statement}
          </p>

          <div className={styles.values}>
            {about.values.map((value) => (
              <div key={value.title} className={styles.value} data-fade>
                <div className={styles.valueTitle}>{value.title}</div>
                <div className={styles.valueCaption}>{value.caption}</div>
              </div>
            ))}
          </div>

          <div className={styles.cta} data-fade>
            <h2 className={page.headlineSmall}>{about.ctaHeadline}</h2>
            <Link href={`${prefix}/inquiry`} prefetch={true} className={page.buttonPrimary}>
              {about.ctaLabel}
            </Link>
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

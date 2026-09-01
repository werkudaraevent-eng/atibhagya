import type { Metadata } from 'next'
import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import { Motion } from '@/components/Motion'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getAbout, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './about.module.css'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const about = await getAbout(locale as Locale)

  return {
    title: about.meta.title,
    description: about.meta.description,
    alternates: {
      canonical: locale === 'id' ? '/id/about' : '/about',
      languages: { en: '/about', id: '/id/about' },
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = raw as Locale
  const t = dict(locale)
  const prefix = locale === 'id' ? '/id' : ''

  const [about, site] = await Promise.all([getAbout(locale), getSite(locale)])

  return (
    <>
      <Motion />
      <Nav locale={locale} dict={t} tone="light" />

      {/* A centred column, but one left edge inside it. */}
      <main>
        <header className={page.pageHead}>
          <div className={styles.centred}>
            <div className={page.eyebrow}>{about.eyebrow}</div>
            <h1 className={page.headline} data-headline>
              <Lines text={about.headline} />
            </h1>
            <p className={styles.lede}>{about.lede}</p>
          </div>
        </header>

        <section className={page.section} style={{ paddingTop: 0 }}>
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
            <Link href={`${prefix}/inquiry`} className={page.buttonPrimary}>
              {about.ctaLabel}
            </Link>
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

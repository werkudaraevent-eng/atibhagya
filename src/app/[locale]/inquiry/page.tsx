import type { Metadata } from 'next'

import { InquiryForm } from '@/components/inquiry/InquiryForm'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getInquiryCopy, getJourneys, getProducts, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = dict(locale as Locale)

  return {
    title: t.inquiry.metaTitle,
    description: t.inquiry.metaDescription,
    alternates: {
      canonical: locale === 'id' ? '/id/inquiry' : '/inquiry',
      languages: { en: '/inquiry', id: '/id/inquiry' },
    },
    robots: { index: false, follow: true },
  }
}

const asArray = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

export default async function InquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ product?: string | string[]; journey?: string | string[] }>
}) {
  const { locale: raw } = await params
  const { product, journey } = await searchParams
  const locale = raw as Locale
  const t = dict(locale)

  const [products, journeys, site, copy] = await Promise.all([
    getProducts(locale),
    getJourneys(locale),
    getSite(locale),
    getInquiryCopy(locale),
  ])

  // The form's wording is editable in the CMS; everything else stays in code.
  const t2 = { ...t, inquiry: copy }

  return (
    <>
      <Nav locale={locale} dict={t} tone="light" />

      <main>
        <header className={page.pageHead}>
          <div className={page.narrow}>
            <div className={page.eyebrow}>{copy.eyebrow}</div>
            <h1 className={page.headline}>{copy.headline}</h1>
            <p className={page.lede}>{copy.lede}</p>
          </div>
        </header>

        <section className={page.section} style={{ paddingTop: 0 }}>
          <div className={page.narrow}>
            <InquiryForm
              locale={locale}
              dict={t2}
              site={site}
              products={products.map((p) => ({ slug: p.slug, title: p.title }))}
              journeys={journeys.map((j) => ({ slug: j.slug, title: j.title }))}
              initialProducts={asArray(product)}
              initialJourneys={asArray(journey)}
            />
          </div>
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

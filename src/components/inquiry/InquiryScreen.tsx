import { InquiryForm } from '@/components/inquiry/InquiryForm'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import page from '@/components/site/Page.module.css'
import { getCategories, getInquiryCopy, getJourneys, getProducts, getSite } from '@/lib/content'
import type { Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'

type Props = {
  locale: Locale
  initialProducts?: string[]
  initialJourneys?: string[]
  /** Read the form as it is being edited rather than as published. */
  draft?: boolean
}

/**
 * The inquiry page in full — heading, form, footer. Shared by the public
 * route and the admin's draft preview, which differ only in what they read.
 */
export async function InquiryScreen({
  locale,
  initialProducts = [],
  initialJourneys = [],
  draft = false,
}: Props) {
  const t = dict(locale)

  const [products, journeys, categories, site, copy] = await Promise.all([
    getProducts(locale),
    getJourneys(locale),
    getCategories(locale),
    getSite(locale, { draft }),
    getInquiryCopy(locale, { draft }),
  ])

  return (
    <>
      <Nav locale={locale} dict={t} tone="light" />

      <main>
        <section className={page.section} style={{ paddingTop: 0 }}>
          <InquiryForm
            locale={locale}
            dict={{ ...t, inquiry: copy }}
            site={site}
            choices={{
              products: products.map((p) => ({ slug: p.slug, title: p.title })),
              journeys: journeys.map((j) => ({ slug: j.slug, title: j.title })),
              categories: categories.map((c) => ({ slug: c.slug, title: c.name })),
            }}
            initialProducts={initialProducts}
            initialJourneys={initialJourneys}
            // The invitation is handed to the form so it leaves with it once
            // the inquiry has been sent; the thank-you then takes its place.
            heading={
              <header className={page.pageHead}>
                <div className={page.narrow}>
                  <div className={page.eyebrow}>{copy.eyebrow}</div>
                  <h1 className={page.headline}>{copy.headline}</h1>
                  <p className={page.lede}>{copy.lede}</p>
                </div>
              </header>
            }
            frameClassName={page.narrow}
            doneClassName={page.pageHead}
          />
        </section>
      </main>

      <Footer site={site} dict={t} locale={locale} />
    </>
  )
}

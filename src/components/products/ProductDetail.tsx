import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import page from '@/components/site/Page.module.css'
import type { Locale, Product, ProductCard } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { ProductGrid } from './ProductCard'
import styles from './ProductDetail.module.css'

type Props = {
  product: Product
  locale: Locale
  dict: Dict
  /** Same category, current one excluded — keeps browsing alive at the foot. */
  related: ProductCard[]
}

export function ProductDetail({ product, locale, dict, related }: Props) {
  const t = dict.products
  const prefix = locale === 'id' ? '/id' : ''
  // The CTA carries its context, so the inquiry arrives prefilled.
  const inquiryHref = `${prefix}/inquiry?product=${encodeURIComponent(product.slug)}`

  // The brochure keeps venue and programme apart, and so does the page: a
  // product can run at five venues, which would drown in a four-column row.
  const programme = [
    product.durationText ? { key: t.duration, value: product.durationText } : null,
    product.facilities.length ? { key: t.facilities, list: product.facilities } : null,
    product.suitableFor.length
      ? { key: t.suitableFor, list: product.suitableFor.map((s) => t.suitable[s] ?? s) }
      : null,
  ].filter(Boolean) as { key: string; value?: string; list?: string[] }[]

  return (
    <>
      <header className={styles.head}>
        <div className={page.container}>
          <div className={page.eyebrow}>
            {t.detailEyebrow}
            {product.category ? ` / ${product.category.name}` : ''}
          </div>
          <h1 className={styles.title} data-headline>{product.title}</h1>
          {product.subtitle ? <p className={styles.subtitle}>{product.subtitle}</p> : null}
          <p className={styles.description}>{product.description}</p>
          <div className={styles.actions}>
            <Link href={inquiryHref} className={page.buttonPrimary}>
              {t.inquire}
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.hero} data-clip>
        <div className={styles.para} data-para>
          <CreditImage image={product.heroImage} sizes="100vw" priority />
        </div>
      </div>

      <section className={page.section}>
        <div className={page.container}>
          {product.highlightText ? (
            <figure className={styles.highlight} data-fade>
              <span className={styles.highlightMark} aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className={styles.highlightText}>{product.highlightText}</blockquote>
            </figure>
          ) : null}

          {programme.length || product.venues.length ? (
            <div className={styles.programme}>
              {product.venues.length ? (
                <div data-fade>
                  <div className={styles.blockKey}>{t.venue}</div>
                  <ul className={styles.venueList}>
                    {product.venues.map((venue) => (
                      <li key={venue.id}>
                        {venue.name}
                        {venue.location ? ` · ${venue.location}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {programme.length ? (
                <div className={styles.facts} style={{ marginTop: 0 }}>
                  {programme.map((fact) => (
                    <div key={fact.key} className={styles.fact} data-fade>
                      <div className={styles.factKey}>{fact.key}</div>
                      {fact.value ? <div className={styles.factValue}>{fact.value}</div> : null}
                      {fact.list ? (
                        <ul className={styles.factList}>
                          {fact.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {product.whatToExpect ? (
            <div className={page.split} style={{ marginTop: 'clamp(56px, 9vh, 100px)' }}>
              <h2 className={page.headlineSmall} data-fade>
                {t.whatToExpect}
              </h2>
              <p className={page.body} data-fade>
                {product.whatToExpect}
              </p>
            </div>
          ) : null}

          {product.gallery.length ? (
            <div className={styles.gallery}>
              {product.gallery.map((image, i) => (
                <div key={`${image.src}-${i}`} className={styles.galleryItem} data-fade>
                  <CreditImage image={image} sizes="(max-width: 860px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          ) : null}

          {/* Only rendered when the data exists — not every experience has a
              named practitioner. */}
          {product.facilitators.length ? (
            <>
              <h2 className={page.headlineSmall} data-fade style={{ marginTop: 'clamp(56px, 9vh, 100px)' }}>
                {t.facilitator}
              </h2>
              <div className={styles.people}>
                {product.facilitators.map((person) => (
                  <div key={person.id} className={styles.person} data-fade>
                    {person.photo ? (
                      <div className={styles.personPhoto}>
                        <CreditImage image={person.photo} sizes="240px" />
                      </div>
                    ) : null}
                    <h3 className={styles.personName}>{person.name}</h3>
                    {person.role ? <div className={styles.personRole}>{person.role}</div> : null}
                    {person.bio ? <p className={styles.personBio}>{person.bio}</p> : null}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {related.length ? (
        <section className={`${page.section} ${page.sectionAlt}`}>
          <div className={page.container}>
            <h2 className={page.headlineSmall} data-fade style={{ marginBottom: 'clamp(32px, 5vh, 56px)' }}>
              {t.related}
            </h2>
            <ProductGrid products={related} locale={locale} />
          </div>
        </section>
      ) : null}
    </>
  )
}

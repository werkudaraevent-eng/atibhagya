import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import page from '@/components/site/Page.module.css'
import type { Locale, Product, ProductCard } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { ElementMark } from './ElementMark'
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
      <header className={page.opening}>
        <div className={page.openingText}>
          {/* The eyebrow, made into a way back out: listing, then category
              (filtered), then this page. */}
          <Breadcrumb
            label={dict.youAreHere}
            trail={[
              { label: t.detailEyebrow, href: `${prefix}/product` },
              ...(product.category
                ? [
                    {
                      label: product.category.name,
                      href: `${prefix}/product?category=${encodeURIComponent(product.category.slug)}`,
                    },
                  ]
                : []),
              { label: product.title },
            ]}
          />
          <h1 className={styles.title} data-headline>{product.title}</h1>
          {product.subtitle ? <p className={styles.subtitle}>{product.subtitle}</p> : null}

          {/* The element's mark, as the pause between the title block and
              the description: a short hairline drawing out from it. */}
          <div className={styles.elementDivider}>
            <span className={styles.elementLine} data-rule aria-hidden="true" />
            <ElementMark
              element={product.element}
              size="medium"
              label={`${t.element}: ${t.elements[product.element]}`}
            />
            <span className={`${styles.elementLine} ${styles.elementLineFade}`} data-rule aria-hidden="true" />
          </div>

          <p className={styles.description}>{product.description}</p>
          <div className={styles.actions}>
            <Link href={inquiryHref} className={page.buttonPrimary}>
              {t.inquire}
            </Link>
          </div>
        </div>

        <div className={page.openingMedia} data-open>
          <div className={styles.para} data-para>
            <CreditImage
              image={product.heroImage}
              sizes="(max-width: 860px) 100vw, 58vw"
              priority
            />
          </div>
        </div>
      </header>

      <section className={page.section}>
        <div className={page.container}>
          {/* Narrative on the left, facts in one slim column on the right —
              the brochure's arrangement. A single stack means a single
              construction, so every rule and label lines up by definition. */}
          <div className={styles.body}>
            <div className={styles.narrative}>
              {product.highlightText ? (
                <figure className={styles.highlight} data-fade>
                  <span className={styles.highlightMark} aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className={styles.highlightText}>{product.highlightText}</blockquote>
                </figure>
              ) : null}

              {product.whatToExpect ? (
                <div className={styles.expect} data-fade>
                  <h2 className={styles.expectTitle}>{t.whatToExpect}</h2>
                  <p className={styles.expectBody}>{product.whatToExpect}</p>
                </div>
              ) : null}
            </div>

            {programme.length || product.venues.length ? (
              <aside className={styles.facts} aria-label={t.facilities}>
                {product.venues.length ? (
                  <div className={styles.fact} data-fade>
                    <div className={styles.factKey}>{t.venue}</div>
                    <ul className={styles.factList}>
                      {product.venues.map((venue) => (
                        <li key={venue.id}>
                          {venue.name}
                          {venue.location ? ` · ${venue.location}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

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
              </aside>
            ) : null}
          </div>

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

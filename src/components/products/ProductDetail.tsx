import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import page from '@/components/site/Page.module.css'
import type { Stage } from '@/components/site/PathIndicator'
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

/**
 * The page's stops for PageMarks. Built here, rendered by the route —
 * PageMarks holds `position: fixed` overlays, and inside `<main>` (which
 * the entrance animation transforms) fixed means "fixed to main", pinned
 * to the content instead of the screen.
 */
export function productStages(dict: Dict, hasRelated: boolean): Stage[] {
  const t = dict.products
  return [
    { id: 'top', label: t.detailEyebrow },
    { id: 'experience', label: t.experience },
    ...(hasRelated ? [{ id: 'related', label: t.related }] : []),
    { id: 'foot', label: dict.footer.enquiries },
  ]
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
      {/* Hero Header: Full-width hero image with Breadcrumb, Title, Subtitle, and Element Mark inside */}
      <header id="top" className={styles.heroHeader} data-stage={t.detailEyebrow} data-chapter="01">
        <div className={styles.heroMedia} data-open>
          <div className={styles.para} data-para>
            <CreditImage
              image={product.heroImage}
              sizes="100vw"
              priority
            />
          </div>
          <div className={styles.heroOverlay} />

          {/* Centered content inside hero photo */}
          <div className={styles.heroContent} data-heroword>
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
              className={styles.heroBreadcrumb}
            />

            <h1 className={styles.heroTitle} data-headline>{product.title}</h1>
            {product.subtitle ? <p className={styles.heroSubtitle}>{product.subtitle}</p> : null}

            {/* Symmetrical element mark divider */}
            <div className={styles.elementDivider}>
              <span className={`${styles.elementLine} ${styles.elementLineLeft}`} data-rule aria-hidden="true" />
              <ElementMark
                element={product.element}
                size="medium"
                className={styles.elementMarkHero}
                label={`${t.element}: ${t.elements[product.element]}`}
              />
              <span className={`${styles.elementLine} ${styles.elementLineRight}`} data-rule aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Description and Inquire action below hero */}
        <div className={styles.intro}>
          <div className={styles.introInner}>
            <p className={styles.description} data-fade>{product.description}</p>
            <div className={styles.actions} data-fade>
              <Link href={inquiryHref} prefetch={true} className={page.buttonPrimary}>
                {t.inquire}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section id="experience" className={page.section} data-stage={t.experience} data-chapter="02">
        <div className={page.container}>
          {/* Narrative: Highlight quote on top, then What to expect below it */}
          <div className={styles.narrative}>
            {product.highlightText ? (
              <figure className={styles.highlight} data-fade>
                <span className={styles.highlightLine} data-rule aria-hidden="true" />
                <blockquote className={styles.highlightText}>{product.highlightText}</blockquote>
                <span className={styles.highlightLine} data-rule aria-hidden="true" />
              </figure>
            ) : null}

            {product.whatToExpect ? (
              <div className={styles.expect} data-fade>
                <h2 className={styles.expectTitle}>{t.whatToExpect}</h2>
                <p className={styles.expectBody}>{product.whatToExpect}</p>
              </div>
            ) : null}
          </div>

          {/* Facts arranged horizontally side-by-side (berjajar) at the bottom */}
          {programme.length || product.venues.length ? (
            <aside className={styles.factsRow} aria-label={t.facilities}>
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
        <section
          id="related"
          className={`${page.section} ${page.sectionAlt}`}
          data-stage={t.related}
          data-chapter="03"
        >
          <div className={page.wideContainer}>
            <h2 className={page.headlineSmall} data-fade style={{ marginBottom: 'clamp(32px, 5vh, 56px)', textAlign: 'center' }}>
              {t.related}
            </h2>
            <ProductGrid products={related} locale={locale} />
          </div>
        </section>
      ) : null}
    </>
  )
}

import Image from 'next/image'
import Link from 'next/link'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Ornament } from '@/components/site/Ornament'
import type { Locale, SiteContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './Footer.module.css'

type Props = {
  site: SiteContent
  dict: Dict
  locale: Locale
}

/**
 * The site's last word, not its site map.
 *
 * A luxury page closes the way it opened: with a sentence and a great deal
 * of room. The closing line is set large in the serif and rises in a line
 * at a time as it enters; the wordmark sits under it as a signature. What
 * is left of navigation is two small columns to the right, and social links
 * as one quiet line. The foot names the group and the place.
 */
export function Footer({ site, dict, locale }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  return (
    // The last stop on every page's path, and a dark surface for the marks.
    <footer id="foot" className={styles.footer} data-stage={dict.footer.enquiries} data-dark>
      <div className={styles.inner}>
        <Ornament mark="wave" className={styles.rule} />

        <div className={styles.upper}>
          <div className={styles.word}>
            <p className={styles.closing} data-headline>
              <Lines text={site.footerTagline} />
            </p>
            <Image
              src="/logo-atibhagya-gold.png"
              alt="Atibhagya"
              width={154}
              height={38}
              className={styles.logo}
              data-fade
            />
          </div>

          <div className={styles.columns}>
            <nav className={styles.column} aria-label={dict.footer.explore} data-fade>
              <span className={styles.label}>{dict.footer.explore}</span>
              <Link className={styles.link} href={`${prefix}/product`}>
                {dict.nav.products}
              </Link>
              <Link className={styles.link} href={`${prefix}/journey`}>
                {dict.nav.journeys}
              </Link>
              <Link className={styles.link} href={`${prefix}/about`}>
                {dict.nav.about}
              </Link>
              <Link className={styles.link} href={`${prefix}/inquiry`}>
                {dict.nav.inquiry}
              </Link>
            </nav>

            <div className={styles.column} data-fade>
              <span className={styles.label}>{dict.footer.enquiries}</span>
              <a className={styles.link} href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a
                className={styles.link}
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.whatsappLabel}
              </a>
              {site.social.length ? (
                <span className={styles.social}>
                  {site.social.map((item, i) => (
                    <span key={item.href}>
                      {i > 0 ? <span className={styles.dot}> · </span> : null}
                      <a
                        className={styles.link}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    </span>
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.foot} data-fade>
          <span className={styles.legal}>
            {site.footerLegal}
            {site.parentBrand ? <span className={styles.group}> · {site.parentBrand}</span> : null}
          </span>
          <span className={styles.place}>
            {site.address ? <span>{site.address}</span> : null}
            <LanguageSwitcher
              locale={locale}
              label={dict.languageLabel}
              className={styles.lang}
              itemClassName={styles.langLink}
              currentClassName={styles.langCurrent}
              separatorClassName={styles.langSep}
            />
          </span>
        </div>
      </div>
    </footer>
  )
}

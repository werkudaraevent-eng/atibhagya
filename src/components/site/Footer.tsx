import Image from 'next/image'
import Link from 'next/link'

import type { Locale, SiteContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './Footer.module.css'

type Props = {
  site: SiteContent
  dict: Dict
  locale: Locale
}

export function Footer({ site, dict, locale }: Props) {
  const prefix = locale === 'id' ? '/id' : ''

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <div className={styles.label}>{dict.footer.enquiries}</div>
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
          </div>

          <div className={styles.column}>
            <div className={styles.label}>{dict.footer.explore}</div>
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
          </div>

          <div className={styles.column}>
            <div className={styles.label}>{dict.footer.social}</div>
            {site.social.map((item) => (
              <a
                key={item.href}
                className={styles.link}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className={styles.brand}>
            <Image
              src="/logo-atibhagya-gold.png"
              alt="Atibhagya"
              width={154}
              height={38}
              className={styles.logo}
            />
            <p className={styles.tagline}>
              <Lines text={site.footerTagline} />
            </p>
          </div>
        </div>

        <div className={styles.legal}>
          <span>{site.footerLegal}</span>
          {site.address ? <span>{site.address}</span> : null}
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'

import { CreditImage } from '@/components/CreditImage'
import page from '@/components/site/Page.module.css'
import type { EventContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { Lines } from '@/lib/text'
import styles from './EventClosing.module.css'

type Props = {
  closing: EventContent['closing']
  id: string
  stage: string
  inquiryHref: string
  dict: Dict
}

/**
 * The invitation: a full-bleed photograph under a dark scrim, the words at
 * its foot, and — when the team has given one — the festival's contact.
 */
export function EventClosing({ closing, id, stage, inquiryHref, dict }: Props) {
  const hasContact = closing.contactName || closing.contactLine || closing.collaborationLine

  return (
    <section id={id} className={styles.section} data-stage={stage} data-dark>
      <div className={styles.para} data-para>
        <CreditImage image={closing.image} sizes="100vw" />
      </div>
      <div className={styles.scrim} />

      <div className={styles.content}>
        <div>
          {closing.eyebrow ? (
            <div className={styles.eyebrow} data-fade>
              {closing.eyebrow}
            </div>
          ) : null}
          {closing.headline ? (
            <h2 className={styles.headline} data-fade>
              <Lines text={closing.headline} />
            </h2>
          ) : null}
          {closing.body ? (
            <p className={styles.body} data-fade>
              <Lines text={closing.body} />
            </p>
          ) : null}
          <div className={styles.actions} data-fade>
            <Link href={inquiryHref} className={page.buttonGhost}>
              {closing.ctaLabel ?? dict.inquiry.eyebrow}
            </Link>
          </div>
        </div>

        {hasContact ? (
          <div className={styles.contact} data-fade>
            <div className={styles.contactLabel}>{dict.events.contact}</div>
            {closing.contactName ? <div className={styles.contactName}>{closing.contactName}</div> : null}
            {closing.contactLine ? <div className={styles.contactLine}>{closing.contactLine}</div> : null}
            {closing.collaborationLine ? (
              <div className={styles.collab}>
                <Lines text={closing.collaborationLine} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

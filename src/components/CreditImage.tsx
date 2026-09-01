import Image from 'next/image'

import type { Img } from '@/lib/content/types'
import styles from './CreditImage.module.css'

type Props = {
  image: Img
  sizes: string
  priority?: boolean
  className?: string
  /**
   * Set when the image itself sits inside a link — an anchor cannot contain
   * another anchor, so the credit falls back to plain text.
   */
  insideLink?: boolean
  /**
   * Suppresses the overlay chip so the caller can set the credit as a caption
   * instead. Repeated badges across a listing read as stock photography; a
   * hairline caption attributes the same work without the clutter.
   */
  hideCredit?: boolean
}

/**
 * A cover-filling image with the licence chip the prototype's `<image-slot>`
 * renders. The chip disappears on its own once the client's own photography
 * (which carries no credit) replaces the Creative Commons placeholders.
 */
export function CreditImage({
  image,
  sizes,
  priority,
  className,
  insideLink,
  hideCredit,
}: Props) {
  // No photograph yet. A tinted panel is more honest than showing some other
  // product's picture, and it reads as deliberate rather than broken.
  if (!image.src) {
    return (
      <div
        className={className ? `${styles.wrap} ${styles.empty} ${className}` : `${styles.wrap} ${styles.empty}`}
        role="img"
        aria-label={image.alt}
      >
        <span className={styles.emptyMark} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={className ? `${styles.wrap} ${className}` : styles.wrap}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={styles.img}
      />
      {image.credit && !hideCredit ? (
        <span className={styles.credit}>
          {image.creditUrl && !insideLink ? (
            <a href={image.creditUrl} target="_blank" rel="noopener noreferrer">
              {image.credit}
            </a>
          ) : (
            image.credit
          )}
        </span>
      ) : null}
    </div>
  )
}

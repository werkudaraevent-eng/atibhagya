'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './Hero.module.css'

type Props = {
  src: string
  poster?: string
}

/**
 * The hero's moving picture, loaded only where it earns its weight.
 *
 * A hero video is the single heaviest thing on the site. So it is left out
 * entirely — not merely paused — on phones, on connections that ask for
 * less data, and for anyone who prefers reduced motion; they get the still
 * photograph, which the video also uses as its poster. Where it does play,
 * it fades in once the first frames are ready rather than popping over the
 * image.
 */
export function HeroVideo({ src, poster }: Props) {
  const [wanted, setWanted] = useState(false)
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 820px)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const thrifty =
      (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
        .connection?.saveData === true ||
      /(^|[^\d])2g$/.test(
        (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
          ?.effectiveType ?? '',
      )
    setWanted(wide && !calm && !thrifty)
  }, [])

  useEffect(() => {
    if (!wanted) return
    const el = ref.current
    if (!el) return
    // Some browsers ignore autoplay until asked explicitly after mount.
    el.play().catch(() => {})
  }, [wanted])

  if (!wanted) return null

  return (
    <video
      ref={ref}
      className={ready ? `${styles.video} ${styles.videoReady}` : styles.video}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      onCanPlay={() => setReady(true)}
      aria-hidden="true"
    />
  )
}

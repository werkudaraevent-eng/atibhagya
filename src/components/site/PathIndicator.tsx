import styles from './PathIndicator.module.css'

export type Stage = { id: string; label: string }

/** Knots sit this far apart along the thread; the thread overhangs by PAD. */
const STEP = 18
const PAD = 8

/** The spiral knot, from the design handoff (24-unit grid). */
const SPIRAL =
  'M17.5 8.5c0-3-2.4-5-5.3-5C8.6 3.5 6 6.4 6 10.2c0 4.6 3.3 8.3 7.5 8.3 2.5 0 4.1-1.5 4.1-3.4 0-1.6-1.2-2.7-2.6-2.7-1.3 0-2.2.9-2.2 2'

/** A gentle wave through every knot: one bend per gap, alternating sides. */
const thread = (knots: number) => {
  let d = `M12 ${PAD}`
  for (let i = 0; i < knots - 1; i++) {
    const y0 = PAD + i * STEP
    const out = i % 2 === 0 ? 15 : 9
    const back = i % 2 === 0 ? 9 : 15
    d += ` C${out} ${y0 + 6}, ${back} ${y0 + 12}, 12 ${y0 + STEP}`
  }
  return d
}

type Props = {
  /** The page's stages, top to bottom. Each id is a section on the page. */
  stages: Stage[]
  /** Accessible name of the landmark. */
  label: string
}

/**
 * The path indicator: where the reader is on the page, as a thread.
 *
 * A thin thread waves down the bottom-right corner with a spiral knot for
 * each stage. As the page is read the thread fills, each knot draws itself
 * in as the thread reaches it, and the current knot breathes with its label
 * beside it. Below the thread a small wave begins to flow at the last
 * stage. The motion system (Motion.tsx) drives the states; this is only the
 * markup. Hidden until the header turns solid, and on small screens.
 */
export function PathIndicator(_props: Props) {
  return null
}

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
export function PathIndicator({ stages, label }: Props) {
  if (stages.length < 2) return null
  const height = PAD * 2 + STEP * (stages.length - 1)
  const d = thread(stages.length)

  return (
    <nav className={styles.path} data-role="path" aria-label={label}>
      <div className={styles.track} style={{ height }}>
        <svg
          className={styles.svg}
          width="24"
          height={height}
          viewBox={`0 0 24 ${height}`}
          fill="none"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d={d} className={styles.threadBg} />
          <path d={d} pathLength={100} className={styles.thread} data-role="thread" />
        </svg>

        {stages.map((stage, i) => (
          <a
            key={stage.id}
            href={`#${stage.id}`}
            className={styles.knot}
            data-knot={stage.id}
            data-state={i === 0 ? 'active' : 'idle'}
            style={{ top: PAD + i * STEP }}
          >
            <span className={styles.label}>{stage.label}</span>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d={SPIRAL} pathLength={100} className={styles.curl} data-role="curl" />
            </svg>
          </a>
        ))}
      </div>

      <span className={styles.wave} aria-hidden="true">
        <svg
          className={styles.waveGlyph}
          width="28"
          height="9"
          viewBox="0 0 28 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        >
          <path d="M0 2c2-2 5 2 7 0s5-2 7 0 5 2 7 0 5-2 7 0" />
          <path d="M0 5c2-2 5 2 7 0s5-2 7 0 5 2 7 0 5-2 7 0" />
          <path d="M0 8c2-2 5 2 7 0s5-2 7 0 5 2 7 0 5-2 7 0" />
        </svg>
      </span>
    </nav>
  )
}

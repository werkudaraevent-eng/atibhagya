import styles from './Ornament.module.css'

/**
 * The three marks, all drawn from the wordmark.
 *
 *   wave    the water under the A of Atibhāgya
 *   macron  the bar over the ā, with its dot — a breath held
 *   sprout  the one mark that is not in the logo: growth, used sparingly
 *
 * Single-stroke, one weight, gold. Each path carries `data-draw`, so the
 * motion system draws it in once as it enters the screen, then leaves it
 * still. Nothing here loops or floats: stillness is the point.
 */
export type Mark = 'wave' | 'macron' | 'sprout'

const PATHS: Record<Mark, { viewBox: string; d: string[] }> = {
  wave: {
    viewBox: '0 0 34 16',
    d: ['M1 9c3-5 6-5 9 0s6 5 9 0 6-5 9 0 3.5 3 5 2'],
  },
  macron: {
    viewBox: '0 0 34 16',
    d: ['M6 11h22', 'M17 4.2a0.4 0.4 0 1 0 0.01 0'],
  },
  sprout: {
    viewBox: '0 0 24 28',
    d: [
      'M12 27V11',
      'M12 16c0-4.4 3.2-7 7.6-7-0.6 4.4-3.4 7-7.6 7z',
      'M12 12c0-4.4-3.2-7-7.6-7 0.6 4.4 3.4 7 7.6 7z',
    ],
  },
}

type OrnamentProps = {
  mark: Mark
  className?: string
}

export function Ornament({ mark, className }: OrnamentProps) {
  const { viewBox, d } = PATHS[mark]
  return (
    <svg
      className={[styles.mark, styles[mark], className].filter(Boolean).join(' ')}
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
    >
      {d.map((path, i) => (
        <path key={i} d={path} data-draw />
      ))}
    </svg>
  )
}

/**
 * A rule with a mark at its centre — the pause between a heading and what
 * follows it. The two hairlines draw in from their ends, the mark last.
 */
export function Divider({ mark = 'wave', className }: { mark?: Mark; className?: string }) {
  return (
    <div className={[styles.divider, className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className={styles.line} data-rule />
      <Ornament mark={mark} />
      <span className={`${styles.line} ${styles.lineEnd}`} data-rule />
    </div>
  )
}

/**
 * A section's opening: its number, a mark, and its label — in place of a
 * bare eyebrow. The number is set in the serif, gold, large: the same voice
 * as the N° that travels the catalogue's margin.
 */
export function SectionMark({
  label,
  align = 'center',
}: {
  number?: string
  mark?: Mark
  label: string
  align?: 'center' | 'start'
}) {
  return (
    <div className={align === 'start' ? `${styles.section} ${styles.sectionStart}` : styles.section}>
      <div className={styles.label} data-fade>
        {label}
      </div>
    </div>
  )
}

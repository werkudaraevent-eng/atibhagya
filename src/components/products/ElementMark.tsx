import { ELEMENT_PATHS, type Element } from '@/lib/elements'
import styles from './ElementMark.module.css'

type Props = {
  element: Element
  /** Accessible name, e.g. "Water"; omit when a visible label sits beside it. */
  label?: string
  size?: 'small' | 'medium'
  className?: string
}

/**
 * One of the five elements as a drawn mark — the same single gold stroke
 * as the ornaments, drawn in once as it enters (`data-draw`).
 */
export function ElementMark({ element, label, size = 'small', className }: Props) {
  const { viewBox, d } = ELEMENT_PATHS[element]
  return (
    <svg
      className={[styles.mark, styles[size], className].filter(Boolean).join(' ')}
      viewBox={viewBox}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label ? <title>{label}</title> : null}
      {d.map((path, i) => (
        <path key={i} d={path} data-draw />
      ))}
    </svg>
  )
}

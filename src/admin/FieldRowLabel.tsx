'use client'

import { useRowLabel } from '@payloadcms/ui'

import {
  KIND_LABELS,
  SOURCE_LABELS,
  isPickSource,
  type FieldKind,
} from '../lib/inquiry-fields'

export type RowData = {
  kind?: FieldKind | string
  label?: unknown
  name?: string
  source?: string
  required?: boolean
  enabled?: boolean
}

/** A localized value as one string: the English, else the first there is. */
const oneText = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    const first = v.en ?? v.id ?? Object.values(v)[0]
    return typeof first === 'string' ? first : ''
  }
  return ''
}

/**
 * What a row is called: the label the editor typed, or failing that the
 * kind ("Email", "Custom question"), with the source for a pick and a mark
 * when it is required. Shared by the form builder's row heads and the
 * version comparison.
 */
export const rowTitle = (data: RowData | undefined, rowNumber: number) => {
  const kind = data?.kind
  const source = data?.source
  const what =
    kind === 'pick'
      ? isPickSource(source)
        ? SOURCE_LABELS[source]
        : 'Choose from the site'
      : kind
        ? (KIND_LABELS[kind as FieldKind] ?? String(kind))
        : ''
  const label = oneText(data?.label).trim() || data?.name?.trim() || what
  const number = String(rowNumber + 1).padStart(2, '0')
  const suffix =
    (kind === 'custom' || kind === 'pick') && label !== what && what ? ` (${what})` : ''
  return { number, title: `${label}${suffix}`, off: data?.enabled === false, required: Boolean(data?.required) }
}

/** A row in the inquiry form builder, named after what it is. */
export const FieldRowLabel = () => {
  const { data, rowNumber } = useRowLabel<RowData>()
  const { number, title, off, required } = rowTitle(data, rowNumber ?? 0)

  return (
    <span style={off ? { opacity: 0.55 } : undefined}>
      {number} · {title}
      {required ? ' *' : ''}
      {off ? ' — off' : ''}
    </span>
  )
}

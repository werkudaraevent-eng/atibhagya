'use client'

import { useRowLabel } from '@payloadcms/ui'

import {
  KIND_LABELS,
  SOURCE_LABELS,
  isPickSource,
  type FieldKind,
} from '../lib/inquiry-fields'

/**
 * A row in the inquiry form builder, named after what it is: the label the
 * editor typed, or failing that the kind ("Email", "Custom question"), with
 * the source for a pick and a mark when it is required.
 */
export const FieldRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    kind?: FieldKind
    label?: string
    name?: string
    source?: string
    required?: boolean
    enabled?: boolean
  }>()

  const kind = data?.kind
  const source = data?.source
  const what =
    kind === 'pick'
      ? isPickSource(source)
        ? SOURCE_LABELS[source]
        : 'Choose from the site'
      : kind
        ? KIND_LABELS[kind]
        : ''
  const label = data?.label?.trim() || data?.name?.trim() || what
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const suffix =
    (kind === 'custom' || kind === 'pick') && label !== what && what ? ` (${what})` : ''

  const off = data?.enabled === false

  return (
    <span style={off ? { opacity: 0.55 } : undefined}>
      {number} · {label}
      {suffix}
      {data?.required ? ' *' : ''}
      {off ? ' — off' : ''}
    </span>
  )
}

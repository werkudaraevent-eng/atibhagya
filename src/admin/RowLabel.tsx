'use client'

import { useRowLabel } from '@payloadcms/ui'

/**
 * Array rows in the admin read as "Item 1, Item 2" by default, which tells an
 * editor nothing when a journey has fourteen activities. This shows whatever
 * the row is actually called.
 */
export const RowLabel = () => {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()

  const value = ['label', 'title', 'name', 'key', 'text'].reduce<string>((found, field) => {
    if (found) return found
    const candidate = data?.[field]
    return typeof candidate === 'string' && candidate.trim() ? candidate : ''
  }, '')

  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')

  return <span>{value ? `${number} · ${value}` : number}</span>
}

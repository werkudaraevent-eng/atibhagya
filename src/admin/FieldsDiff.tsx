'use client'

import type { FieldDiffClientProps } from 'payload'

import { KIND_LABELS, SOURCE_LABELS, isPickSource, type FieldKind } from '../lib/inquiry-fields'
import { rowTitle, type RowData } from './FieldRowLabel'

/**
 * The version comparison for the form builder's list of fields.
 *
 * Payload's own comparison names array rows "Item 03" and shows only the
 * sub-field that changed, so a reader saw "Item 03 · On the form: true →
 * false" and had to count rows to learn it was Phone being switched off.
 * This one names each row as the form builder does, matches rows by their
 * id rather than their position (so a reordered list is "moved", not
 * "everything changed"), and reads each change as a sentence.
 */

type Row = RowData & { id?: string; [key: string]: unknown }

/** The sub-fields, in the words the form builder uses for them. */
const NAMES: Record<string, string> = {
  enabled: 'On the form',
  kind: 'Field type',
  label: 'Label',
  source: 'Source',
  multiple: 'Several choices',
  dateMode: 'Ask for',
  required: 'Required',
  width: 'Width',
  name: 'Key',
  type: 'Answer type',
  placeholder: 'Placeholder',
  help: 'Help text',
  showWhen: 'Show only when',
  options: 'Options',
}

const isLocalized = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) && ('en' in (value as object) || 'id' in (value as object))

/** A value as a reader would say it. */
const say = (key: string, value: unknown): string => {
  if (value === undefined || value === null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (key === 'kind' && typeof value === 'string') return KIND_LABELS[value as FieldKind] ?? value
  if (key === 'source' && isPickSource(value)) return SOURCE_LABELS[value]
  if (isLocalized(value)) {
    return Object.entries(value)
      .filter(([, v]) => typeof v === 'string' && v.trim())
      .map(([l, v]) => `${l.toUpperCase()} “${v as string}”`)
      .join(' · ') || '—'
  }
  if (key === 'options' && Array.isArray(value)) {
    const labels = value
      .map((o) => (o && typeof o === 'object' ? say('label', (o as Row).label) : String(o)))
      .filter((s) => s !== '—')
    return labels.length ? labels.join(', ') : '—'
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

type Change = { key: string; from: unknown; to: unknown }
type Entry =
  | { kind: 'added' | 'removed'; number: string; title: string }
  | { kind: 'changed'; number: string; title: string; movedFrom?: string; changes: Change[] }

const rows = (value: unknown): Row[] => (Array.isArray(value) ? (value as Row[]) : [])

/** What happened between the two lists, row by row. */
const compare = (fromRows: Row[], toRows: Row[]): Entry[] => {
  const entries: Entry[] = []
  const seen = new Set<number>()

  const findFrom = (row: Row, i: number) => {
    if (row.id) {
      const at = fromRows.findIndex((r) => r.id === row.id)
      if (at !== -1) return at
    }
    return !fromRows[i]?.id || !row.id ? (fromRows[i] ? i : -1) : -1
  }

  toRows.forEach((row, i) => {
    const { number, title } = rowTitle(row, i)
    const at = findFrom(row, i)
    if (at === -1) {
      entries.push({ kind: 'added', number, title })
      return
    }
    seen.add(at)
    const before = fromRows[at]!
    const keys = [...new Set([...Object.keys(before), ...Object.keys(row)])].filter((k) => k !== 'id')
    const changes = keys.filter((k) => !same(before[k], row[k])).map((k) => ({ key: k, from: before[k], to: row[k] }))
    const movedFrom = at !== i ? String(at + 1).padStart(2, '0') : undefined
    if (changes.length || movedFrom) entries.push({ kind: 'changed', number, title, movedFrom, changes })
  })

  fromRows.forEach((row, i) => {
    if (seen.has(i)) return
    const { number, title } = rowTitle(row, i)
    entries.push({ kind: 'removed', number, title })
  })

  return entries
}

const tone = {
  from: { color: 'var(--theme-error-500)', textDecoration: 'line-through' },
  to: { color: 'var(--theme-success-500)' },
  muted: { color: 'var(--theme-elevation-500)' },
} as const

export const FieldsDiff = ({ comparisonValue, versionValue }: FieldDiffClientProps) => {
  const entries = compare(rows(comparisonValue), rows(versionValue))

  return (
    <div style={{ padding: '4px 0 16px' }}>
      <div style={{ fontWeight: 600, marginBottom: 10 }}>Fields</div>

      {entries.length === 0 ? (
        <div style={tone.muted}>No field was added, removed, moved or changed.</div>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
          {entries.map((e) => (
            <li key={`${e.kind}-${e.number}-${e.title}`} style={{ lineHeight: 1.5 }}>
              <div>
                <span style={tone.muted}>{e.number} · </span>
                <strong>{e.title}</strong>
                {e.kind === 'added' ? <span style={tone.to}> — added</span> : null}
                {e.kind === 'removed' ? <span style={tone.from}> — removed</span> : null}
                {e.kind === 'changed' && e.movedFrom ? (
                  <span style={tone.muted}> — moved from {e.movedFrom}</span>
                ) : null}
              </div>
              {e.kind === 'changed' && e.changes.length ? (
                <ul style={{ margin: '4px 0 0 22px', padding: 0, listStyle: 'none' }}>
                  {e.changes.map((c) => (
                    <li key={c.key}>
                      <span style={tone.muted}>{NAMES[c.key] ?? c.key}: </span>
                      <span style={tone.from}>{say(c.key, c.from)}</span>
                      <span style={tone.muted}> → </span>
                      <span style={tone.to}>{say(c.key, c.to)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

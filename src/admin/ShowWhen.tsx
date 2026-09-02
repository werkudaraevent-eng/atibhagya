'use client'

import { FieldDescription, FieldLabel, SelectInput, useAllFormFields, useField } from '@payloadcms/ui'
import { useMemo } from 'react'

import { dict } from '../lib/i18n/ui'
import {
  KIND_LABELS,
  canTrigger,
  fieldName,
  type FieldKind,
  type FieldType,
  type ShowWhen as Rule,
} from '../lib/inquiry-fields'

type Option = { label: string; value: string }

/** Reads one sibling row's scalar from the form state. */
const read = (state: Record<string, { value?: unknown } | undefined>, key: string) => {
  const v = state[key]?.value
  return typeof v === 'string' || typeof v === 'boolean' ? v : undefined
}

/**
 * "Show only when…" — the rule that makes one field appear depending on
 * another's answer. The triggers offered are the other rows of this form
 * whose answer is a choice, read live from the form so a row added a moment
 * ago is already listed; the values offered are that row's own options.
 */
export const ShowWhen = ({ path }: { path: string }) => {
  const { value, setValue } = useField<Rule | null>({ path })
  const [state] = useAllFormFields()
  const fields = state as Record<string, { value?: unknown } | undefined>

  const ownIndex = Number(path.match(/^fields\.(\d+)\./)?.[1] ?? -1)

  // Every other row that could decide this one, with its options.
  const triggers = useMemo(() => {
    const list: { option: Option; values: Option[] }[] = []

    for (const key of Object.keys(fields)) {
      const m = key.match(/^fields\.(\d+)\.kind$/)
      if (!m) continue
      const i = Number(m[1])
      if (i === ownIndex) continue

      const kind = read(fields, `fields.${i}.kind`) as FieldKind | undefined
      const type = (read(fields, `fields.${i}.type`) as FieldType | undefined) ?? 'text'
      if (!kind || !canTrigger({ kind, type })) continue

      const label = String(read(fields, `fields.${i}.label`) ?? '') || KIND_LABELS[kind]
      const name = fieldName(kind, undefined, String(read(fields, `fields.${i}.name`) ?? ''))
      if (!name) continue

      let values: Option[] = []
      if (kind === 'custom' && type === 'checkbox') {
        values = [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]
      } else {
        for (let j = 0; ; j++) {
          const v = read(fields, `fields.${i}.options.${j}.value`)
          if (v === undefined) break
          const l = read(fields, `fields.${i}.options.${j}.label`)
          if (typeof v === 'string' && v) values.push({ value: v, label: String(l || v) })
        }
        if (kind === 'audience' && values.length === 0) {
          values = dict('en').inquiry.audienceOptions.map((o) => ({ value: o.value, label: o.label }))
        }
      }

      list.push({ option: { label, value: name }, values })
    }

    return list
  }, [fields, ownIndex])

  const current = triggers.find((t) => t.option.value === value?.field)

  const pick = (o: unknown): string[] =>
    (Array.isArray(o) ? o : o ? [o] : [])
      .map((x) => (x as { value?: unknown })?.value)
      .filter((v): v is string => typeof v === 'string')

  return (
    <div className="field-type">
      <FieldLabel label="Show only when…" path={path} />
      <FieldDescription
        path={path}
        description="Leave empty to always show this field. Otherwise it appears only while the chosen field holds one of the chosen answers — and is not required while hidden."
      />

      {triggers.length === 0 ? (
        <p style={{ opacity: 0.6, marginTop: 8 }}>
          No field on this form can decide yet. Add a &ldquo;Private / group&rdquo; field, or a
          custom question of type choose one / choose several / yes-no.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginTop: 8 }}>
          <SelectInput
            path={`${path}.field`}
            name={`${path}.field`}
            label="Field"
            isClearable
            options={triggers.map((t) => t.option)}
            value={value?.field ?? ''}
            onChange={(o) => {
              const [field] = pick(o)
              setValue(field ? { field, values: [] } : null)
            }}
          />
          <SelectInput
            path={`${path}.values`}
            name={`${path}.values`}
            label="Is one of"
            hasMany
            readOnly={!current}
            options={current?.values ?? []}
            value={value?.values ?? []}
            onChange={(o) => {
              if (!value?.field) return
              setValue({ field: value.field, values: pick(o) })
            }}
          />
        </div>
      )}
    </div>
  )
}

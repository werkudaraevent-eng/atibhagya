import type { GlobalConfig } from 'payload'

import { stampUpdatedByGlobal, updatedBy } from '../lib/audit'
import type { Locale } from '../lib/content/types'
import { dict } from '../lib/i18n/ui'
import {
  DEFAULT_ROWS,
  KIND_CHOICES,
  KIND_LABELS,
  PICK_SOURCES,
  SOURCE_LABELS,
  fieldName,
  isPickSource,
  isTextKind,
  type FieldKind,
} from '../lib/inquiry-fields'
import { revalidateGlobal } from '../lib/revalidate'

const text = (name: string, description?: string) => ({
  name,
  type: 'text' as const,
  localized: true,
  ...(description ? { admin: { description } } : {}),
})

type Row = {
  kind?: string
  name?: string
  source?: string
  required?: boolean
  enabled?: boolean
}

/**
 * The form must stay answerable: one Email field, each kind (or pick source)
 * at most once, every custom question with its own key.
 */
const checkFields = (value: unknown) => {
  const rows = (Array.isArray(value) ? value : []) as Row[]
  if (rows.length === 0) return true

  if (!rows.some((r) => r.kind === 'email' && r.enabled !== false)) {
    return 'The form needs an Email field on it — it is how the team replies. Add one back, or switch it on.'
  }

  const seen = new Set<string>()
  for (const row of rows) {
    const kind = row.kind ?? ''

    if (kind === 'custom') {
      // An empty key is filled from the label before this runs.
      const key = (row.name ?? '').trim()
      if (key && seen.has(key)) return `Two custom questions share the key "${key}".`
      if (key) seen.add(key)
      continue
    }

    if (kind === 'pick' && !isPickSource(row.source)) {
      return 'A "Choose from the site" field needs a source: products, journeys or categories.'
    }

    const name = fieldName(kind as FieldKind, row.source)
    if (seen.has(name)) {
      const label = isPickSource(row.source)
        ? SOURCE_LABELS[row.source]
        : (KIND_LABELS[kind as FieldKind] ?? kind)
      return `"${label}" appears more than once.`
    }
    seen.add(name)
  }

  return true
}

/** "How did you hear about us?" → "how_did_you_hear_about_us". */
const keyFrom = (label: unknown) =>
  String(label ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^[^a-z]+/, '')
    .slice(0, 60)

/**
 * A custom question saved without a key would be skipped by the site — a
 * draft is not validated, so it can happen quietly. Rather than let it, the
 * key is derived from the label, made unique if it has to be.
 */
const fillKeys = (rows: unknown) => {
  if (!Array.isArray(rows)) return rows
  const taken = new Set(
    rows.map((r) => (r?.kind === 'custom' ? String(r?.name ?? '').trim() : '')).filter(Boolean),
  )
  return rows.map((row: Row & Record<string, unknown>) => {
    if (row?.kind !== 'custom' || String(row.name ?? '').trim()) return row
    const label = typeof row.label === 'object' && row.label ? Object.values(row.label)[0] : row.label
    let key = keyFrom(label) || 'question'
    for (let n = 2; taken.has(key); n++) key = `${keyFrom(label) || 'question'}_${n}`
    taken.add(key)
    return { ...row, name: key }
  })
}

/**
 * A localized value as Payload expects it for the locale being read: a plain
 * string for one locale, an object keyed by locale for `all`.
 */
const localized = (locale: string | undefined, pick: (l: Locale) => string) =>
  locale === 'all' ? { en: pick('en'), id: pick('id') } : pick(locale === 'id' ? 'id' : 'en')

/** Each wording field in this global, and the approved copy it falls back to. */
const WORDING: Record<string, (l: Locale) => string> = {
  eyebrow: (l) => dict(l).inquiry.eyebrow,
  headline: (l) => dict(l).inquiry.headline,
  lede: (l) => dict(l).inquiry.lede,
  addCustomLabel: (l) => dict(l).inquiry.addIdea,
  requiredNote: (l) => dict(l).inquiry.requiredNote,
  submitLabel: (l) => dict(l).inquiry.submit,
  privacyNote: (l) => dict(l).inquiry.privacyNote,
  doneEyebrow: (l) => dict(l).inquiry.doneEyebrow,
  doneHeading: (l) => dict(l).inquiry.doneHeading,
  doneBody: (l) => dict(l).inquiry.doneBody,
  doneContact: (l) => dict(l).inquiry.doneContact,
  doneBack: (l) => dict(l).inquiry.doneBack,
}

/**
 * Fills in what a built-in row inherits when left blank — its approved label,
 * and for the private/group dropdown its approved choices — so the editor
 * sees the real form rather than empty boxes standing in for it.
 */
const completeRow = (row: Record<string, unknown>, locale: string | undefined) => {
  const kind = String(row.kind ?? '')
  if (kind === 'custom') return row

  const next = { ...row }

  if (!next.label) {
    if (kind === 'pick' && isPickSource(next.source)) {
      const source = next.source
      next.label = localized(locale, (l) => dict(l).inquiry[source])
    } else if (kind === 'ideas') {
      next.label = localized(locale, (l) => dict(l).inquiry.ideas)
    } else if (isTextKind(kind)) {
      next.label = localized(locale, (l) => dict(l).inquiry[kind])
    }
  }

  if (kind === 'audience' && (!Array.isArray(next.options) || next.options.length === 0)) {
    next.options = dict('en').inquiry.audienceOptions.map((option, i) => ({
      value: option.value,
      label: localized(locale, (l) => dict(l).inquiry.audienceOptions[i]?.label ?? option.label),
    }))
  }

  return next
}

/**
 * The inquiry form, as the team wants it.
 *
 * Every field on the form is a row here: text kinds (which write to their own
 * column on each inquiry, so lists and emails keep working), picks from lists
 * the site already has, the visitor's own ideas, and custom questions (stored
 * by key). Rows can be reordered by dragging, removed, relabelled and marked
 * required. With no rows saved, the approved default form is shown.
 */
export const InquiryFormCopy: GlobalConfig = {
  slug: 'inquiry-form',
  label: 'Inquiry form',
  admin: {
    group: 'Inquiries',
    description:
      'The fields on the inquiry form and the words around them. Every box shows what the site currently says — change it, or clear it to return to the approved copy.',
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && 'fields' in data) data.fields = fillKeys(data.fields)
        return data
      },
    ],
    // An empty list means "the approved form" — so show the approved form,
    // as rows, rather than a blank list that hides what the site is doing.
    // The first Publish then saves them for real.
    afterRead: [
      ({ doc, req }) => {
        const rows: Record<string, unknown>[] =
          Array.isArray(doc?.fields) && doc.fields.length > 0 ? doc.fields : DEFAULT_ROWS
        doc.fields = rows.map((row) => completeRow(row, req.locale))

        // The wording boxes likewise show what the site is saying, so an
        // editor changes a sentence rather than guessing what blank means.
        for (const [key, pick] of Object.entries(WORDING)) {
          if (!doc[key]) doc[key] = localized(req.locale, pick)
        }
        return doc
      },
    ],
    beforeChange: [stampUpdatedByGlobal],
    afterChange: [revalidateGlobal(['/inquiry'])],
  },
  versions: { drafts: true, max: 50 },
  fields: [
    updatedBy,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fields',
          description:
            'The form, top to bottom. Two half-width fields sit side by side. Email cannot be removed — it is how the team replies.',
          fields: [
            {
              name: 'fields',
              type: 'array',
              labels: { singular: 'Field', plural: 'Fields' },
              validate: checkFields,
              defaultValue: DEFAULT_ROWS,
              admin: {
                components: {
                  RowLabel: '@/admin/FieldRowLabel#FieldRowLabel',
                  // Versions: each row by its name, each change as a sentence.
                  Diff: '@/admin/FieldsDiff#FieldsDiff',
                },
                isSortable: true,
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'On the form',
                  defaultValue: true,
                  admin: {
                    description:
                      'Untick to take this field off the form without losing its wording, options or rule — for a question you will want back later. Remove (in the row menu) deletes it; Versions can still restore an earlier form.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'kind',
                      type: 'select',
                      label: 'Field type',
                      required: true,
                      defaultValue: 'custom',
                      options: KIND_CHOICES,
                      admin: {
                        description:
                          'What this field is. "Standard" fields each have their own place on every inquiry (name, email, date…) and can appear once. A custom question is anything else you want to ask.',
                      },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      localized: true,
                      admin: {
                        description:
                          'What the visitor sees. Empty keeps the approved wording for a standard field.',
                      },
                      validate: (value: unknown, { siblingData }: { siblingData?: Row }) =>
                        siblingData?.kind === 'custom' && !(typeof value === 'string' && value.trim())
                          ? 'A custom question needs a label.'
                          : true,
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_data, sibling) => sibling?.kind === 'pick' },
                  fields: [
                    {
                      name: 'source',
                      type: 'select',
                      defaultValue: 'products',
                      options: PICK_SOURCES.map((source) => ({
                        label: SOURCE_LABELS[source],
                        value: source,
                      })),
                      admin: {
                        description:
                          'The list on the site that fills the dropdown. Products and journeys are stored as links to the real items; a category is stored by name.',
                      },
                    },
                    {
                      name: 'multiple',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Several choices',
                      admin: {
                        description:
                          'Ticked: the visitor can add more than one, shown as chips. Unticked: a single dropdown.',
                      },
                    },
                  ],
                },
                {
                  name: 'dateMode',
                  type: 'select',
                  label: 'Ask for',
                  defaultValue: 'month',
                  options: [
                    { label: 'A month (e.g. November 2026)', value: 'month' },
                    { label: 'An exact date', value: 'date' },
                  ],
                  admin: {
                    condition: (_data, sibling) => sibling?.kind === 'date',
                    description:
                      'Most guests know the month before the day; ask for the day only if planning needs it.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'required',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: { description: 'Email is always required.' },
                    },
                    {
                      name: 'width',
                      type: 'select',
                      defaultValue: 'half',
                      options: [
                        { label: 'Half width', value: 'half' },
                        { label: 'Full width', value: 'full' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: { condition: (_data, sibling) => sibling?.kind === 'custom' },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Key',
                      admin: {
                        description:
                          'Where the answer is stored, e.g. dietary_needs. Leave empty and it is made from the label on save. Lowercase letters, numbers and underscores. Changing it later orphans answers already collected.',
                      },
                      validate: (value: unknown, { siblingData }: { siblingData?: Row }) => {
                        if (siblingData?.kind !== 'custom') return true
                        if (value === undefined || value === null || value === '') return true
                        return typeof value === 'string' && /^[a-z][a-z0-9_]*$/.test(value)
                          ? true
                          : 'Lowercase letters, numbers and underscores, starting with a letter.'
                      },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      defaultValue: 'text',
                      options: [
                        { label: 'Short text', value: 'text' },
                        { label: 'Long text', value: 'textarea' },
                        { label: 'Email', value: 'email' },
                        { label: 'Phone', value: 'tel' },
                        { label: 'Number', value: 'number' },
                        { label: 'Date', value: 'date' },
                        { label: 'Month', value: 'month' },
                        { label: 'Choose one (dropdown)', value: 'select' },
                        { label: 'Choose several (chips)', value: 'multiselect' },
                        { label: 'Yes / no', value: 'checkbox' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    text('placeholder', 'Grey text inside the empty field.'),
                    text('help', 'A small line under the field.'),
                  ],
                },
                {
                  name: 'showWhen',
                  type: 'json',
                  admin: {
                    components: { Field: '@/admin/ShowWhen#ShowWhen' },
                  },
                },
                {
                  name: 'options',
                  type: 'array',
                  labels: { singular: 'Option', plural: 'Options' },
                  admin: {
                    condition: (_data, sibling) =>
                      sibling?.kind === 'audience' ||
                      (sibling?.kind === 'custom' &&
                        (sibling?.type === 'select' || sibling?.type === 'multiselect')),
                    components: { RowLabel: '@/admin/RowLabel#RowLabel' },
                    description:
                      'The choices in the dropdown, in order. The value is what gets stored on each inquiry, so reword the label freely but leave the value alone once inquiries have arrived.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', required: true, localized: true },
                        { name: 'value', type: 'text', required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Opening',
          fields: [
            text('eyebrow', 'The small label above the heading.'),
            text('headline'),
            {
              name: 'lede',
              type: 'textarea',
              localized: true,
              admin: { description: 'The line under the heading.' },
            },
          ],
        },
        {
          label: 'Other wording',
          fields: [
            text('addCustomLabel', 'The button that adds an "own idea".'),
            text('requiredNote', 'The line above the form explaining the * mark. Default "Required".'),
            text('submitLabel', 'The submit button.'),
            {
              name: 'privacyNote',
              type: 'textarea',
              localized: true,
              label: 'Data notice',
              admin: {
                description:
                  'The short line under the submit button saying what happens to what the visitor writes. Indonesia’s personal-data law (UU 27/2022) expects one; keep it honest and plain. Clear it to return to the approved wording.',
              },
            },
          ],
        },
        {
          label: 'After submitting',
          fields: [
            text('doneEyebrow', 'The small word above the thank-you. Default "Received".'),
            text('doneHeading'),
            {
              name: 'doneBody',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'Use {time} where the response time from Site settings should appear.',
              },
            },
            text('doneContact', 'The line above the fallback email address.'),
            text('doneBack', 'The link back to the site.'),
          ],
        },
      ],
    },
  ],
}

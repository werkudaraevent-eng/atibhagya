/**
 * The vocabulary of the inquiry form builder, shared by the CMS config, the
 * dictionary, the form and the server action.
 *
 * A field is one of:
 *
 *   - a **text kind** — name, email, phone … — each writing to its own column
 *     on the inquiries collection, so the admin list and the notification
 *     email keep working;
 *   - a **pick** — a dropdown whose choices are a list that already exists on
 *     the site (products, journeys, categories), one or several;
 *   - **ideas** — free text the visitor adds as many of as they like;
 *   - a **custom** question, stored by key in the `answers` array.
 *
 * The team arranges, removes, relabels and requires them in the CMS.
 */

export type TextKind =
  | 'name'
  | 'email'
  | 'phone'
  | 'audience'
  | 'organisation'
  | 'pax'
  | 'location'
  | 'date'
  | 'goal'
  | 'notes'

export type PickSource = 'products' | 'journeys' | 'categories'

export type FieldKind = TextKind | 'pick' | 'ideas' | 'custom'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'month'
  | 'select'
  | 'multiselect'
  | 'checkbox'

export type FieldOption = { value: string; label: string }

export type FormField = {
  kind: FieldKind
  /**
   * Storage key: the kind itself for text kinds, `pick:<source>` for a pick,
   * `ideas`, or the editor's key for a custom question.
   */
  name: string
  label: string
  type: FieldType
  required: boolean
  width: 'full' | 'half'
  placeholder?: string
  help?: string
  options: FieldOption[]
  /** Pick only: which list on the site feeds the dropdown. */
  source?: PickSource
  /** Pick only: several choices (chips) or just one. */
  multiple?: boolean
  /** Shown only while another field's answer is one of these values. */
  showWhen?: ShowWhen
}

export type ShowWhen = {
  /** The `name` of the field whose answer decides. */
  field: string
  values: string[]
}

/** Whether a field's answer can decide another field's visibility. */
export const canTrigger = (field: Pick<FormField, 'kind' | 'type'>) =>
  field.kind === 'audience' ||
  (field.kind === 'custom' &&
    (field.type === 'select' || field.type === 'multiselect' || field.type === 'checkbox'))

/** Parses whatever the CMS stored for a rule into a usable one, or nothing. */
export function readShowWhen(raw: unknown): ShowWhen | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const { field, values } = raw as { field?: unknown; values?: unknown }
  if (typeof field !== 'string' || !field.trim()) return undefined
  const list = (Array.isArray(values) ? values : []).map(String).filter(Boolean)
  if (list.length === 0) return undefined
  return { field: field.trim(), values: list }
}

type TextSpec = {
  type: FieldType
  width: 'full' | 'half'
  required: boolean
  /** Longest value the column will keep. */
  max: number
  autoComplete?: string
}

export const TEXT_KINDS: Record<TextKind, TextSpec> = {
  name: { type: 'text', width: 'half', required: true, max: 120, autoComplete: 'name' },
  email: { type: 'email', width: 'half', required: true, max: 200, autoComplete: 'email' },
  phone: { type: 'tel', width: 'half', required: false, max: 40, autoComplete: 'tel' },
  audience: { type: 'select', width: 'half', required: false, max: 40 },
  organisation: {
    type: 'text',
    width: 'half',
    required: false,
    max: 160,
    autoComplete: 'organization',
  },
  pax: { type: 'text', width: 'half', required: false, max: 40 },
  location: { type: 'text', width: 'half', required: false, max: 160 },
  date: { type: 'month', width: 'half', required: false, max: 40 },
  goal: { type: 'textarea', width: 'full', required: true, max: 2000 },
  notes: { type: 'textarea', width: 'full', required: false, max: 5000 },
}

export const PICK_SOURCES: PickSource[] = ['products', 'journeys', 'categories']

export const isTextKind = (kind: string): kind is TextKind => kind in TEXT_KINDS
export const isPickSource = (source: unknown): source is PickSource =>
  typeof source === 'string' && (PICK_SOURCES as string[]).includes(source)

/** What each kind is called in the admin, in the row heading. */
export const KIND_LABELS: Record<FieldKind, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  audience: 'Private / group',
  organisation: 'Company / community',
  pax: 'Participants',
  location: 'Preferred location',
  date: 'Preferred date',
  goal: 'Goal of activity',
  notes: 'Notes',
  pick: 'From the site',
  ideas: 'Own ideas',
  custom: 'Custom question',
}

/**
 * The "Field type" dropdown, grouped by prefix so an editor can tell a
 * standard field (stored in its own column) from the other kinds at a glance.
 * Custom comes first: it is what "add a field" usually means.
 */
export const KIND_CHOICES: { label: string; value: FieldKind }[] = [
  { label: 'Custom question — your own field (text, number, date, choices…)', value: 'custom' },
  { label: 'From the site — a dropdown of products, journeys or categories', value: 'pick' },
  { label: 'Own ideas — free text the visitor can add several of', value: 'ideas' },
  ...(Object.keys(TEXT_KINDS) as TextKind[]).map((kind) => ({
    label: `Standard · ${KIND_LABELS[kind]}`,
    value: kind as FieldKind,
  })),
]

export const SOURCE_LABELS: Record<PickSource, string> = {
  products: 'Products',
  journeys: 'Journeys',
  categories: 'Product categories',
}

/** The storage key of a row, which is also how duplicates are recognised. */
export const fieldName = (kind: FieldKind, source?: string, customName?: string) =>
  kind === 'pick' ? `pick:${source ?? ''}` : kind === 'custom' ? (customName ?? '') : kind

/** A default-form row, as stored in the CMS. */
export type DefaultRow = {
  kind: FieldKind
  required: boolean
  width: 'full' | 'half'
  source?: PickSource
  multiple?: boolean
}

/** The approved form, in order, without wording. */
export const DEFAULT_ROWS: DefaultRow[] = [
  ...(Object.keys(TEXT_KINDS) as TextKind[]).map((kind) => ({
    kind,
    required: TEXT_KINDS[kind].required,
    width: TEXT_KINDS[kind].width,
  })),
  { kind: 'pick', source: 'products', multiple: true, required: false, width: 'half' },
  { kind: 'pick', source: 'journeys', multiple: true, required: false, width: 'half' },
  { kind: 'ideas', required: false, width: 'full' },
]

/** Every default label a row can inherit. */
export type LabelKey = TextKind | PickSource | 'ideas'

/** The default form with the given labels. */
export function defaultFields(labels: Record<LabelKey, string>): FormField[] {
  return DEFAULT_ROWS.map((row) => {
    if (row.kind === 'pick') {
      const source = row.source ?? 'products'
      return {
        kind: 'pick',
        name: fieldName('pick', source),
        label: labels[source],
        type: 'select',
        required: row.required,
        width: row.width,
        options: [],
        source,
        multiple: row.multiple ?? true,
      }
    }
    if (row.kind === 'ideas') {
      return {
        kind: 'ideas',
        name: 'ideas',
        label: labels.ideas,
        type: 'text',
        required: row.required,
        width: row.width,
        options: [],
      }
    }
    const kind = row.kind as TextKind
    return {
      kind,
      name: kind,
      label: labels[kind],
      type: TEXT_KINDS[kind].type,
      required: row.required,
      width: row.width,
      options: [],
    }
  })
}

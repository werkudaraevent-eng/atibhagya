import type { Dict } from './i18n/ui'
import type { FormField, PickSource, TextKind } from './inquiry-fields'

export type InquiryDraft = {
  name: string
  email: string
  phone: string
  audience: string
  organisation: string
  pax: string
  preferredLocation: string
  preferredDate: string
  goal: string
  notes: string
  /** Slugs of products the visitor is interested in. */
  productSlugs: string[]
  /** Slugs of journeys the visitor is interested in. */
  journeySlugs: string[]
  /** Slugs of categories the visitor is interested in. */
  categorySlugs: string[]
  /** Anything they typed themselves. */
  customActivities: string[]
  /** Answers to custom questions configured in the CMS, keyed by name. */
  answers: Record<string, string>
}

export const emptyDraft: InquiryDraft = {
  name: '',
  email: '',
  phone: '',
  audience: 'private',
  organisation: '',
  pax: '',
  preferredLocation: '',
  preferredDate: '',
  goal: '',
  notes: '',
  productSlugs: [],
  journeySlugs: [],
  categorySlugs: [],
  customActivities: [],
  answers: {},
}

export const DRAFT_STORAGE_KEY = 'atibhagya:inquiry-draft'

/** Keyed by field name — a text kind, `pick:<source>`, `ideas`, or a custom key. */
export type FieldErrors = Record<string, string | undefined>

/** The keys on the draft that hold a single string. */
type TextKey = {
  [K in keyof InquiryDraft]: InquiryDraft[K] extends string ? K : never
}[keyof InquiryDraft]

/** The draft key each text kind reads and writes. */
export const DRAFT_KEY: Record<TextKind, TextKey> = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  audience: 'audience',
  organisation: 'organisation',
  pax: 'pax',
  location: 'preferredLocation',
  date: 'preferredDate',
  goal: 'goal',
  notes: 'notes',
}

/** The draft key holding the slugs picked from each source. */
export const PICK_KEY: Record<PickSource, 'productSlugs' | 'journeySlugs' | 'categorySlugs'> = {
  products: 'productSlugs',
  journeys: 'journeySlugs',
  categories: 'categorySlugs',
}

/** The value the visitor has given a field, as text. */
export function readField(draft: InquiryDraft, field: FormField): string {
  switch (field.kind) {
    case 'custom':
      return String(draft.answers?.[field.name] ?? '')
    case 'pick':
      return (draft[PICK_KEY[field.source ?? 'products']] ?? []).join(', ')
    case 'ideas':
      return (draft.customActivities ?? []).join(', ')
    default:
      return String(draft[DRAFT_KEY[field.kind]] ?? '')
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The answers a choice-type field currently holds, as separate values. */
function chosen(draft: InquiryDraft, field: FormField): string[] {
  const raw = readField(draft, field)
  if (field.kind === 'custom' && field.type === 'checkbox') return [raw === 'yes' ? 'yes' : 'no']
  return raw
    .split(', ')
    .map((v) => v.trim())
    .filter(Boolean)
}

/**
 * Whether a field is on the form right now. A field with a rule is shown
 * only while the field it points at holds one of the listed answers; a rule
 * pointing at a field that no longer exists is ignored, so a deleted trigger
 * never makes another field vanish silently.
 */
export function isVisible(
  field: FormField,
  draft: InquiryDraft,
  fields: FormField[],
  seen: Set<string> = new Set(),
): boolean {
  const rule = field.showWhen
  if (!rule) return true
  // Two fields pointing at each other would never resolve; treat as shown.
  if (seen.has(field.name)) return true
  seen.add(field.name)
  const trigger = fields.find((f) => f.name === rule.field)
  if (!trigger || trigger.name === field.name) return true
  // A hidden trigger cannot be answered, so what hangs off it hides too.
  if (!isVisible(trigger, draft, fields, seen)) return false
  return chosen(draft, trigger).some((v) => rule.values.includes(v))
}

/** The fields the visitor can see, given what they have answered so far. */
export const visibleFields = (draft: InquiryDraft, fields: FormField[]) =>
  fields.filter((f) => isVisible(f, draft, fields))

/**
 * Checks the draft against the form as configured. Runs in the browser for
 * the visitor and again on the server, which reads the configuration afresh
 * rather than trusting the browser's copy of what is required. Hidden fields
 * are neither required nor checked.
 */
export function validate(
  draft: InquiryDraft,
  fields: FormField[],
  errors: Dict['inquiry']['errors'],
): FieldErrors {
  const found: FieldErrors = {}

  for (const field of visibleFields(draft, fields)) {
    const value = readField(draft, field).trim()

    if (field.required && !value) {
      found[field.name] =
        field.kind === 'name'
          ? errors.name
          : field.kind === 'email'
            ? errors.email
            : field.kind === 'goal'
              ? errors.goal
              : `${field.label} — ${errors.required}`
      continue
    }

    if (field.kind === 'email' && value && !emailPattern.test(value)) {
      found[field.name] = errors.emailInvalid
    }
  }

  return found
}

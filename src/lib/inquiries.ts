import type { Dict } from './i18n/ui'

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
  /** Anything they typed themselves. */
  customActivities: string[]
  /** Answers to questions the team configured in the CMS, keyed by name. */
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
  customActivities: [],
  answers: {},
}

export const DRAFT_STORAGE_KEY = 'atibhagya:inquiry-draft'

export type FieldErrors = Partial<Record<keyof InquiryDraft, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Three fields only. The wireframe asks for a calm form, and a wall of
 * required marks is the fastest way to lose the visitor.
 */
export function validate(draft: InquiryDraft, errors: Dict['inquiry']['errors']): FieldErrors {
  const found: FieldErrors = {}

  if (!draft.name.trim()) found.name = errors.name
  if (!draft.email.trim()) found.email = errors.email
  else if (!emailPattern.test(draft.email.trim())) found.email = errors.emailInvalid
  if (!draft.goal.trim()) found.goal = errors.goal

  return found
}

/** Names of configured questions that are required but unanswered. */
export function missingAnswers(
  draft: InquiryDraft,
  questions: { name: string; required: boolean }[],
): string[] {
  return questions
    .filter((q) => q.required && !String(draft.answers?.[q.name] ?? '').trim())
    .map((q) => q.name)
}

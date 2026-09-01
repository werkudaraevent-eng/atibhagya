'use server'

import type { Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'
import { missingAnswers, validate, type InquiryDraft } from '@/lib/inquiries'
import { getInquiryCopy } from '@/lib/content'
import { getPayloadSafe } from '@/lib/payload'

export type SubmitResult = { ok: true } | { ok: false; error: string }

const trim = (value: unknown, max = 5000) =>
  (typeof value === 'string' ? value : '').trim().slice(0, max)

/**
 * The form posts once. Validation runs again here because the client's copy of
 * it can be skipped, and the write goes through the Local API — which is why
 * `POST /api/inquiries` can stay closed to the public.
 */
export async function submitInquiry(
  locale: Locale,
  draft: InquiryDraft,
  /** Honeypot. A visitor never sees the field, so anything in it is a bot. */
  trap = '',
): Promise<SubmitResult> {
  const t = dict(locale).inquiry

  if (trap.trim() !== '') {
    console.warn('[atibhagya] Discarded an inquiry that filled the honeypot field.')
    // Answer as though it worked; a bot told it failed simply tries again.
    return { ok: true }
  }

  const errors = validate(draft, t.errors)
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: Object.values(errors)[0] as string }
  }

  // The questions are read from the CMS again here — the browser's copy of
  // which ones are required is not something to take on trust.
  const copy = await getInquiryCopy(locale)
  const missing = missingAnswers(draft, copy.questions)
  if (missing.length > 0) {
    const question = copy.questions.find((q) => q.name === missing[0])
    return { ok: false, error: `${question?.label ?? missing[0]} — ${t.errors.required}` }
  }

  const payload = await getPayloadSafe()
  if (!payload) {
    console.error('[atibhagya] An inquiry could not be stored — Payload is not configured.')
    return { ok: false, error: t.error }
  }

  try {
    // Slugs come from the browser, so they are resolved to real ids here
    // rather than trusted as references.
    const resolve = async (collection: 'products' | 'journeys', slugs: string[]) => {
      const wanted = slugs.map((s) => trim(s, 120)).filter(Boolean).slice(0, 20)
      if (wanted.length === 0) return []
      const found = await payload.find({
        collection,
        where: { slug: { in: wanted } },
        limit: 20,
        depth: 0,
      })
      return found.docs.map((d) => d.id)
    }

    const [products, journeys] = await Promise.all([
      resolve('products', draft.productSlugs),
      resolve('journeys', draft.journeySlugs),
    ])

    const data: Record<string, unknown> = {
      name: trim(draft.name, 120),
      email: trim(draft.email, 200),
      goal: trim(draft.goal, 2000),
      locale,
      products,
      journeys,
      customActivities: draft.customActivities
        .map((label) => trim(label, 200))
        .filter(Boolean)
        .slice(0, 10)
        .map((label) => ({ label })),
      // The label is stored alongside the answer so rewording the question
      // later does not rewrite what past visitors were actually asked.
      answers: copy.questions
        .map((q) => ({
          name: q.name,
          label: q.label,
          value: trim(draft.answers?.[q.name], 2000),
        }))
        .filter((a) => a.value),
    }

    const optional: [keyof InquiryDraft, number][] = [
      ['phone', 40],
      ['audience', 40],
      ['organisation', 160],
      ['pax', 40],
      ['preferredLocation', 160],
      ['preferredDate', 40],
      ['notes', 5000],
    ]

    for (const [key, max] of optional) {
      const value = trim(draft[key], max)
      if (value) data[key] = value
    }

    await payload.create({ collection: 'inquiries', data } as never)

    return { ok: true }
  } catch (err) {
    console.error('[atibhagya] Could not store an inquiry:', err)
    return { ok: false, error: t.error }
  }
}

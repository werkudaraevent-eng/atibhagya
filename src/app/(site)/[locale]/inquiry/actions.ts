'use server'

import { headers } from 'next/headers'

import { locales, type Locale } from '@/lib/content/types'
import { getInquiryCopy } from '@/lib/content'
import { dict } from '@/lib/i18n/ui'
import { TEXT_KINDS } from '@/lib/inquiry-fields'
import {
  DRAFT_KEY,
  PICK_KEY,
  validate,
  visibleFields,
  type InquiryDraft,
} from '@/lib/inquiries'
import { getPayloadSafe } from '@/lib/payload'
import { clientAddress, rateLimited } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

export type SubmitResult = { ok: true } | { ok: false; error: string }

/** Five inquiries from one address in ten minutes is plenty for a person. */
const LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }

const trim = (value: unknown, max = 5000) =>
  (typeof value === 'string' ? value : '').trim().slice(0, max)

const cleanSlugs = (slugs: unknown) =>
  (Array.isArray(slugs) ? slugs : [])
    .map((s) => trim(s, 120))
    .filter(Boolean)
    .slice(0, 20)

/**
 * The form posts once. Validation runs again here because the client's copy of
 * it can be skipped, and the write goes through the Local API — which is why
 * `POST /api/inquiries` can stay closed to the public.
 */
export async function submitInquiry(
  requested: Locale,
  draft: InquiryDraft,
  /** Honeypot. A visitor never sees the field, so anything in it is a bot. */
  trap = '',
  /** The Turnstile token, when the bot check is configured. */
  token = '',
  /** The event page the visitor came from; only a published event is linked. */
  eventSlug = '',
): Promise<SubmitResult> {
  // The locale arrives from the browser too; anything unknown is English.
  const locale: Locale = locales.includes(requested) ? requested : 'en'
  const t = dict(locale).inquiry

  if (trap.trim() !== '') {
    console.warn('[atibhagya] Discarded an inquiry that filled the honeypot field.')
    // Answer as though it worked; a bot told it failed simply tries again.
    return { ok: true }
  }

  const address = clientAddress(await headers())
  if (rateLimited(`inquiry:${address}`, LIMIT.max, LIMIT.windowMs)) {
    console.warn(`[atibhagya] Rate-limited inquiries from ${address}.`)
    return { ok: false, error: t.errors.tooMany }
  }

  if (!(await verifyTurnstile(String(token ?? ''), address))) {
    return { ok: false, error: t.errors.verify }
  }

  // The form is read from the CMS again here — the browser's copy of which
  // fields exist and which are required is not something to take on trust.
  const copy = await getInquiryCopy(locale)
  const errors = validate(draft, copy.fields, t.errors)
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: Object.values(errors)[0] as string }
  }

  const payload = await getPayloadSafe()
  if (!payload) {
    console.error('[atibhagya] An inquiry could not be stored — Payload is not configured.')
    return { ok: false, error: t.error }
  }

  try {
    // Slugs come from the browser, so they are resolved to real documents
    // here rather than trusted as references.
    const resolve = async (
      collection: 'products' | 'journeys' | 'product-categories',
      slugs: string[],
    ) => {
      if (slugs.length === 0) return []
      const found = await payload.find({
        collection,
        where: { slug: { in: slugs } },
        limit: 20,
        depth: 0,
        locale,
      })
      return found.docs as { id: string | number; title?: string; name?: string }[]
    }

    const data: Record<string, unknown> = { locale }
    const answers: { name: string; label: string; value: string }[] = []

    // Only what the form actually asked for is kept. A field the team has
    // removed — or one hidden by its rule — cannot be smuggled in by an old
    // draft or a crafted request.
    for (const field of visibleFields(draft, copy.fields)) {
      switch (field.kind) {
        case 'custom': {
          const value = trim(draft.answers?.[field.name], 2000)
          if (value) answers.push({ name: field.name, label: field.label, value })
          break
        }

        case 'ideas':
          data.customActivities = (draft.customActivities ?? [])
            .map((label) => trim(label, 200))
            .filter(Boolean)
            .slice(0, 10)
            .map((label) => ({ label }))
          break

        case 'pick': {
          const source = field.source ?? 'products'
          const slugs = cleanSlugs(draft[PICK_KEY[source]])

          if (source === 'products' || source === 'journeys') {
            data[source] = (await resolve(source, slugs)).map((d) => d.id)
          } else {
            // Categories have no column of their own; the names are kept as
            // an answer so the email and the record still say what was chosen.
            const names = (await resolve('product-categories', slugs))
              .map((d) => d.name ?? d.title ?? '')
              .filter(Boolean)
            if (names.length) {
              answers.push({ name: field.name, label: field.label, value: names.join(', ') })
            }
          }
          break
        }

        default: {
          const value = trim(draft[DRAFT_KEY[field.kind]], TEXT_KINDS[field.kind].max)
          if (value) data[DRAFT_KEY[field.kind]] = value
        }
      }
    }

    // Like the slugs above, the event comes from the browser: only a real,
    // published event is linked, and an unknown one is simply dropped.
    const eventKey = trim(eventSlug, 120)
    if (eventKey) {
      const found = await payload.find({
        collection: 'events',
        where: { and: [{ slug: { equals: eventKey } }, { _status: { equals: 'published' } }] },
        limit: 1,
        depth: 0,
      })
      const event = found.docs[0] as { id: string | number } | undefined
      if (event) data.event = event.id
    }

    // The collection insists on a name; a form without that field stores the
    // address in its place so the inquiry still has a title in the admin.
    if (!data.name) data.name = data.email

    // The label is stored alongside each answer so rewording the question
    // later does not rewrite what past visitors were actually asked.
    data.answers = answers

    await payload.create({ collection: 'inquiries', data } as never)

    return { ok: true }
  } catch (err) {
    console.error('[atibhagya] Could not store an inquiry:', err)
    return { ok: false, error: t.error }
  }
}

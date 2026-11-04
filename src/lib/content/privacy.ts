import type { Privacy } from '../../payload-types'
import { isProduction } from '../env'
import { getPayloadSafe } from '../payload'
import { DEFAULT_RETENTION_MONTHS, privacyDefaults, type PrivacyContent } from './privacy-defaults'
import type { Locale } from './types'

const text = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() !== '' ? value : fallback

/** Whole months between 1 and 120; anything else keeps the default. */
export const retentionMonthsOf = (value: unknown): number => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isInteger(n) && n >= 1 && n <= 120 ? n : DEFAULT_RETENTION_MONTHS
}

/**
 * The privacy policy, published (or the draft, for the admin's preview).
 * Mirrors the other page readers: an empty field keeps the approved copy,
 * and a failed read falls back outside production and throws inside it.
 */
export async function getPrivacy(
  locale: Locale,
  options: { draft?: boolean } = {},
): Promise<PrivacyContent> {
  const fallback = privacyDefaults(locale)
  const payload = await getPayloadSafe()
  if (!payload) return fallback

  try {
    const doc: Privacy = await payload.findGlobal({
      slug: 'privacy',
      locale,
      depth: 0,
      fallbackLocale: 'en',
      draft: options.draft === true,
    })
    const sections = (doc.sections ?? [])
      .map((s) => ({ heading: text(s.heading, ''), body: text(s.body, '') }))
      .filter((s) => s.heading && s.body)

    return {
      meta: {
        title: text(doc.metaTitle, fallback.meta.title),
        description: text(doc.metaDescription, fallback.meta.description),
      },
      eyebrow: text(doc.eyebrow, fallback.eyebrow),
      headline: text(doc.headline, fallback.headline),
      lede: text(doc.lede, fallback.lede),
      updated: text(doc.updated, fallback.updated).slice(0, 10),
      sections: sections.length ? sections : fallback.sections,
      retentionMonths: retentionMonthsOf(doc.retentionMonths),
    }
  } catch (err) {
    if (isProduction) throw err
    console.warn('[atibhagya] CMS read failed, using default privacy policy:', err)
    return fallback
  }
}

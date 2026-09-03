import type { GlobalAfterReadHook } from 'payload'

import type { Locale } from './content/types'

/**
 * What the admin shows for a field the team has never filled.
 *
 * The site never renders a blank: every getter in `src/lib/content` lays
 * the CMS over the approved copy, so an empty box in the admin still means
 * a full sentence on the page. Left as a blank box, that is a trap — the
 * editor cannot see what is there to change, and "empty keeps the default"
 * has to be explained over and over. These hooks fill each empty field, on
 * read, with exactly what the site is showing for it; the first Publish
 * then makes that explicit. Nothing changes on the site.
 */

/** Produces a field's value for the locale the document is being read in. */
type Pick = (locale: string | undefined) => unknown

const asLocale = (locale?: string): Locale => (locale === 'id' ? 'id' : 'en')

/** A localized value as Payload expects it: one locale's value, or `{en, id}` for `all`. */
const shaped = (locale: string | undefined, of: (l: Locale) => unknown) =>
  locale === 'all' ? { en: of('en'), id: of('id') } : of(asLocale(locale))

/** A localized text field. */
export const text =
  (of: (l: Locale) => string | undefined): Pick =>
  (locale) =>
    shaped(locale, of)

/** A field that is the same in every language. */
export const plain =
  (of: () => unknown): Pick =>
  () =>
    of()

/**
 * An array field whose rows carry localized text: the rows come from the
 * English copy, each text shaped for the locale being read.
 */
export const rows =
  (of: (l: Locale) => Record<string, unknown>[]): Pick =>
  (locale) =>
    of('en').map((row, i) =>
      Object.fromEntries(
        Object.keys(row).map((key) => [key, shaped(locale, (l) => of(l)[i]?.[key] ?? row[key])]),
      ),
    )

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

/** An `afterRead` hook that fills every listed field that is empty. */
export const prefillGlobal =
  (map: Record<string, Pick>): GlobalAfterReadHook =>
  ({ doc, req }) => {
    if (!doc) return doc
    for (const [key, pick] of Object.entries(map)) {
      if (isEmpty(doc[key])) doc[key] = pick(req.locale)
    }
    return doc
  }

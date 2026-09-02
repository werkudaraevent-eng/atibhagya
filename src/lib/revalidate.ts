import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/**
 * Tells Next to rebuild the pages a change touches, so a publish is live in
 * seconds rather than waiting out the 300-second ISR window.
 *
 * `revalidatePath` only exists inside the Next runtime. Payload also runs from
 * the seed and import scripts, where it would throw — hence the guard.
 */
async function revalidate(paths: string[]) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of paths) revalidatePath(path)
  } catch {
    // Outside Next (scripts, tests): nothing to revalidate.
  }
}

/**
 * The route for a path in each language.
 *
 * Every page lives under `/[locale]`, so the cache entry for the English
 * home page is `/en`, not `/` — `/` is only a rewrite onto it. Revalidating
 * `/` cleared nothing, and a publish took up to five minutes to show.
 * The bare English path is included too, in case a proxy cached it.
 */
const both = (path: string) => {
  const tail = path === '/' ? '' : path
  return [`/en${tail}`, `/id${tail}`, path]
}

/** Product and journey documents: their own page, the listing, and home. */
export const revalidateCatalogue =
  (section: 'product' | 'journey'): CollectionAfterChangeHook =>
  async ({ doc, previousDoc }) => {
    const slugs = new Set<string>()
    if (doc?.slug) slugs.add(doc.slug)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) slugs.add(previousDoc.slug)

    await revalidate([
      ...both('/'),
      ...both(`/${section}`),
      ...[...slugs].flatMap((slug) => both(`/${section}/${slug}`)),
    ])
    return doc
  }

/**
 * Master data — a venue, a facilitator, a photograph — appears on pages that
 * cannot be enumerated from here, so every page under the locale layout is
 * rebuilt on next request rather than a guessed subset.
 */
export const revalidateEverything: CollectionAfterChangeHook = async ({ doc }) => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/[locale]', 'layout')
  } catch {
    // Outside Next (scripts, tests): nothing to revalidate.
  }
  return doc
}

/** A global maps to a handful of known routes. */
export const revalidateGlobal =
  (paths: string[]): GlobalAfterChangeHook =>
  async ({ doc }) => {
    await revalidate(paths.flatMap(both))
    return doc
  }

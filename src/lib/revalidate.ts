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

const both = (path: string) => [path, `/id${path === '/' ? '' : path}`]

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

/** Master data is shown inside product pages, so all of those go. */
export const revalidateEverything: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidate(['/', '/id'])
  await revalidate(both('/product'))
  await revalidate(both('/journey'))
  return doc
}

/** A global maps to a handful of known routes. */
export const revalidateGlobal =
  (paths: string[]): GlobalAfterChangeHook =>
  async ({ doc }) => {
    await revalidate(paths.flatMap(both))
    return doc
  }

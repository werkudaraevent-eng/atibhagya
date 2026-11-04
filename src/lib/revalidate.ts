import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

/**
 * Tells Next to rebuild the pages a change touches, so a publish is live in
 * seconds rather than waiting out the 300-second ISR window.
 *
 * Two kinds of address are given for every change, because they clear
 * different things:
 *
 *   - the route pattern, as Next names it (`/[locale]/product/[slug]`), with
 *     type `page`: this is what actually drops the prerendered copies on
 *     Vercel. A pattern covers every page of that route, which is fine —
 *     they come back one by one, on their next visit;
 *   - the concrete path in each language (`/en/product/agni-hotra`), for
 *     the on-demand entries and any proxy in front.
 *
 * Asking only for the `/[locale]` layout, or only for `/`, looked right and
 * cleared nothing; a changed footer took five minutes to show.
 *
 * `revalidatePath` only exists inside the Next runtime. Payload also runs
 * from the seed and import scripts, where it would throw — hence the guard.
 */
async function revalidate(paths: string[], patterns: string[]) {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const pattern of new Set(patterns)) revalidatePath(pattern, 'page')
    for (const path of new Set(paths)) revalidatePath(path)
  } catch {
    // Outside Next (scripts, tests): nothing to revalidate.
  }
}

/** The concrete path in each language; `/` is a rewrite onto `/en`. */
const both = (path: string) => {
  const tail = path === '/' ? '' : path
  return [`/en${tail}`, `/id${tail}`, path]
}

/**
 * The route patterns a section's pages live at: its list and its detail.
 * The home page is a section of its own, with no detail.
 */
const SECTIONS = ['product', 'journey', 'events'] as const
type Section = (typeof SECTIONS)[number]

const patternsFor = (path: string): string[] => {
  if (path === '/') return ['/[locale]']
  const section = path.replace(/^\//, '')
  if ((SECTIONS as readonly string[]).includes(section)) {
    return [`/[locale]/${section}`, `/[locale]/${section}/[slug]`]
  }
  return [`/[locale]${path}`]
}

/** Every route the site has. */
const EVERY_PATTERN = [
  '/[locale]',
  ...SECTIONS.flatMap((s) => patternsFor(`/${s}`)),
  '/[locale]/about',
  '/[locale]/inquiry',
  '/[locale]/privacy',
]

const EVERY_PATH = ['/', '/product', '/journey', '/events', '/about', '/inquiry', '/privacy'].flatMap(both)

/**
 * A product, journey or event document. Its own page and its list, the
 * home page (featured products, the season's chapter), and the pages that
 * quote it: a product is named inside journey days and event itineraries,
 * a journey inside event pages, so those come back too.
 */
export const revalidateCatalogue =
  (section: Section): CollectionAfterChangeHook =>
  async ({ doc, previousDoc }) => {
    const slugs = new Set<string>()
    if (doc?.slug) slugs.add(doc.slug)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) slugs.add(previousDoc.slug)

    const quotedBy: Section[] =
      section === 'product' ? ['journey', 'events'] : section === 'journey' ? ['events'] : []

    await revalidate(
      [...both('/'), ...both(`/${section}`), ...[...slugs].flatMap((slug) => both(`/${section}/${slug}`))],
      ['/[locale]', ...patternsFor(`/${section}`), ...quotedBy.flatMap((s) => patternsFor(`/${s}`))],
    )
    return doc
  }

/**
 * Master data — a venue, a facilitator, a photograph, a category, an event
 * in the menu — appears on pages that cannot be enumerated from here, so
 * every page is rebuilt on its next visit.
 */
export const revalidateEverything: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidate(EVERY_PATH, EVERY_PATTERN)
  return doc
}

/**
 * Site settings sit in the header and footer of every page — the menu
 * words, the contact details, the social links, the event link.
 */
export const revalidateEverythingGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidate(EVERY_PATH, EVERY_PATTERN)
  return doc
}

/**
 * A page global maps to its own routes. A catalogue heading also sits on
 * every detail page (the breadcrumb, the eyebrow), so a section's pattern
 * always includes its detail route.
 */
export const revalidateGlobal =
  (paths: string[]): GlobalAfterChangeHook =>
  async ({ doc }) => {
    await revalidate(paths.flatMap(both), paths.flatMap(patternsFor))
    return doc
  }

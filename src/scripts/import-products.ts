/**
 * Bulk-imports the product catalogue from a JSON file.
 *
 *   npm run import:products                  # reads data/products.json
 *   npm run import:products -- path/to.json
 *
 * Upserts by slug, so it is safe to run again after editing the file: existing
 * products are updated in place, new ones are created, and nothing is deleted.
 * Categories and venues named in the file are created when they do not exist
 * yet, which keeps the master data in step with the catalogue.
 *
 * Images are not imported. Upload photography to the `media` collection and
 * attach it in the admin — a brochure export has no usable image references.
 *
 * File shape (see data/products.example.json):
 *
 *   [
 *     {
 *       "slug": "agni-hotra",
 *       "category": "Mind, Body & Spirit",
 *       "venues": ["Om Ham Resort", "Anand Ashram"],
 *       "durationText": "60 Minutes",
 *       "facilities": ["Offering Ritual", "Traditional Cloth"],
 *       "suitableFor": ["solo", "group", "corporate"],
 *       "featured": true,
 *       "en": { "title": "Agni Hotra", "subtitle": "…", "description": "…", "highlightText": "…" },
 *       "id": { "title": "Agni Hotra", "subtitle": "…", "description": "…", "highlightText": "…" }
 *     }
 *   ]
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import { guessElement, isElement } from '../lib/elements'
import config from '../payload.config'

type Localized = {
  title?: string
  subtitle?: string
  description?: string
  highlightText?: string
  whatToExpect?: string
  durationText?: string
  facilities?: string[]
}

type Row = Localized & {
  slug: string
  code?: string | null
  category?: string
  categorySlug?: string
  venues?: string[]
  suitableFor?: string[]
  /** One of earth/water/fire/air/ether; guessed from the text when absent. */
  element?: string
  featured?: boolean
  order?: number
  en?: Localized
  id?: Localized
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Looks a master record up by name, creating it the first time it is seen. */
async function ensure(
  payload: Payload,
  collection: 'product-categories' | 'venues',
  name: string,
  cache: Map<string, unknown>,
  extra: Record<string, unknown> = {},
) {
  const key = name.trim().toLowerCase()
  const cached = cache.get(key)
  if (cached) return cached

  const found = await payload.find({
    collection,
    limit: 1,
    depth: 0,
    where: collection === 'venues' ? { name: { equals: name } } : { slug: { equals: slugify(name) } },
  })

  if (found.docs[0]) {
    cache.set(key, found.docs[0].id)
    return found.docs[0].id
  }

  const created = await payload.create({
    collection,
    locale: 'en',
    data: { name, ...extra } as never,
  })
  console.log(`  + created ${collection}: ${name}`)
  cache.set(key, created.id)
  return created.id
}

const localeData = (row: Row, side: Localized | undefined) => {
  const merged: Localized = { ...row, ...(side ?? {}) }
  const data: Record<string, unknown> = {}

  if (merged.title) data.title = merged.title
  if (merged.subtitle) data.subtitle = merged.subtitle
  if (merged.description) data.description = merged.description
  if (merged.highlightText) data.highlightText = merged.highlightText
  if (merged.whatToExpect) data.whatToExpect = merged.whatToExpect
  if (merged.durationText) data.durationText = merged.durationText
  if (merged.facilities?.length) {
    data.facilities = merged.facilities.map((label) => ({ label }))
  }

  return data
}

async function run() {
  const target = process.argv[2] ?? 'data/products.json'
  const file = path.resolve(process.cwd(), target)

  if (!fs.existsSync(file)) {
    console.error(`No file at ${file}.`)
    console.error('Copy data/products.example.json, fill it in, and run again.')
    process.exit(1)
  }

  const rows = JSON.parse(fs.readFileSync(file, 'utf8')) as Row[]
  if (!Array.isArray(rows)) {
    console.error('The file must contain a JSON array of products.')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const categoryCache = new Map<string, unknown>()
  const venueCache = new Map<string, unknown>()

  let created = 0
  let updated = 0
  const problems: string[] = []

  for (const [index, row] of rows.entries()) {
    const slug = row.slug?.trim() || slugify(row.en?.title ?? row.title ?? '')
    if (!slug) {
      problems.push(`Row ${index + 1}: no slug and no English title to derive one from.`)
      continue
    }

    const englishTitle = row.en?.title ?? row.title
    if (!englishTitle) {
      problems.push(`${slug}: no English title.`)
      continue
    }

    const categoryName = row.category ?? row.categorySlug
    const categoryId = categoryName
      ? await ensure(payload, 'product-categories', categoryName, categoryCache, {
          slug: row.categorySlug ? slugify(row.categorySlug) : slugify(categoryName),
        })
      : undefined

    const venueIds: unknown[] = []
    for (const venue of row.venues ?? []) {
      venueIds.push(await ensure(payload, 'venues', venue, venueCache))
    }

    const base = {
      ...localeData(row, row.en),
      slug,
      ...(row.code ? { code: row.code } : {}),
      featured: row.featured ?? false,
      // Drafts are on, so an import has to say it is publishing.
      _status: 'published',
      order: row.order ?? index,
      suitableFor: row.suitableFor ?? [],
      element: isElement(row.element)
        ? row.element
        : guessElement(
            [row.en?.title ?? row.title, row.en?.subtitle ?? row.subtitle, row.en?.highlightText ?? row.highlightText, row.en?.description ?? row.description]
              .filter(Boolean)
              .join(' '),
            row.categorySlug ? slugify(row.categorySlug) : categoryName ? slugify(categoryName) : undefined,
          ),
      venues: venueIds,
      ...(categoryId ? { category: categoryId } : {}),
    }

    const existing = await payload.find({
      collection: 'products',
      limit: 1,
      depth: 0,
      where: { slug: { equals: slug } },
    })

    let id: string | number
    if (existing.docs[0]) {
      const doc = await payload.update({
        collection: 'products',
        id: existing.docs[0].id,
        locale: 'en',
        data: base as never,
      })
      id = doc.id
      updated++
    } else {
      const doc = await payload.create({
        collection: 'products',
        locale: 'en',
        data: base as never,
      })
      id = doc.id
      created++
    }

    if (row.id) {
      // Array rows are keyed by id, so the English rows are read back first —
      // otherwise the Indonesian pass would replace them and lose both.
      const saved = (await payload.findByID({
        collection: 'products',
        id,
        locale: 'en',
        depth: 0,
      })) as unknown as Record<string, any>

      const translated = localeData(row, row.id)
      if (Array.isArray(translated.facilities) && Array.isArray(saved.facilities)) {
        translated.facilities = (translated.facilities as { label: string }[]).map((f, i) =>
          saved.facilities[i]?.id ? { ...f, id: saved.facilities[i].id } : f,
        )
      }

      await payload.update({
        collection: 'products',
        id,
        locale: 'id',
        data: translated as never,
      })
    }
  }

  console.log(`\nImported ${rows.length} rows — ${created} created, ${updated} updated.`)
  if (problems.length) {
    console.log(`\nSkipped ${problems.length}:`)
    problems.forEach((p) => console.log('  - ' + p))
  }
  console.log('\nImages are not imported. Attach photography in the admin.')
  process.exit(problems.length ? 1 : 0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

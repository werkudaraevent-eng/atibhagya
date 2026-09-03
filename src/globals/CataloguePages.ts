import type { GlobalConfig } from 'payload'

import { stampUpdatedByGlobal, updatedBy } from '../lib/audit'
import { dict } from '../lib/i18n/ui'
import { prefillGlobal, text as shows } from '../lib/prefill'
import { revalidateGlobal } from '../lib/revalidate'

const text = (name: string, description?: string) => ({
  name,
  type: 'text' as const,
  localized: true,
  ...(description ? { admin: { description } } : {}),
})

/**
 * The words at the top of the product and journey pages.
 *
 * Products and journeys are collections, so their listing and detail pages
 * have no document of their own to hold a heading — this global is that
 * document. Anything left empty falls back to the approved copy in
 * `src/lib/i18n/ui.ts`.
 */
export const CataloguePages: GlobalConfig = {
  slug: 'catalogue',
  label: 'Product & journey pages',
  admin: {
    group: 'Pages',
    description:
      'Headings for the product and journey listings and the small label above each detail page. Each box shows what the site currently says; change it, or clear it to return to the approved wording.',
  },
  access: { read: () => true },
  hooks: {
    // Every box shows what the site currently uses; see src/lib/prefill.ts.
    afterRead: [
      prefillGlobal({
        productsEyebrow: shows((l) => dict(l).products.eyebrow),
        productsHeadline: shows((l) => dict(l).products.headline),
        productsIntro: shows((l) => dict(l).products.intro),
        productDetailEyebrow: shows((l) => dict(l).products.detailEyebrow),
        journeysEyebrow: shows((l) => dict(l).journeys.eyebrow),
        journeysHeadline: shows((l) => dict(l).journeys.headline),
        journeysIntro: shows((l) => dict(l).journeys.intro),
        journeyDetailEyebrow: shows((l) => dict(l).journeys.detailEyebrow),
      }),
    ],
    beforeChange: [stampUpdatedByGlobal],
    afterChange: [revalidateGlobal(['/product', '/journey'])],
  },
  versions: { drafts: true, max: 50 },
  fields: [
    updatedBy,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product listing',
          fields: [
            text('productsEyebrow', 'The small label above the heading.'),
            {
              name: 'productsHeadline',
              type: 'textarea',
              localized: true,
              admin: { description: 'Line breaks are kept.' },
            },
            { name: 'productsIntro', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Product detail',
          fields: [
            text(
              'productDetailEyebrow',
              'The first step of the breadcrumb above a product title — it links back to the listing. Default "Product".',
            ),
          ],
        },
        {
          label: 'Journey listing',
          fields: [
            text('journeysEyebrow', 'The small label above the heading.'),
            {
              name: 'journeysHeadline',
              type: 'textarea',
              localized: true,
              admin: { description: 'Line breaks are kept.' },
            },
            { name: 'journeysIntro', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Journey detail',
          fields: [
            text(
              'journeyDetailEyebrow',
              'The first step of the breadcrumb above a journey title — it links back to the listing. Default "Journey".',
            ),
          ],
        },
      ],
    },
  ],
}

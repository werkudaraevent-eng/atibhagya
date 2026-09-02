import type { GlobalConfig } from 'payload'

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
      'Headings for the product and journey listings and the small label above each detail page. Leave a field empty to keep the approved wording.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(['/product', '/journey'])] },
  versions: { drafts: true, max: 50 },
  fields: [
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

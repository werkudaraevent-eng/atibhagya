import type { CollectionConfig } from 'payload'

import { revalidateCatalogue } from '../lib/revalidate'
import { webImage } from '../lib/validate-media'
import { adminOnly, signedIn } from './Users'

/**
 * A journey is an itinerary, not a package. Days hold items; an item may point
 * at a product, a venue and facilitators — or stay entirely custom, which the
 * ERD calls out explicitly.
 *
 * Days and items are nested arrays rather than separate collections. Payload
 * still stores them as child tables with their own ordering, so the physical
 * model matches the ERD while editors keep one screen.
 */
export const Journeys: CollectionConfig = {
  slug: 'journeys',
  admin: {
    group: 'Experiences',
    useAsTitle: 'title',
    defaultColumns: ['title', 'durationText', '_status', 'order'],
    listSearchableFields: ['title', 'positioning', 'slug'],
    description: 'Multi-day itineraries. Days hold activities; an activity may point at a product, or stay custom.',
    preview: (doc) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/journey/${doc.slug}`,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: signedIn,
    update: signedIn,
    delete: adminOnly,
  },

  defaultSort: 'order',
  hooks: { afterChange: [revalidateCatalogue('journey')] },
  versions: {
    // Save Draft / Publish, with history and revert. 50 versions per document
    // keeps the table from growing without bound.
    drafts: true,
    maxPerDoc: 50,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Story',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            {
              name: 'positioning',
              type: 'textarea',
              localized: true,
              admin: { description: 'The short line that explains the arc of the experience.' },
            },
            { name: 'description', type: 'textarea', localized: true },
            {
              name: 'summary',
              type: 'text',
              localized: true,
              admin: { description: 'Duration and location summary shown on the listing card.' },
            },
          ],
        },
        {
          label: 'Itinerary',
          fields: [
            {
              name: 'days',
              type: 'array',
              labels: { singular: 'Day', plural: 'Days' },
              admin: {
                description: 'The day timeline doubles as navigation on the detail page.',
                components: { RowLabel: '@/admin/RowLabel#RowLabel' },
              },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'note', type: 'textarea', localized: true },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Activity', plural: 'Activities' },
                  admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
                  fields: [
                    { name: 'time', type: 'text', admin: { description: 'e.g. 09:00' } },
                    { name: 'title', type: 'text', required: true, localized: true },
                    {
                      name: 'product',
                      type: 'relationship',
                      relationTo: 'products',
                      admin: { description: 'Optional — leave empty for a custom activity.' },
                    },
                    { name: 'venue', type: 'relationship', relationTo: 'venues' },
                    {
                      name: 'facilitators',
                      type: 'relationship',
                      relationTo: 'facilitators',
                      hasMany: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Overview',
          fields: [
            { name: 'durationText', type: 'text', localized: true },
            {
              name: 'facilities',
              type: 'array',
              admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
              labels: { singular: 'Facility', plural: 'Facilities' },
              fields: [{ name: 'label', type: 'text', required: true, localized: true }],
            },
            {
              name: 'inclusions',
              type: 'array',
              admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
              fields: [{ name: 'label', type: 'text', required: true, localized: true }],
            },
            {
              name: 'exclusions',
              type: 'array',
              admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
              fields: [{ name: 'label', type: 'text', required: true, localized: true }],
            },
            { name: 'suggestedPax', type: 'text', localized: true },
            { name: 'locationPreference', type: 'text', localized: true },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'heroImage', type: 'upload', relationTo: 'media', validate: webImage },
            {
              name: 'gallery',
              type: 'array',
              maxRows: 8,
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true, validate: webImage },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}

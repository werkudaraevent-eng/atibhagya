import type { CollectionConfig } from 'payload'

import { stampUpdatedBy, updatedBy, versionsView } from '../lib/audit'
import { revalidateCatalogue } from '../lib/revalidate'
import { serverURL } from '../lib/server-url'
import { webImage } from '../lib/validate-media'
import { adminOnly, contentEditors } from '../lib/access'

/**
 * The centre of the content model. Everything else — categories, venues,
 * facilitators — exists so a product can point at it, and the homepage only
 * chooses which products to feature.
 *
 * Note there is no price field. The content master lists pricing structure
 * among the things still to be confirmed before publishing, so the model does
 * not invite anyone to publish one yet.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Experiences',
    useAsTitle: 'title',
    defaultColumns: ['code', 'title', 'category', 'suitableFor', '_status', 'updatedBy', 'updatedAt'],
    // With a catalogue this size, editors find a product by typing, not by
    // scrolling.
    listSearchableFields: ['title', 'subtitle', 'slug', 'description'],
    pagination: { defaultLimit: 25, limits: [25, 50, 100] },
    description: 'Each experience in the catalogue. The reference code matches the printed catalogue.',
    preview: (doc) => `${serverURL}/product/${doc.slug}`,
    components: versionsView,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: contentEditors,
    update: contentEditors,
    delete: adminOnly,
  },

  defaultSort: 'order',
  hooks: { beforeChange: [stampUpdatedBy], afterChange: [revalidateCatalogue('product')] },
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
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. "Fire Blessing Ritual"' },
            },
            { name: 'description', type: 'textarea', required: true, localized: true },
            {
              name: 'highlightText',
              type: 'textarea',
              localized: true,
              admin: {
                description:
                  'The benefit line pulled out as a quote, as on the brochure — e.g. "Releases unwanted energy/aspects, helps manifest new intentions."',
              },
            },
          ],
        },
        {
          label: 'Programme',
          fields: [
            {
              name: 'durationText',
              type: 'text',
              localized: true,
              admin: { description: 'Free text — "60 min", "Half day". Kept loose on purpose.' },
            },
            {
              name: 'facilities',
              type: 'array',
              labels: { singular: 'Facility', plural: 'Facilities' },
              admin: { components: { RowLabel: '@/admin/RowLabel#RowLabel' } },
              fields: [{ name: 'label', type: 'text', required: true, localized: true }],
            },
            { name: 'whatToExpect', type: 'textarea', localized: true },
          ],
        },
        {
          label: 'Places & people',
          fields: [
            {
              name: 'venues',
              type: 'relationship',
              relationTo: 'venues',
              hasMany: true,
              admin: { description: 'A product may run at several venues, or none yet.' },
            },
            {
              name: 'facilitators',
              type: 'relationship',
              relationTo: 'facilitators',
              hasMany: true,
              admin: { description: 'Optional. The section only renders when this is filled.' },
            },
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
              admin: { description: 'Fewer and larger. One main image plus detail and place shots.' },
            },
          ],
        },
      ],
    },
    {
      name: 'code',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Catalogue reference, e.g. WEL-001 — keeps the site and the printed catalogue in step.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      admin: { position: 'sidebar' },
    },
    {
      // Drives the "For …" filter on the listing, so it sits in the sidebar
      // beside category rather than buried in a tab.
      name: 'suitableFor',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Solo', value: 'solo' },
        { label: 'Couple', value: 'couple' },
        { label: 'Group', value: 'group' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Community', value: 'community' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Who the experience suits. Shown as the "For" filter on the site.',
      },
    },
    {
      name: 'element',
      type: 'select',
      options: [
        { label: 'Earth · Pertiwi', value: 'earth' },
        { label: 'Water · Apah', value: 'water' },
        { label: 'Fire · Teja', value: 'fire' },
        { label: 'Air · Bayu', value: 'air' },
        { label: 'Space · Akasa', value: 'ether' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Which of the five elements the experience belongs to. Shown as a mark on the listing and the page, and as the "Element" filter. Empty: guessed from the category.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'e.g. agni-hotra' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Eligible for the homepage selection.' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    updatedBy,
  ],
}

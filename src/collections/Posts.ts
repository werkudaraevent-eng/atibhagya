import type { CollectionConfig } from 'payload'

import { adminOnly, signedIn } from './Users'

/**
 * Phase 2 — the journal. The model is in place now so editors can start
 * writing; the front end is built later.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Journal (phase 2)',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
    description: 'Not yet rendered on the site — the journal front end ships in phase 2.',
  },
  access: {
    // Drafts are staff-only. Without this the REST and GraphQL APIs hand
    // unpublished writing to anyone who asks for /api/posts.
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: signedIn,
    update: signedIn,
    delete: adminOnly,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}

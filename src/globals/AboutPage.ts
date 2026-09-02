import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../lib/revalidate'
import { webImage } from '../lib/validate-media'

/**
 * About is the most reading-heavy page and stays a singleton: one calm block,
 * then another, then a reflective statement.
 */
export const AboutPage: GlobalConfig = {
  slug: 'about',
  label: 'About page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(['/about'])] },
  versions: {
    // Save Draft / Publish, with history and revert. 50 versions per document
    // keeps the table from growing without bound.
    drafts: true,
    max: 50,
  },

  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    {
      name: 'headline',
      type: 'textarea',
      localized: true,
      admin: { description: 'Line breaks are kept.' },
    },
    { name: 'lede', type: 'textarea', localized: true },
    {
      name: 'body',
      type: 'array',
      labels: { singular: 'Paragraph block', plural: 'Paragraph blocks' },
      fields: [{ name: 'text', type: 'textarea', required: true, localized: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media', validate: webImage },
    {
      name: 'statement',
      type: 'textarea',
      localized: true,
      admin: { description: 'The reflective line that closes the story.' },
    },
    {
      name: 'values',
      type: 'array',
      maxRows: 3,
      admin: { description: 'Calm, clarity, care.' },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'caption', type: 'text', required: true, localized: true },
      ],
    },
    { name: 'ctaHeadline', type: 'text', localized: true },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'metaTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'textarea', localized: true },
  ],
}

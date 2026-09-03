import type { GlobalConfig } from 'payload'

import { stampUpdatedByGlobal, updatedBy, versionsView } from '../lib/audit'
import { defaults } from '../lib/content/defaults'
import { prefillGlobal, rows, text } from '../lib/prefill'
import { revalidateGlobal } from '../lib/revalidate'
import { webImage } from '../lib/validate-media'

/**
 * About is the most reading-heavy page and stays a singleton: one calm block,
 * then another, then a reflective statement.
 */
export const AboutPage: GlobalConfig = {
  slug: 'about',
  label: 'About page',
  admin: { group: 'Pages', components: versionsView },
  access: { read: () => true },
  hooks: {
    // Every box shows what the site currently uses; see src/lib/prefill.ts.
    afterRead: [
      prefillGlobal({
        metaTitle: text((l) => defaults(l).about.meta.title),
        metaDescription: text((l) => defaults(l).about.meta.description),
        eyebrow: text((l) => defaults(l).about.eyebrow),
        headline: text((l) => defaults(l).about.headline),
        lede: text((l) => defaults(l).about.lede),
        body: rows((l) => defaults(l).about.body.map((paragraph) => ({ text: paragraph }))),
        statement: text((l) => defaults(l).about.statement),
        values: rows((l) => defaults(l).about.values),
        ctaHeadline: text((l) => defaults(l).about.ctaHeadline),
        ctaLabel: text((l) => defaults(l).about.ctaLabel),
      }),
    ],
    beforeChange: [stampUpdatedByGlobal],
    afterChange: [revalidateGlobal(['/about'])],
  },
  versions: {
    // Save Draft / Publish, with history and revert. 50 versions per document
    // keeps the table from growing without bound.
    drafts: true,
    max: 50,
  },

  fields: [
    updatedBy,
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

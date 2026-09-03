import type { GlobalConfig } from 'payload'

import { stampUpdatedByGlobal, updatedBy } from '../lib/audit'
import { defaults } from '../lib/content/defaults'
import { plain, prefillGlobal, rows, text } from '../lib/prefill'
import { revalidateGlobal } from '../lib/revalidate'
import { videoFile, webImage } from '../lib/validate-media'

/**
 * Home is a singleton, per the ERD. It holds its own copy and chooses which
 * products to feature — it does not own them.
 */
export const HomePage: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: {
    // Every box shows what the site currently uses; see src/lib/prefill.ts.
    afterRead: [
      prefillGlobal({
        metaTitle: text((l) => defaults(l).home.meta.title),
        metaDescription: text((l) => defaults(l).home.meta.description),
        heroEyebrow: text((l) => defaults(l).home.hero.eyebrow),
        heroHeadline: text((l) => defaults(l).home.hero.headline),
        heroStatement: text((l) => defaults(l).home.hero.statement),
        heroCtaLabel: text((l) => defaults(l).home.hero.ctaLabel),
        heroDarken: plain(() => Math.round(defaults('en').home.hero.darken * 100)),
        whyEyebrow: text((l) => defaults(l).home.why.eyebrow),
        whyHeadline: text((l) => defaults(l).home.why.headline),
        whyBody: text((l) => defaults(l).home.why.body),
        pillars: rows((l) => defaults(l).home.why.pillars),
        featuredEyebrow: text((l) => defaults(l).home.featured.eyebrow),
        featuredHeadline: text((l) => defaults(l).home.featured.headline),
        ctaHeadline: text((l) => defaults(l).home.cta.headline),
        ctaBody: text((l) => defaults(l).home.cta.body),
        ctaLabel: text((l) => defaults(l).home.cta.label),
      }),
    ],
    beforeChange: [stampUpdatedByGlobal],
    afterChange: [revalidateGlobal(['/'])],
  },
  versions: {
    // Save Draft / Publish, with history and revert. 50 versions per document
    // keeps the table from growing without bound.
    drafts: true,
    max: 50,
  },

  fields: [
    updatedBy,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Opening',
          fields: [
            { name: 'heroEyebrow', type: 'text', localized: true },
            {
              name: 'heroHeadline',
              type: 'textarea',
              localized: true,
              admin: { description: 'Line breaks are kept — they set the shape of the headline.' },
            },
            { name: 'heroStatement', type: 'textarea', localized: true },
            { name: 'heroCtaLabel', type: 'text', localized: true },
            { name: 'heroImage', type: 'upload', relationTo: 'media', validate: webImage },
            {
              name: 'heroDarken',
              type: 'number',
              label: 'Darken photograph',
              min: 0,
              max: 100,
              defaultValue: 35,
              admin: {
                description:
                  '0–100. How much the photograph is toned down behind the headline so white type stays legible. A dusk photograph with quiet sky needs 10–20; a bright, busy one like foliage or water in sun needs 45–60. Watch the preview while you change it.',
              },
            },
            {
              name: 'heroVideoFile',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { in: ['video/mp4', 'video/webm'] } },
              validate: videoFile,
              admin: {
                description:
                  'Optional. A short silent loop that plays over the hero image on larger screens; phones, slow connections and visitors who prefer reduced motion see the image instead, and it is the poster while the video loads. Export: MP4 (H.264), 1920×1080, 10–15 s, ~4 Mbps, no audio, under 12 MB.',
              },
            },
            {
              name: 'heroVideo',
              type: 'text',
              admin: {
                description:
                  '…or a URL to an MP4/WebM hosted elsewhere. Ignored when a file is uploaded above.',
              },
            },
          ],
        },
        {
          label: 'Why Atibhagya',
          fields: [
            { name: 'whyEyebrow', type: 'text', localized: true },
            { name: 'whyHeadline', type: 'textarea', localized: true },
            { name: 'whyBody', type: 'textarea', localized: true },
            {
              name: 'pillars',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Nature, stillness, cultural wisdom — the brand pillars.' },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'body', type: 'textarea', required: true, localized: true },
              ],
            },
          ],
        },
        {
          label: 'Selected experiences',
          fields: [
            { name: 'featuredEyebrow', type: 'text', localized: true },
            { name: 'featuredHeadline', type: 'text', localized: true },
            {
              name: 'featuredProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 6,
              admin: { description: 'Leave empty to fall back to products marked "featured".' },
            },
          ],
        },
        {
          label: 'Closing CTA',
          fields: [
            { name: 'ctaHeadline', type: 'text', localized: true },
            { name: 'ctaBody', type: 'textarea', localized: true },
            { name: 'ctaLabel', type: 'text', localized: true },
            { name: 'ctaImage', type: 'upload', relationTo: 'media', validate: webImage },
          ],
        },
        {
          label: 'Meta',
          fields: [
            { name: 'metaTitle', type: 'text', localized: true },
            { name: 'metaDescription', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}

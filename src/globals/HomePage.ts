import type { GlobalConfig } from 'payload'

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
  hooks: { afterChange: [revalidateGlobal(['/'])] },
  versions: {
    // Save Draft / Publish, with history and revert. 50 versions per document
    // keeps the table from growing without bound.
    drafts: true,
    max: 50,
  },

  fields: [
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

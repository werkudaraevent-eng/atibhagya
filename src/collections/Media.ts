import path from 'path'
import { fileURLToPath } from 'url'

import { APIError, type CollectionConfig } from 'payload'

import { stampUpdatedBy, updatedBy } from '../lib/audit'
import { revalidateEverything } from '../lib/revalidate'
import { adminOnly, contentEditors } from '../lib/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * A photograph larger than this is refused with instructions, at upload.
 *
 * The site never shows the original — it serves the 2400px rendition — but
 * the original still has to be fetched and resized once, inside a
 * serverless function with a short clock. An 8 MB export from a camera can
 * run that out and leave a media document with no renditions, which is a
 * hero that sometimes fails to appear. Four megabytes is generous for a
 * 2400px JPEG at quality 80 (usually 600 KB–1.5 MB). Videos have their own
 * limit, on the hero field.
 */
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'filename',
    description:
      'Photographs: JPEG, PNG, WebP or AVIF, exported at 2400px on the long edge and under 4 MB — BMP and TIFF cannot be shown on the web. Video (hero only): MP4 H.264 or WebM, 1920×1080, 10–15 s, no audio, under 12 MB. PDF (event programmes only): under 20 MB.',
  },
  access: {
    read: () => true,
    create: contentEditors,
    update: contentEditors,
    delete: adminOnly,
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        const file = req.file
        if (!file || !file.mimetype?.startsWith('image/')) return
        // A browser-to-R2 upload arrives without `size`; the bytes Payload
        // fetched back are the reliable measure. Unknown means let it through.
        const bytes =
          typeof file.size === 'number' && file.size > 0
            ? file.size
            : (file.data?.length ?? 0)
        if (bytes === 0 || bytes <= MAX_IMAGE_BYTES) return
        const mb = (bytes / 1_048_576).toFixed(1)
        throw new APIError(
          `"${file.name}" is ${mb} MB. Photographs must be under 4 MB: export at 2400px on the long edge, JPEG quality 80, and upload that instead.`,
          400,
        )
      },
    ],
    beforeChange: [stampUpdatedBy],
    // A replaced photograph appears wherever it is used.
    afterChange: [revalidateEverything],
  },
  /**
   * Folders are how the library is organised — Products, Journeys, Pages,
   * Brand, or whatever the team finds natural. They are a filing system, not
   * a record of use: the "Where this file is used" panel below is that, and
   * it is computed, so it cannot drift out of date the way a typed tag would.
   */
  folders: true,
  upload: {
    /**
     * Uploads land in `public/media`, so Next serves them as static files and
     * they fall under the existing gitignore rule.
     *
     * This is local-disk storage: fine for development and for a server with a
     * persistent filesystem, but Vercel's is read-only and ephemeral. Deploying
     * there needs a storage adapter — `@payloadcms/storage-vercel-blob` or
     * `@payloadcms/storage-s3` — before any image survives a redeploy.
     */
    staticDir: path.resolve(dirname, '../../public/media'),
    imageSizes: [
      { name: 'card', width: 800, height: undefined, position: 'centre' },
      { name: 'wide', width: 1600, height: undefined, position: 'centre' },
      { name: 'hero', width: 2400, height: undefined, position: 'centre' },
    ],
    focalPoint: true,
    // Only what the image pipeline can actually process. Sharp cannot decode
    // BMP or TIFF, and `next/image` cannot optimise them, so accepting them
    // produces an upload that saves but never renders.
    // PDF is for an event's programme; it gets no renditions and is only
    // ever linked, never rendered.
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ],
  },
  fields: [
    updatedBy,
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: 'Described for screen readers, in the guest’s own language.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description:
          'Photographer or licence line. Required for any Creative Commons image that ships to production.',
      },
    },
    {
      name: 'creditUrl',
      type: 'text',
      admin: {
        description: 'Link back to the source of the image, when a credit is required.',
      },
    },
    {
      type: 'collapsible',
      label: 'Where this file is used',
      admin: {
        description:
          'Worked out from the documents that point at this file, so it is always current. Home and About are page settings rather than documents and do not appear here.',
      },
      fields: [
        {
          name: 'usedAsProductHero',
          label: 'Product hero image',
          type: 'join',
          collection: 'products',
          on: 'heroImage',
          maxDepth: 0,
          admin: { defaultColumns: ['title', 'code', '_status'] },
        },
        {
          name: 'usedInProductGallery',
          label: 'Product gallery',
          type: 'join',
          collection: 'products',
          on: 'gallery.image',
          maxDepth: 0,
          admin: { defaultColumns: ['title', 'code', '_status'] },
        },
        {
          name: 'usedAsJourneyHero',
          label: 'Journey hero image',
          type: 'join',
          collection: 'journeys',
          on: 'heroImage',
          maxDepth: 0,
          admin: { defaultColumns: ['title', '_status'] },
        },
        {
          name: 'usedInJourneyGallery',
          label: 'Journey gallery',
          type: 'join',
          collection: 'journeys',
          on: 'gallery.image',
          maxDepth: 0,
          admin: { defaultColumns: ['title', '_status'] },
        },
        {
          name: 'usedByVenues',
          label: 'Venues',
          type: 'join',
          collection: 'venues',
          on: 'image',
          maxDepth: 0,
          admin: { defaultColumns: ['name'] },
        },
        {
          name: 'usedByFacilitators',
          label: 'Facilitators',
          type: 'join',
          collection: 'facilitators',
          on: 'photo',
          maxDepth: 0,
          admin: { defaultColumns: ['name'] },
        },
      ],
    },
  ],
}

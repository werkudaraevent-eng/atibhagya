import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { adminOnly, signedIn } from './Users'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: adminOnly,
  },
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
    mimeTypes: ['image/*', 'video/*'],
  },
  fields: [
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
  ],
}

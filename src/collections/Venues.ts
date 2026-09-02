import type { CollectionConfig } from 'payload'

import { revalidateEverything } from '../lib/revalidate'
import { webImage } from '../lib/validate-media'
import { adminOnly, signedIn } from './Users'

/**
 * Reusable master data: one venue is referenced by many products and by
 * individual journey items.
 */
export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    group: 'Master data',
    useAsTitle: 'name',
    defaultColumns: ['name', 'location'],
  },
  access: {
    read: () => true,
    create: signedIn,
    update: signedIn,
    delete: adminOnly,
  },
  hooks: { afterChange: [revalidateEverything] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'location', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', validate: webImage },
  ],
}

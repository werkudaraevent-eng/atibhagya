import type { CollectionConfig } from 'payload'

import { stampUpdatedBy, updatedBy } from '../lib/audit'
import { revalidateEverything } from '../lib/revalidate'
import { webImage } from '../lib/validate-media'
import { adminOnly, contentEditors } from '../lib/access'

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
    create: contentEditors,
    update: contentEditors,
    delete: adminOnly,
  },
  hooks: { beforeChange: [stampUpdatedBy], afterChange: [revalidateEverything] },
  fields: [
    updatedBy,
    { name: 'name', type: 'text', required: true },
    { name: 'location', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', validate: webImage },
  ],
}

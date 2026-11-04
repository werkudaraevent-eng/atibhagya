import type { CollectionConfig } from 'payload'

import { stampUpdatedBy, updatedBy } from '../lib/audit'
import { revalidateEverything } from '../lib/revalidate'
import { webImage } from '../lib/validate-media'
import { adminOnly, contentEditors } from '../lib/access'

/**
 * Optional by design — the wireframe only renders the facilitator section when
 * data exists, because not every experience has a named practitioner.
 */
export const Facilitators: CollectionConfig = {
  slug: 'facilitators',
  admin: {
    group: 'Master data',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
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
    { name: 'role', type: 'text', localized: true, admin: { description: 'Title or role.' } },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media', validate: webImage },
  ],
}

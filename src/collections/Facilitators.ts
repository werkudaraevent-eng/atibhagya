import type { CollectionConfig } from 'payload'

import { adminOnly, signedIn } from './Users'

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
    create: signedIn,
    update: signedIn,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true, admin: { description: 'Title or role.' } },
    { name: 'bio', type: 'textarea', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}

import type { CollectionConfig } from 'payload'

import { stampUpdatedBy, updatedBy } from '../lib/audit'
import { revalidateEverything } from '../lib/revalidate'
import { adminOnly, contentEditors } from '../lib/access'

/**
 * Master list behind the filter row on the product listing. Deliberately thin —
 * a name and a slug, per the ERD.
 */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Product category', plural: 'Product categories' },
  admin: {
    group: 'Experiences',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  access: {
    read: () => true,
    create: contentEditors,
    update: contentEditors,
    delete: adminOnly,
  },
  hooks: { beforeChange: [stampUpdatedBy], afterChange: [revalidateEverything] },
  defaultSort: 'order',
  fields: [
    updatedBy,
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Used in filter links, e.g. body-fit-care.' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}

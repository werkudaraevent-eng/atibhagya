import type { CollectionBeforeChangeHook, Field, GlobalBeforeChangeHook } from 'payload'

/**
 * Who last saved a document.
 *
 * Payload keeps every version but not who made it. This field is stamped
 * from the signed-in user on every save — draft or publish — so it shows in
 * the sidebar, in the list columns, and in each version when two are
 * compared. Read-only in the admin; the hook is the only writer. A save
 * made by a script (the product import) has no user and leaves it as it was.
 */
export const updatedBy: Field = {
  name: 'updatedBy',
  type: 'relationship',
  relationTo: 'users',
  label: 'Last edited by',
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'Set automatically on every save.',
  },
}

export const stampUpdatedBy: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user) data.updatedBy = req.user.id
  return data
}

export const stampUpdatedByGlobal: GlobalBeforeChangeHook = ({ data, req }) => {
  if (req.user) data.updatedBy = req.user.id
  return data
}

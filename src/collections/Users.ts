import type { CollectionConfig } from 'payload'

import { ROLE_OPTIONS, adminFieldOnly, adminOnly, isAdmin, signedIn } from '../lib/access'

/**
 * Whether the admin is served over HTTPS — every Vercel deployment, or any
 * explicit https origin. The session cookie then carries the `Secure` flag,
 * so it can never travel over plain HTTP. Local development stays on
 * http://localhost, where a Secure cookie would simply never be set.
 */
const onHttps =
  Boolean(process.env.VERCEL) || (process.env.NEXT_PUBLIC_SERVER_URL ?? '').startsWith('https://')

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Five wrong passwords lock the account for ten minutes (Payload's
    // defaults, stated here so they are a decision rather than an accident).
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    // Two hours, then sign in again.
    tokenExpiration: 2 * 60 * 60,
    // `Lax` rather than `Strict`: the admin is reached from links in email
    // and chat, and Strict would show those arrivals a login screen even
    // with a valid session. Lax still withholds the cookie from cross-site
    // POSTs, which is the CSRF case that matters.
    cookies: { secure: onHttps, sameSite: 'Lax' },
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    defaultColumns: ['email', 'name', 'roles', 'updatedAt'],
    description:
      'Admins manage accounts and can delete content. Editors write and publish content. Sales read and follow up inquiries. One person can hold several roles.',
  },
  access: {
    // Only an admin hands out accounts.
    create: adminOnly,
    // Anyone signed in can see who the team is — names and addresses, so
    // "Last edited by" resolves for everyone, not only for admins. Only an
    // admin can change anyone but themselves.
    read: signedIn,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      return { id: { equals: user.id } }
    },
    delete: adminOnly,
  },
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        // Losing the last admin would lock everyone out of the panel.
        const target = await req.payload.findByID({ collection: 'users', id, depth: 0 })
        if (!isAdmin(target)) return

        const admins = await req.payload.find({
          collection: 'users',
          depth: 0,
          limit: 0,
          where: { roles: { contains: 'admin' } },
        })

        if (admins.totalDocs <= 1) {
          throw new Error('This is the last admin. Promote someone else before deleting this account.')
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: ROLE_OPTIONS,
      // An editor must not be able to promote themselves.
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        description: 'Only an admin can change this.',
      },
    },
  ],
}

import type { Access, CollectionConfig, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor'

const rolesOf = (user: unknown): Role[] => {
  const roles = (user as { roles?: unknown })?.roles
  return Array.isArray(roles) ? (roles as Role[]) : []
}

export const isAdmin = (user: unknown) => rolesOf(user).includes('admin')

/** Admins only. Used wherever an action is destructive or grants access. */
export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

/** Anyone signed in. Editors may write content; only admins may destroy it. */
export const signedIn: Access = ({ req: { user } }) => Boolean(user)

const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdmin(user)

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
      'Admins manage accounts and can delete content. Editors write and publish, but cannot create accounts or delete.',
  },
  access: {
    // Only an admin hands out accounts.
    create: adminOnly,
    // An editor sees only their own record; an admin sees everyone.
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isAdmin(user)) return true
      return { id: { equals: user.id } }
    },
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
      options: [
        { label: 'Admin — manages accounts and can delete', value: 'admin' },
        { label: 'Editor — writes and publishes content', value: 'editor' },
      ],
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

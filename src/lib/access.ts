import type { Access, FieldAccess } from 'payload'

/**
 * Who may do what in the CMS.
 *
 * - **admin** manages accounts, deletes, and can do everything below.
 * - **editor** writes and publishes site content.
 * - **sales** reads and follows up inquiries — the only place visitors'
 *   personal data lives. Editors do not see it: least privilege, as
 *   UU PDP No. 27/2022 and OWASP ASVS V4 ask.
 *
 * A person can hold several roles.
 */
export type Role = 'admin' | 'editor' | 'sales'

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Admin — manages accounts and can delete', value: 'admin' },
  { label: 'Editor — writes and publishes content', value: 'editor' },
  { label: 'Sales — reads and follows up inquiries', value: 'sales' },
]

export const rolesOf = (user: unknown): Role[] => {
  const roles = (user as { roles?: unknown } | null | undefined)?.roles
  return Array.isArray(roles) ? (roles as Role[]) : []
}

const hasAny = (user: unknown, ...wanted: Role[]) =>
  rolesOf(user).some((role) => wanted.includes(role))

export const isAdmin = (user: unknown) => hasAny(user, 'admin')

/** Admins and editors: everything that ends up on the public site. */
export const canEditContent = (user: unknown) => hasAny(user, 'admin', 'editor')

/** Admins and sales: inquiries, their export, and the people in them. */
export const canHandleInquiries = (user: unknown) => hasAny(user, 'admin', 'sales')

/** Admins only. Used wherever an action is destructive or grants access. */
export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

/** Anyone signed in, whatever their role. */
export const signedIn: Access = ({ req: { user } }) => Boolean(user)

export const contentEditors: Access = ({ req: { user } }) => canEditContent(user)

export const inquiryHandlers: Access = ({ req: { user } }) => canHandleInquiries(user)

export const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdmin(user)

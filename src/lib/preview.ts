import { headers } from 'next/headers'

import { getPayloadSafe } from './payload'

/**
 * The person signed in to the admin who sent the current request, or null.
 *
 * Payload's own session cookie is the credential: the same one the admin
 * panel sends with every request, including the ones its preview iframe
 * makes.
 */
export async function staffUser(): Promise<unknown | null> {
  const payload = await getPayloadSafe()
  if (!payload) return null

  try {
    const { user } = await payload.auth({ headers: await headers() })
    return user ?? null
  } catch {
    return null
  }
}

/**
 * Whether the current request comes from someone signed in to the admin.
 * The preview routes show draft content, so they must not be reachable by
 * the public.
 */
export async function isStaffRequest(): Promise<boolean> {
  return Boolean(await staffUser())
}

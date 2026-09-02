import { headers } from 'next/headers'

import { getPayloadSafe } from './payload'

/**
 * Whether the current request comes from someone signed in to the admin.
 *
 * The preview routes show draft content, so they must not be reachable by
 * the public. Payload's own session cookie is the credential: the same one
 * the admin panel sends with every request, including the ones its preview
 * iframe makes.
 */
export async function isStaffRequest(): Promise<boolean> {
  const payload = await getPayloadSafe()
  if (!payload) return false

  try {
    const { user } = await payload.auth({ headers: await headers() })
    return Boolean(user)
  } catch {
    return false
  }
}

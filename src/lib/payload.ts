import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { isProduction } from './env'

/**
 * Returns a Payload instance, or `null` when the CMS is not configured — no
 * `DATABASE_URI`, a build without secrets. Callers then use the approved
 * default content, so local work and a bare checkout still render.
 *
 * A configured database that cannot be reached is another matter. Outside
 * production it also falls back, so staging keeps working while Neon wakes.
 * In production it throws: Next then keeps serving the page it last built
 * rather than rebuilding it from the sample catalogue and caching *that*
 * for five minutes.
 */
export async function getPayloadSafe(): Promise<Payload | null> {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) return null

  try {
    return await getPayload({ config: configPromise })
  } catch (err) {
    if (isProduction) throw err
    console.warn('[atibhagya] Payload unavailable, falling back to default content:', err)
    return null
  }
}

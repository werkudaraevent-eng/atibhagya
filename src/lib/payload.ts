import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Returns a Payload instance, or `null` when the CMS cannot be reached — no
 * `DATABASE_URI`, a database that is still asleep, a cold Vercel build without
 * secrets. Callers fall back to the approved default content so the marketing
 * site never renders blank.
 */
export async function getPayloadSafe(): Promise<Payload | null> {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) return null

  try {
    return await getPayload({ config: configPromise })
  } catch (err) {
    console.warn('[atibhagya] Payload unavailable, falling back to default content:', err)
    return null
  }
}

import type { Payload } from 'payload'

import { retentionMonthsOf } from './content/privacy'

/** The moment before which an inquiry is past its retention period. */
export const retentionCutoff = (months: number, now: Date = new Date()): Date => {
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months)
  return cutoff
}

/**
 * Deletes every inquiry older than the retention period set on the privacy
 * policy, and says how many went. The policy promises this to visitors
 * (UU PDP No. 27/2022: data is kept no longer than its purpose needs), so it
 * runs on a schedule rather than waiting for someone to remember.
 */
export async function purgeExpiredInquiries(
  payload: Payload,
  now: Date = new Date(),
): Promise<{ deleted: number; months: number; cutoff: string }> {
  const privacy = await payload.findGlobal({ slug: 'privacy', depth: 0 })
  const months = retentionMonthsOf(privacy.retentionMonths)
  const cutoff = retentionCutoff(months, now)

  const result = await payload.delete({
    collection: 'inquiries',
    where: { createdAt: { less_than: cutoff.toISOString() } },
    depth: 0,
    // A scheduled job has no user; the Local API's default is what it needs.
    overrideAccess: true,
  })

  if (result.errors.length > 0) {
    payload.logger.error({ errors: result.errors }, 'Some expired inquiries could not be deleted')
  }

  return { deleted: result.docs.length, months, cutoff: cutoff.toISOString() }
}

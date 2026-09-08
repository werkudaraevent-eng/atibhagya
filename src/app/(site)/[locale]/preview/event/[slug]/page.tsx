import { notFound } from 'next/navigation'

import { EventScreen } from '@/components/events/EventScreen'
import type { Locale } from '@/lib/content/types'
import { isStaffRequest } from '@/lib/preview'

/** The admin's live-preview target for an event. See the product preview. */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function EventPreviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  if (!(await isStaffRequest())) notFound()
  const { locale, slug } = await params
  return <EventScreen locale={locale as Locale} slug={slug} draft />
}

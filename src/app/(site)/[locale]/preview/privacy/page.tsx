import { notFound } from 'next/navigation'

import { PrivacyScreen } from '@/components/privacy/PrivacyScreen'
import type { Locale } from '@/lib/content/types'
import { isStaffRequest } from '@/lib/preview'

/** The admin's live-preview target for the privacy policy: reads the draft, staff only. */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function PrivacyPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale } = await params
  return <PrivacyScreen locale={locale as Locale} draft />
}

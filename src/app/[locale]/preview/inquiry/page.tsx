import { notFound } from 'next/navigation'

import { InquiryScreen } from '@/components/inquiry/InquiryScreen'
import type { Locale } from '@/lib/content/types'
import { isStaffRequest } from '@/lib/preview'

/**
 * The admin's live-preview target for the inquiry form.
 *
 * The public page reads the published form, so a field added or a rule set
 * and saved as a draft was invisible in the preview panel until it went live.
 * This route reads the draft. It renders on every request, never caches, and
 * refuses anyone without an admin session.
 */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function InquiryPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale } = await params
  return <InquiryScreen locale={locale as Locale} draft />
}

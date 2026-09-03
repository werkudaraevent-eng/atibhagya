import { notFound } from 'next/navigation'

import { AboutScreen } from '@/components/about/AboutScreen'
import type { Locale } from '@/lib/content/types'
import { isStaffRequest } from '@/lib/preview'

/** The admin's live-preview target for the about page: reads the draft, staff only. */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function AboutPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale } = await params
  return <AboutScreen locale={locale as Locale} draft />
}

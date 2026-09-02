import { notFound } from 'next/navigation'

import { HomeScreen } from '@/components/home/HomeScreen'
import type { Locale } from '@/lib/content/types'
import { isStaffRequest } from '@/lib/preview'

/** The admin's live-preview target for the home page: reads the draft, staff only. */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function HomePreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale } = await params
  return <HomeScreen locale={locale as Locale} draft />
}

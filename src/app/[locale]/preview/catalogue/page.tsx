import { notFound } from 'next/navigation'

import { ProductListScreen } from '@/components/products/ProductListScreen'
import type { Locale } from '@/lib/content/types'
import { isStaffRequest } from '@/lib/preview'

/**
 * The admin's live-preview target for the catalogue headings: the product
 * listing, reading the draft of the `catalogue` global. Staff only.
 */
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function CataloguePreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  if (!(await isStaffRequest())) notFound()

  const { locale } = await params
  return <ProductListScreen locale={locale as Locale} draft />
}

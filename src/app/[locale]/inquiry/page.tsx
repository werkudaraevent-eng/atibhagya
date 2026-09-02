import type { Metadata } from 'next'

import { InquiryScreen } from '@/components/inquiry/InquiryScreen'
import type { Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = dict(locale as Locale)

  return {
    title: t.inquiry.metaTitle,
    description: t.inquiry.metaDescription,
    alternates: {
      canonical: locale === 'id' ? '/id/inquiry' : '/inquiry',
      languages: { en: '/inquiry', id: '/id/inquiry' },
    },
    robots: { index: false, follow: true },
  }
}

const asArray = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

export default async function InquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ product?: string | string[]; journey?: string | string[] }>
}) {
  const { locale } = await params
  const { product, journey } = await searchParams

  return (
    <InquiryScreen
      locale={locale as Locale}
      initialProducts={asArray(product)}
      initialJourneys={asArray(journey)}
    />
  )
}

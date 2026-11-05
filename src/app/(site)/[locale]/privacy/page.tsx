import type { Metadata } from 'next'

import { PrivacyScreen } from '@/components/privacy/PrivacyScreen'
import { getPrivacy } from '@/lib/content/privacy'
import type { Locale } from '@/lib/content/types'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const privacy = await getPrivacy(locale as Locale)

  return {
    title: privacy.meta.title,
    description: privacy.meta.description,
    alternates: {
      canonical: locale === 'id' ? '/id/privacy' : '/privacy',
      languages: { en: '/privacy', id: '/id/privacy' },
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <PrivacyScreen locale={locale as Locale} />
}

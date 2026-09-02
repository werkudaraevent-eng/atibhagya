import type { Metadata } from 'next'

import { AboutScreen } from '@/components/about/AboutScreen'
import { getAbout } from '@/lib/content'
import type { Locale } from '@/lib/content/types'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const about = await getAbout(locale as Locale)

  return {
    title: about.meta.title,
    description: about.meta.description,
    alternates: {
      canonical: locale === 'id' ? '/id/about' : '/about',
      languages: { en: '/about', id: '/id/about' },
    },
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <AboutScreen locale={locale as Locale} />
}

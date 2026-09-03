import type { Metadata } from 'next'

import { HomeScreen } from '@/components/home/HomeScreen'
import { getHome } from '@/lib/content'
import type { Locale } from '@/lib/content/types'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const home = await getHome(locale as Locale)

  return {
    title: home.meta.title,
    description: home.meta.description,
    alternates: {
      canonical: locale === 'id' ? '/id' : '/',
      languages: { en: '/', id: '/id' },
    },
    openGraph: {
      title: home.meta.title,
      description: home.meta.description,
      images: home.hero.image.src ? [home.hero.image.src] : [],
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <HomeScreen locale={locale as Locale} />
}

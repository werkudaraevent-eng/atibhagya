import type { Metadata } from 'next'

import { EventScreen } from '@/components/events/EventScreen'
import { getEvent, getEvents } from '@/lib/content'
import { locales, type Locale } from '@/lib/content/types'

export const revalidate = 300

export async function generateStaticParams() {
  const events = await getEvents('en')
  return locales.flatMap((locale) => events.map((e) => ({ locale, slug: e.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const event = await getEvent(locale as Locale, slug)
  if (!event) return {}

  const path = `/events/${event.slug}`
  return {
    title: event.meta.title,
    description: event.meta.description,
    alternates: {
      canonical: locale === 'id' ? `/id${path}` : path,
      languages: { en: path, id: `/id${path}` },
    },
    openGraph: {
      title: event.title,
      description: event.meta.description,
      images: event.heroImage.src ? [event.heroImage.src] : [],
      type: 'article',
    },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  return <EventScreen locale={locale as Locale} slug={slug} />
}

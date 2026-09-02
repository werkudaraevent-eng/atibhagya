import { notFound } from 'next/navigation'

import { HtmlLang } from '@/components/site/HtmlLang'
import { locales, type Locale } from '@/lib/content/types'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * The language segment. The document itself is the site layout above; this
 * only validates the locale, sets `<html lang>` for it, and hosts the
 * intercepted inquiry dialog.
 */
export default async function LocaleLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode
  /** The intercepted application dialog; empty on every other route. */
  modal: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  return (
    <>
      <HtmlLang locale={locale as Locale} />
      <div data-page>{children}</div>
      {modal}
    </>
  )
}

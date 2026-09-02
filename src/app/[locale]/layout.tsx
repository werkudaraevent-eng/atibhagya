import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RefreshOnSave } from '@/components/site/RefreshOnSave'
import { THEME_SCRIPT } from '@/components/site/ThemeToggle'
import { karla, marcellus } from '@/lib/fonts'
import { locales, type Locale } from '@/lib/content/types'
import '../globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
}

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
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${marcellus.variable} ${karla.variable}`}
      // The theme script below sets `data-theme` before React runs; React
      // must not treat that attribute as a mismatch.
      suppressHydrationWarning
    >
      <head>
        {/* Applies the remembered (or system) theme before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <noscript>
          {/* Without JS nothing would ever animate in, so show everything. */}
          <style>{`[data-fade],[data-headline],[data-rule],[data-open]{opacity:1 !important;visibility:visible !important;transform:none !important;clip-path:none !important}`}</style>
        </noscript>
        <div data-page>{children}</div>
        {modal}
        <RefreshOnSave />
      </body>
    </html>
  )
}

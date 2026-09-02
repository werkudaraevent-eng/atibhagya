import type { Metadata } from 'next'

import { LANG_SCRIPT } from '@/components/site/HtmlLang'
import { RefreshOnSave } from '@/components/site/RefreshOnSave'
import { THEME_SCRIPT } from '@/components/site/ThemeToggle'
import { isProduction } from '@/lib/env'
import { karla, marcellus } from '@/lib/fonts'
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  // Belt and braces with robots.ts: a staging page that somehow gets
  // crawled still tells the engine not to keep it.
  ...(isProduction ? {} : { robots: { index: false, follow: false } }),
}

/**
 * The one document for the whole site, in both languages.
 *
 * `[locale]` used to be the root, which made switching language a change of
 * root layout — and Next reloads the page for that: a blank frame, every
 * entrance animation replayed, the reader dropped back at the top. With the
 * document up here and the locale a segment below it, the switch is an
 * ordinary in-place navigation. The `lang` attribute is set by the locale
 * segment (see HtmlLang); the admin lives in its own group with its own
 * document and is untouched by this.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${marcellus.variable} ${karla.variable}`}
      // The theme script sets `data-theme` and HtmlLang sets `lang` before
      // React runs; neither is a mismatch React should repair.
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: the remembered (or system) theme, and the
            language from the URL. Both live here, in the one document, so
            React never re-creates them during an in-place navigation. */}
        <script dangerouslySetInnerHTML={{ __html: `${THEME_SCRIPT};${LANG_SCRIPT}` }} />
      </head>
      <body>
        <noscript>
          {/* Without JS nothing would ever animate in, so show everything. */}
          <style>{`[data-fade],[data-headline],[data-rule],[data-open]{opacity:1 !important;visibility:visible !important;transform:none !important;clip-path:none !important}`}</style>
        </noscript>
        {children}
        <RefreshOnSave />
      </body>
    </html>
  )
}

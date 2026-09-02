'use client'

import { useLayoutEffect } from 'react'

import type { Locale } from '@/lib/content/types'

/**
 * Sets `<html lang>` from the URL as the document is parsed — before paint,
 * and once, in the root document, where React never re-renders it. (A
 * script rendered inside a segment would be re-created on an in-place
 * language switch, and React refuses to run scripts it creates itself.)
 */
export const LANG_SCRIPT = `(function(){var p=location.pathname;document.documentElement.lang=(p==='/id'||p.indexOf('/id/')===0)?'id':'en'})()`

/** Keeps `<html lang>` right when the language changes in place. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}

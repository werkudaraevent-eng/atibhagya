'use client'

import { useLayoutEffect } from 'react'

import type { Locale } from '@/lib/content/types'

/**
 * Keeps `<html lang>` right when the language changes in place. The
 * before-paint version lives in src/lib/head-scripts.ts, inlined by the
 * root layout.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}

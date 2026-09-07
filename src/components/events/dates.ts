import type { Locale } from '@/lib/content/types'

const LANG: Record<Locale, string> = { en: 'en-GB', id: 'id-ID' }

/** A date-only ISO string as a Date, without the time zone shifting the day. */
const at = (iso: string) => new Date(`${iso}T12:00:00`)

/** "Sat · 6 March" — the hero's date column. */
export function shortDate(iso: string, locale: Locale): string {
  const d = at(iso)
  const day = d.toLocaleDateString(LANG[locale], { weekday: 'short' })
  const date = d.toLocaleDateString(LANG[locale], { day: 'numeric', month: 'long' })
  return `${day} · ${date}`
}

/** "6 – 7 March 2027", or "28 February – 7 March 2027" across months. */
export function dateRange(dates: { date: string }[], locale: Locale): string {
  if (!dates.length) return ''
  const first = at(dates[0]!.date)
  const last = at(dates[dates.length - 1]!.date)
  const lang = LANG[locale]
  const full = (d: Date) => d.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })
  if (dates.length === 1 || first.getTime() === last.getTime()) return full(first)
  const sameMonth = first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()
  if (sameMonth) {
    return `${first.getDate()} – ${full(last)}`
  }
  const dayMonth = (d: Date) => d.toLocaleDateString(lang, { day: 'numeric', month: 'long' })
  return `${dayMonth(first)} – ${full(last)}`
}

/** "March 2027" — the season, for the archive. */
export function monthYear(iso: string, locale: Locale): string {
  return at(iso).toLocaleDateString(LANG[locale], { month: 'long', year: 'numeric' })
}

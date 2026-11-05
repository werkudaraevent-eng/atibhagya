/**
 * Where an event sits in time, worked out from its dates alone — never from
 * a status field an editor could forget to flip.
 */

/**
 * Today, as a date in Jakarta (UTC+7): the festival's own clock, whatever
 * the server's.
 */
export const todayInJakarta = (now: number = Date.now()) =>
  new Date(now + 7 * 3600_000).toISOString().slice(0, 10)

/**
 * Whether an event is still to come. It stays live through the whole of its
 * last day; an event with no dates is never live. `dates` are sorted
 * ascending, as `YYYY-MM-DD`.
 */
export const isLive = (dates: { date: string }[], now: number = Date.now()) => {
  const last = dates.at(-1)?.date
  return Boolean(last && last >= todayInJakarta(now))
}

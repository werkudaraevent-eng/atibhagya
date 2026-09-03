/**
 * A small sliding-window rate limiter, in memory.
 *
 * Each serverless instance keeps its own window, so this is a brake rather
 * than a wall: a burst from one address is refused within an instance, while
 * a distributed flood needs the host's firewall (Vercel WAF rate-limit rule,
 * or Cloudflare in front of the domain). It costs nothing and needs no
 * service, which is why it is the first layer rather than the only one.
 */
const hits = new Map<string, number[]>()

/** Keep the map from growing forever on a long-lived instance. */
const sweep = (now: number, windowMs: number) => {
  if (hits.size < 5000) return
  for (const [key, times] of hits) {
    if (times.every((t) => now - t >= windowMs)) hits.delete(key)
  }
}

/**
 * Records an attempt for `key` and says whether it went over the limit.
 * A refused attempt is not recorded, so a blocked client is not kept blocked
 * by its own retries once the window has passed.
 */
export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    hits.set(key, recent)
    return true
  }
  recent.push(now)
  hits.set(key, recent)
  sweep(now, windowMs)
  return false
}

/** The visitor's address as the host reports it; `unknown` when it does not. */
export function clientAddress(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip') ?? 'unknown'
}

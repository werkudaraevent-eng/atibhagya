/**
 * Cloudflare Turnstile: a bot check that is invisible to almost everyone.
 *
 * Both keys come from the Cloudflare dashboard (Turnstile → Add site).
 * With `TURNSTILE_SECRET_KEY` unset the check is skipped — local
 * development and a fresh environment keep working. The public site key
 * lives with the widget (components/inquiry/Turnstile.tsx); this file is
 * server-only.
 */
const VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** True when the token is genuine, or when Turnstile is not configured. */
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip && ip !== 'unknown') body.set('remoteip', ip)
    const res = await fetch(VERIFY, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      // Cloudflare answers in well under a second; do not let the form hang.
      signal: AbortSignal.timeout(5000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[atibhagya] Turnstile verification failed:', err)
    return false
  }
}

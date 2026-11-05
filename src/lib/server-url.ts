/**
 * The site's own origin — what the admin calls to log in and out, what CORS
 * and CSRF trust, where preview links and absolute URLs point.
 *
 * It has to be the address people actually open. Set it explicitly where
 * there is a domain. On Vercel, without one, fall back to the *stable*
 * address — the project's production URL, or the branch alias
 * (`atibhagya-git-staging-….vercel.app`) — never the per-deployment URL:
 * that one is a different host from the alias in the address bar, so a
 * logout sent there cleared nothing.
 */
type Env = Record<string, string | undefined>

export const serverURLFrom = (env: Env): string => {
  const vercelHost =
    env.VERCEL_ENV === 'production'
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : env.VERCEL_BRANCH_URL || env.VERCEL_URL
  return env.NEXT_PUBLIC_SERVER_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')
}

/**
 * Every origin this deployment answers on, for CORS and CSRF. Besides the
 * stable address, a Vercel deployment is also reachable at its own
 * per-deployment URL (`atibhagya-abc123-….vercel.app`). Payload ignores the
 * session cookie on a request whose Origin is not in the CSRF list, so
 * without it the admin rendered as signed in there while every save failed
 * with "You are not allowed to perform this action". Trusting the
 * deployment's own address opens nothing to another site.
 */
export const trustedOriginsFrom = (env: Env): string[] => {
  const origins = [serverURLFrom(env)]
  if (env.VERCEL_URL) origins.push(`https://${env.VERCEL_URL}`)
  if (env.VERCEL_BRANCH_URL) origins.push(`https://${env.VERCEL_BRANCH_URL}`)
  return [...new Set(origins)]
}

export const serverURL = serverURLFrom(process.env)
export const trustedOrigins = trustedOriginsFrom(process.env)

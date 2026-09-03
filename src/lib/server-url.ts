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
const vercelHost =
  process.env.VERCEL_ENV === 'production'
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL

export const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')

/**
 * Whether this deployment is the one the public sees.
 *
 * Vercel sets VERCEL_ENV on every deployment (`production`, `preview`).
 * Anywhere else, production has to be declared with NODE_ENV, which
 * `next start` does and `next dev` does not.
 */
export const isProduction =
  process.env.VERCEL_ENV === 'production' ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production')

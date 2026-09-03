import { withPayload } from '@payloadcms/next/withPayload'

const isDev = process.env.NODE_ENV !== 'production'
const enforceCsp = process.env.CSP_ENFORCE === '1'

/**
 * Vercel's toolbar (comments, feedback) is injected into every deployment
 * except production. It loads a script from, and frames, vercel.live —
 * allowed there and nowhere else, so production's policy stays tight.
 */
const onVercelPreview = Boolean(process.env.VERCEL) && process.env.VERCEL_ENV !== 'production'
const toolbar = onVercelPreview ? ' https://vercel.live' : ''

/** The origin the browser PUTs uploads to, when uploads go straight to R2. */
const s3Origin = (() => {
  try {
    return process.env.S3_ENDPOINT ? new URL(process.env.S3_ENDPOINT).origin : ''
  } catch {
    return ''
  }
})()

/**
 * Content-Security-Policy.
 *
 * Pages are static and cached, so there is no per-request nonce to hand to
 * Next's own inline scripts; `'unsafe-inline'` stays for scripts and styles.
 * What the policy does lock down is everything else: no script, frame,
 * connection or plugin from any origin but our own and Cloudflare's bot
 * check — and no embedding of this site anywhere else.
 *
 * It ships as Report-Only until CSP_ENFORCE=1 is set, so a violation shows
 * up in the browser console on staging rather than as a broken page.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com${toolbar}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://upload.wikimedia.org https://commons.wikimedia.org${toolbar}`,
  "media-src 'self' blob:",
  "font-src 'self' data:",
  `connect-src 'self' https://challenges.cloudflare.com${s3Origin ? ` ${s3Origin}` : ''}${toolbar}${isDev ? ' ws: wss:' : ''}`,
  // Our own pages (the admin's live preview) and the bot check.
  `frame-src 'self' https://challenges.cloudflare.com${toolbar}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Only meaningful when enforced; a report-only policy ignores it and
  // says so in the console on every page.
  ...(enforceCsp && !isDev ? ['upgrade-insecure-requests'] : []),
].join('; ')

const cspHeader = enforceCsp ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // CC placeholder photography from Wikimedia Commons. Remove once the
      // client's own photography is uploaded to the `media` collection.
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: cspHeader, value: csp },
        ],
      },
    ]
  },
  // URL strategy: `/` is English, `/id/…` is Indonesian. The pages live under
  // `app/[locale]`, so English is rewritten in and `/en/…` redirects away to
  // keep one canonical URL per page.
  async redirects() {
    return [
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
    ]
  },
  async rewrites() {
    // Listed explicitly rather than pattern-matched, so `/admin`, `/api` and
    // the static routes can never be caught by accident.
    const sections = ['product', 'journey', 'about', 'inquiry']
    return {
      beforeFiles: [
        { source: '/', destination: '/en' },
        ...sections.flatMap((s) => [
          { source: `/${s}`, destination: `/en/${s}` },
          { source: `/${s}/:slug`, destination: `/en/${s}/:slug` },
        ]),
        // The admin's draft preview, English locale.
        { source: '/preview/:section/:slug', destination: '/en/preview/:section/:slug' },
        { source: '/preview/:section', destination: '/en/preview/:section' },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

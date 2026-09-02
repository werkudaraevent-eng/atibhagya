import { withPayload } from '@payloadcms/next/withPayload'

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
  // Baseline hardening. A full Content-Security-Policy is the next step and
  // needs a nonce pass over Next's inline scripts — see README § Security.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
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

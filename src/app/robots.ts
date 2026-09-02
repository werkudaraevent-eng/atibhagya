import type { MetadataRoute } from 'next'

import { isProduction } from '@/lib/env'

/**
 * Only production may be indexed.
 *
 * Staging and preview deployments serve the same pages at other hostnames;
 * without this a search engine would index staging.atibhagya.com and split
 * the site's authority — or worse, rank an unfinished page.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://atibhagya.com'

  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/preview', '/export', '/inquiry'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}

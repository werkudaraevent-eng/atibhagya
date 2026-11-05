import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { serverURLFrom, trustedOriginsFrom } from '@/lib/server-url'

const preview = {
  VERCEL_ENV: 'preview',
  VERCEL_URL: 'atibhagya-ssslwymfy-team.vercel.app',
  VERCEL_BRANCH_URL: 'atibhagya-git-staging-team.vercel.app',
}

describe('server URL', () => {
  it('a preview points at its branch alias, not the per-deployment URL', () => {
    assert.equal(serverURLFrom(preview), 'https://atibhagya-git-staging-team.vercel.app')
  })

  it('an explicit address wins', () => {
    assert.equal(
      serverURLFrom({ ...preview, NEXT_PUBLIC_SERVER_URL: 'https://atibhagya.com' }),
      'https://atibhagya.com',
    )
  })

  it('falls back to localhost off Vercel', () => {
    assert.equal(serverURLFrom({}), 'http://localhost:3000')
  })
})

describe('trusted origins (CORS and CSRF)', () => {
  it('a preview trusts both its branch alias and its own per-deployment URL', () => {
    // Without the second one, the admin opened at the per-deployment URL shows
    // as signed in but every save is refused.
    assert.deepEqual(trustedOriginsFrom(preview), [
      'https://atibhagya-git-staging-team.vercel.app',
      'https://atibhagya-ssslwymfy-team.vercel.app',
    ])
  })

  it('production trusts its domain and its own deployment, nothing else', () => {
    assert.deepEqual(
      trustedOriginsFrom({
        VERCEL_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'https://atibhagya.com',
        VERCEL_URL: 'atibhagya-abc123-team.vercel.app',
      }),
      ['https://atibhagya.com', 'https://atibhagya-abc123-team.vercel.app'],
    )
  })

  it('locally it is only localhost', () => {
    assert.deepEqual(trustedOriginsFrom({}), ['http://localhost:3000'])
  })
})

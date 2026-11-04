import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { clientAddress, rateLimited } from '@/lib/rate-limit'

describe('rateLimited', () => {
  it('allows up to the limit, then refuses', () => {
    const key = `test:${Math.random()}`
    for (let i = 0; i < 5; i++) assert.equal(rateLimited(key, 5, 60_000), false)
    assert.equal(rateLimited(key, 5, 60_000), true)
  })

  it('keeps addresses apart', () => {
    const a = `a:${Math.random()}`
    const b = `b:${Math.random()}`
    assert.equal(rateLimited(a, 1, 60_000), false)
    assert.equal(rateLimited(b, 1, 60_000), false)
  })
})

describe('clientAddress', () => {
  it('takes the first address the proxy reports', () => {
    assert.equal(clientAddress(new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })), '203.0.113.7')
  })

  it('says unknown when there is nothing to go on', () => {
    assert.equal(clientAddress(new Headers()), 'unknown')
  })
})

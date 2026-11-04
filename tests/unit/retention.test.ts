import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { retentionMonthsOf } from '@/lib/content/privacy'
import { DEFAULT_RETENTION_MONTHS, fillPrivacyTokens } from '@/lib/content/privacy-defaults'
import { retentionCutoff } from '@/lib/retention'

describe('retentionCutoff', () => {
  it('goes back the given number of months', () => {
    assert.equal(
      retentionCutoff(24, new Date('2026-11-04T19:00:00Z')).toISOString(),
      '2024-11-04T19:00:00.000Z',
    )
  })
})

describe('retentionMonthsOf', () => {
  it('keeps a sensible whole number', () => {
    assert.equal(retentionMonthsOf(12), 12)
  })

  it('falls back to the default for anything else', () => {
    for (const value of [0, -1, 121, 2.5, 'abc', null, undefined]) {
      assert.equal(retentionMonthsOf(value), DEFAULT_RETENTION_MONTHS)
    }
  })
})

describe('fillPrivacyTokens', () => {
  it('prints the contact address and the retention period', () => {
    assert.equal(
      fillPrivacyTokens('Write to {email}; deleted after {months} months.', {
        email: 'hello@atibhagya.com',
        months: 24,
      }),
      'Write to hello@atibhagya.com; deleted after 24 months.',
    )
  })
})

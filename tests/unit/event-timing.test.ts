import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { isLive, todayInJakarta } from '@/lib/event-timing'

const at = (iso: string) => new Date(iso).getTime()

describe('todayInJakarta', () => {
  it('is already tomorrow in Jakarta from 17:00 UTC', () => {
    assert.equal(todayInJakarta(at('2027-03-05T17:00:00Z')), '2027-03-06')
  })

  it('is still today just before', () => {
    assert.equal(todayInJakarta(at('2027-03-05T16:59:59Z')), '2027-03-05')
  })
})

describe('isLive', () => {
  const festival = [{ date: '2027-03-06' }, { date: '2027-03-07' }]

  it('is live before the event', () => {
    assert.equal(isLive(festival, at('2027-01-01T00:00:00Z')), true)
  })

  it('stays live through the whole of the last day, Jakarta time', () => {
    assert.equal(isLive(festival, at('2027-03-07T16:59:00Z')), true)
  })

  it('has passed once the last day is over in Jakarta', () => {
    assert.equal(isLive(festival, at('2027-03-07T17:00:00Z')), false)
  })

  it('is never live without dates', () => {
    assert.equal(isLive([], at('2027-01-01T00:00:00Z')), false)
  })
})

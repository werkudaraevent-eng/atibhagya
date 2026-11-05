import { expect, test } from '@playwright/test'

/** Doors that must stay shut to a visitor, whatever else changes. */
test.describe('closed to the public', () => {
  test('inquiries cannot be read or written through the API', async ({ request }) => {
    expect((await request.get('/api/inquiries')).status()).toBe(403)
    const created = await request.post('/api/inquiries', {
      data: { name: 'x', email: 'x@example.com' },
      headers: { origin: 'http://localhost' },
    })
    expect(created.status()).toBe(403)
  })

  test('the inquiry export is not there for a visitor', async ({ request }) => {
    expect((await request.get('/export/inquiries')).status()).toBe(404)
  })

  test('the retention purge refuses a call without the cron secret', async ({ request }) => {
    expect((await request.get('/cron/purge-inquiries')).status()).toBe(404)
    const wrong = await request.get('/cron/purge-inquiries', {
      headers: { authorization: 'Bearer wrong' },
    })
    expect(wrong.status()).toBe(404)
  })

  test('drafts are not previewable without a session', async ({ request }) => {
    expect((await request.get('/preview/privacy')).status()).toBe(404)
  })
})

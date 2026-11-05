import { expect, test } from '@playwright/test'

test('the privacy policy states the retention period, in both languages', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeVisible()
  await expect(page.getByText(/deleted automatically 24 months after it arrives/)).toBeVisible()
  await expect(page.getByText('{email}')).toHaveCount(0)

  await page.goto('/id/privacy')
  await expect(page.getByRole('heading', { level: 1, name: 'Kebijakan privasi' })).toBeVisible()
  await expect(page.getByText(/dihapus otomatis 24 bulan/)).toBeVisible()
})

test('the footer links to it from every page', async ({ page }) => {
  await page.goto('/')
  await page.locator('footer').getByRole('link', { name: 'Privacy policy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)
})

test('its footer is shown, not left hidden waiting for motion', async ({ page }) => {
  // The footer starts at opacity 0 / visibility hidden until <Motion /> reveals
  // it; a page that forgets to mount Motion shows a blank footer.
  await page.goto('/privacy')
  const footer = page.locator('footer')
  await footer.scrollIntoViewIfNeeded()
  const explore = footer.locator('nav[data-fade]').first()
  await expect.poll(async () => Number(await explore.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0.9)
  await expect(footer.locator('[data-headline]')).toHaveCSS('visibility', 'visible')
})

test('the footer link to it is set like the legal line around it', async ({ page }) => {
  await page.goto('/privacy')
  const link = page.locator('footer').getByRole('link', { name: 'Privacy policy' })
  const [own, line] = await link.evaluate((el) => [
    getComputedStyle(el).fontSize,
    getComputedStyle(el.parentElement as Element).fontSize,
  ])
  expect(own).toBe(line)
})

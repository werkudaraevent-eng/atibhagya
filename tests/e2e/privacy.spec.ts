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

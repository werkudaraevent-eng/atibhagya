import { expect, test } from '@playwright/test'

test.describe('inquiry from a product', () => {
  test('arrives with the product chosen, refuses an empty form, then sends', async ({ page }) => {
    await page.goto('/product/agni-hotra')
    await expect(page.getByRole('heading', { level: 1, name: 'Agni Hotra' })).toBeVisible()

    await page.goto('/inquiry?product=agni-hotra')
    const form = page.locator('form').filter({ has: page.locator('input[name="email"]') })
    await expect(form.getByText('Agni Hotra').first()).toBeVisible()

    await form.getByRole('button', { name: /submit inquiry/i }).click()
    await expect(form.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true')
    await expect(form.locator('input[name="email"]')).toHaveAttribute('aria-invalid', 'true')

    await form.locator('input[name="name"]').fill('Ayu Lestari')
    await form.locator('input[name="email"]').fill(`ayu+${Date.now()}@example.com`)
    await form.locator('textarea[name="goal"]').fill('A quiet weekend for our team of eight.')
    await form.getByRole('button', { name: /submit inquiry/i }).click()

    await expect(page.getByRole('heading', { name: /your inquiry is with us/i })).toBeVisible()
  })

  test('links to the privacy policy from the form', async ({ page }) => {
    await page.goto('/inquiry')
    const link = page.locator('form').getByRole('link', { name: 'Privacy policy' })
    await expect(link).toHaveAttribute('href', '/privacy')
  })

  test('form fields are at least 16px so iOS does not zoom', async ({ page }) => {
    await page.goto('/inquiry')
    const size = await page
      .locator('input[name="email"]')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(size).toBeGreaterThanOrEqual(16)
  })
})

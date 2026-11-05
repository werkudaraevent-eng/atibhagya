import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end checks of the flows that must never break: the inquiry (the
 * site's only conversion), the privacy policy, and the doors that must stay
 * shut. They run against a production build (`npm run build`) on a real
 * Postgres with migrations applied and the seed loaded — see the e2e job in
 * .github/workflows/ci.yml.
 */
const port = Number(process.env.E2E_PORT ?? 3100)

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

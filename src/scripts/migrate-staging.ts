/**
 * Runs a Payload migration command against the staging database.
 *
 *   npm run migrate:create:staging     # new migration from the config diff
 *   npm run migrate:status:staging     # what staging has and has not applied
 *
 * `DATABASE_URI` in `.env` stays pointed at local SQLite; this swaps in
 * `DATABASE_URI_STAGING` for the one command and nothing else, so a
 * forgotten edit can never leave local development writing to staging.
 */
import { spawnSync } from 'node:child_process'
import { config } from 'dotenv'

config()

const staging = process.env.DATABASE_URI_STAGING
if (!staging) {
  console.error('DATABASE_URI_STAGING is not set in .env — the Neon staging connection string.')
  process.exit(1)
}

const command = process.argv[2] ?? 'migrate:create'
const result = spawnSync('npx', ['payload', command, ...process.argv.slice(3)], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DATABASE_URI: staging, NODE_OPTIONS: '--no-deprecation' },
})
process.exit(result.status ?? 1)

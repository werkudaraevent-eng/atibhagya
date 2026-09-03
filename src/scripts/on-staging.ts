/**
 * Runs an npm script against the staging database.
 *
 *   npm run import:products:staging
 *
 * Swaps `DATABASE_URI_STAGING` (from `.env`) in as `DATABASE_URI` for the
 * one command, and nothing else — local development keeps its SQLite file.
 * Run only after the deploy that carries any new columns has gone green:
 * the script writes to the schema staging actually has.
 */
import { spawnSync } from 'node:child_process'
import { config } from 'dotenv'

config()

const staging = process.env.DATABASE_URI_STAGING
if (!staging) {
  console.error('DATABASE_URI_STAGING is not set in .env — the Neon staging connection string.')
  process.exit(1)
}

const script = process.argv[2]
if (!script) {
  console.error('Usage: tsx src/scripts/on-staging.ts <npm-script>')
  process.exit(1)
}

const result = spawnSync('npm', ['run', script, '--', ...process.argv.slice(3)], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DATABASE_URI: staging },
})
process.exit(result.status ?? 1)

/**
 * The Vercel build: migrations, then Next.
 *
 * Migrations run only where the database is meant to change — the production
 * build, the staging branch, and any build outside Vercel. A preview build of
 * some other branch shares the staging database, and a migration file that is
 * still being worked on must not reshape it from there.
 */
import { spawnSync } from 'node:child_process'

const onVercel = Boolean(process.env.VERCEL)
const env = process.env.VERCEL_ENV
const ref = process.env.VERCEL_GIT_COMMIT_REF

const migrate = !onVercel || env === 'production' || ref === 'staging'

const run = (script) => {
  const result = spawnSync('npm', ['run', script], { stdio: 'inherit', shell: true })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (migrate) {
  run('migrate')
} else {
  console.log(
    `[build] Preview build of "${ref}": migrations skipped. The staging database changes only from the staging branch.`,
  )
}

run('build')

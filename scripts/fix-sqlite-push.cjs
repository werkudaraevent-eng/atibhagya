/**
 * Repairs the local SQLite file after an interrupted schema push.
 *
 *   node scripts/fix-sqlite-push.cjs
 *
 * Drizzle pushes a schema change to SQLite by creating `__new_*` tables and
 * indexes and then swapping them in. Two dev servers starting at once, or a
 * push killed midway, leave an index that exists but that the next push
 * still wants to create ("index … already exists"), and the CMS refuses to
 * start. This drops the half-made indexes and temp tables so the next start
 * pushes cleanly. Data is untouched. Stop `next dev` before running it.
 */
const { createClient } = require('@libsql/client')

const url = process.env.DATABASE_URI || 'file:./atibhagya-dev.db'
if (!url.startsWith('file:')) {
  console.error('Refusing: this only repairs a local SQLite file, and DATABASE_URI is not one.')
  process.exit(1)
}

;(async () => {
  const db = createClient({ url })
  const indexes = await db.execute(
    "select name from sqlite_master where type = 'index' and name like '%updated_by_idx'",
  )
  const temps = await db.execute(
    "select name from sqlite_master where type = 'table' and name like '\\_\\_new\\_%' escape '\\'",
  )
  for (const row of indexes.rows) {
    await db.execute(`drop index if exists "${row.name}"`)
    console.log('dropped index', row.name)
  }
  for (const row of temps.rows) {
    await db.execute(`drop table if exists "${row.name}"`)
    console.log('dropped temp table', row.name)
  }
  console.log(`done: ${indexes.rows.length} index(es), ${temps.rows.length} temp table(s). Start next dev again.`)
})().catch((err) => {
  console.error(err.message)
  process.exit(1)
})

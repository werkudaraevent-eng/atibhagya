import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ADD COLUMN "hero_darken" numeric DEFAULT 35;
  ALTER TABLE "_events_v" ADD COLUMN "version_hero_darken" numeric DEFAULT 35;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP COLUMN "hero_darken";
  ALTER TABLE "_events_v" DROP COLUMN "version_hero_darken";`)
}

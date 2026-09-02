import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "hero_darken" numeric DEFAULT 35;
  ALTER TABLE "_home_v" ADD COLUMN "version_hero_darken" numeric DEFAULT 35;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "hero_darken";
  ALTER TABLE "_home_v" DROP COLUMN "version_hero_darken";`)
}

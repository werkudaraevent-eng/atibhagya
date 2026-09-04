import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_locales" ADD COLUMN "nav_products" varchar;
  ALTER TABLE "site_locales" ADD COLUMN "nav_journeys" varchar;
  ALTER TABLE "site_locales" ADD COLUMN "nav_about" varchar;
  ALTER TABLE "site_locales" ADD COLUMN "nav_inquiry" varchar;
  ALTER TABLE "_site_v_locales" ADD COLUMN "version_nav_products" varchar;
  ALTER TABLE "_site_v_locales" ADD COLUMN "version_nav_journeys" varchar;
  ALTER TABLE "_site_v_locales" ADD COLUMN "version_nav_about" varchar;
  ALTER TABLE "_site_v_locales" ADD COLUMN "version_nav_inquiry" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_locales" DROP COLUMN "nav_products";
  ALTER TABLE "site_locales" DROP COLUMN "nav_journeys";
  ALTER TABLE "site_locales" DROP COLUMN "nav_about";
  ALTER TABLE "site_locales" DROP COLUMN "nav_inquiry";
  ALTER TABLE "_site_v_locales" DROP COLUMN "version_nav_products";
  ALTER TABLE "_site_v_locales" DROP COLUMN "version_nav_journeys";
  ALTER TABLE "_site_v_locales" DROP COLUMN "version_nav_about";
  ALTER TABLE "_site_v_locales" DROP COLUMN "version_nav_inquiry";`)
}

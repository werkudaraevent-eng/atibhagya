import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" ADD COLUMN "parent_brand" varchar;
  ALTER TABLE "_site_v" ADD COLUMN "version_parent_brand" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" DROP COLUMN "parent_brand";
  ALTER TABLE "_site_v" DROP COLUMN "version_parent_brand";`)
}

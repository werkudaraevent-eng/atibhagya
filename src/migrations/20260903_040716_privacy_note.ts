import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiry_form_locales" ADD COLUMN "privacy_note" varchar;
  ALTER TABLE "_inquiry_form_v_locales" ADD COLUMN "version_privacy_note" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiry_form_locales" DROP COLUMN "privacy_note";
  ALTER TABLE "_inquiry_form_v_locales" DROP COLUMN "version_privacy_note";`)
}

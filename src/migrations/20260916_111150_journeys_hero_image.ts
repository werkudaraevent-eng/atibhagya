import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "catalogue" ADD COLUMN "journeys_hero_image_id" integer;
  ALTER TABLE "_catalogue_v" ADD COLUMN "version_journeys_hero_image_id" integer;
  ALTER TABLE "catalogue" ADD CONSTRAINT "catalogue_journeys_hero_image_id_media_id_fk" FOREIGN KEY ("journeys_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_catalogue_v" ADD CONSTRAINT "_catalogue_v_version_journeys_hero_image_id_media_id_fk" FOREIGN KEY ("version_journeys_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "catalogue_journeys_hero_image_idx" ON "catalogue" USING btree ("journeys_hero_image_id");
  CREATE INDEX "_catalogue_v_version_version_journeys_hero_image_idx" ON "_catalogue_v" USING btree ("version_journeys_hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "catalogue" DROP CONSTRAINT "catalogue_journeys_hero_image_id_media_id_fk";
  
  ALTER TABLE "_catalogue_v" DROP CONSTRAINT "_catalogue_v_version_journeys_hero_image_id_media_id_fk";
  
  DROP INDEX "catalogue_journeys_hero_image_idx";
  DROP INDEX "_catalogue_v_version_version_journeys_hero_image_idx";
  ALTER TABLE "catalogue" DROP COLUMN "journeys_hero_image_id";
  ALTER TABLE "_catalogue_v" DROP COLUMN "version_journeys_hero_image_id";`)
}

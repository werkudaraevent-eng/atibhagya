import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "events_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "events_downloads_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_events_v_version_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_downloads_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "events_downloads" ADD CONSTRAINT "events_downloads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_downloads" ADD CONSTRAINT "events_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_downloads_locales" ADD CONSTRAINT "events_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_downloads" ADD CONSTRAINT "_events_v_version_downloads_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_downloads" ADD CONSTRAINT "_events_v_version_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_downloads_locales" ADD CONSTRAINT "_events_v_version_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_downloads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_downloads_order_idx" ON "events_downloads" USING btree ("_order");
  CREATE INDEX "events_downloads_parent_id_idx" ON "events_downloads" USING btree ("_parent_id");
  CREATE INDEX "events_downloads_file_idx" ON "events_downloads" USING btree ("file_id");
  CREATE UNIQUE INDEX "events_downloads_locales_locale_parent_id_unique" ON "events_downloads_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_downloads_order_idx" ON "_events_v_version_downloads" USING btree ("_order");
  CREATE INDEX "_events_v_version_downloads_parent_id_idx" ON "_events_v_version_downloads" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_downloads_file_idx" ON "_events_v_version_downloads" USING btree ("file_id");
  CREATE UNIQUE INDEX "_events_v_version_downloads_locales_locale_parent_id_unique" ON "_events_v_version_downloads_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "events_downloads" CASCADE;
  DROP TABLE "events_downloads_locales" CASCADE;
  DROP TABLE "_events_v_version_downloads" CASCADE;
  DROP TABLE "_events_v_version_downloads_locales" CASCADE;`)
}

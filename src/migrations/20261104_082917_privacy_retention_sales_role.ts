import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_privacy_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__privacy_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__privacy_v_published_locale" AS ENUM('en', 'id');
  ALTER TYPE "public"."enum_users_roles" ADD VALUE 'sales';
  CREATE TABLE "privacy_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "privacy_sections_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "privacy" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_by_id" integer,
  	"retention_months" numeric DEFAULT 24,
  	"updated" timestamp(3) with time zone,
  	"_status" "enum_privacy_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "privacy_locales" (
  	"eyebrow" varchar,
  	"headline" varchar,
  	"lede" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_privacy_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_privacy_v_version_sections_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_privacy_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_by_id" integer,
  	"version_retention_months" numeric DEFAULT 24,
  	"version_updated" timestamp(3) with time zone,
  	"version__status" "enum__privacy_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__privacy_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_privacy_v_locales" (
  	"version_eyebrow" varchar,
  	"version_headline" varchar,
  	"version_lede" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "privacy_sections" ADD CONSTRAINT "privacy_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy_sections_locales" ADD CONSTRAINT "privacy_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "privacy" ADD CONSTRAINT "privacy_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy_locales" ADD CONSTRAINT "privacy_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."privacy"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_v_version_sections" ADD CONSTRAINT "_privacy_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_v_version_sections_locales" ADD CONSTRAINT "_privacy_v_version_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_v_version_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_privacy_v" ADD CONSTRAINT "_privacy_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_privacy_v_locales" ADD CONSTRAINT "_privacy_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_privacy_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "privacy_sections_order_idx" ON "privacy_sections" USING btree ("_order");
  CREATE INDEX "privacy_sections_parent_id_idx" ON "privacy_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "privacy_sections_locales_locale_parent_id_unique" ON "privacy_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "privacy_sections_locales_parent_id_idx" ON "privacy_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "privacy_updated_by_idx" ON "privacy" USING btree ("updated_by_id");
  CREATE INDEX "privacy__status_idx" ON "privacy" USING btree ("_status");
  CREATE UNIQUE INDEX "privacy_locales_locale_parent_id_unique" ON "privacy_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "privacy_locales_parent_id_idx" ON "privacy_locales" USING btree ("_parent_id");
  CREATE INDEX "_privacy_v_version_sections_order_idx" ON "_privacy_v_version_sections" USING btree ("_order");
  CREATE INDEX "_privacy_v_version_sections_parent_id_idx" ON "_privacy_v_version_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_privacy_v_version_sections_locales_locale_parent_id_unique" ON "_privacy_v_version_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_privacy_v_version_sections_locales_parent_id_idx" ON "_privacy_v_version_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "_privacy_v_version_version_updated_by_idx" ON "_privacy_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_privacy_v_version_version__status_idx" ON "_privacy_v" USING btree ("version__status");
  CREATE INDEX "_privacy_v_created_at_idx" ON "_privacy_v" USING btree ("created_at");
  CREATE INDEX "_privacy_v_updated_at_idx" ON "_privacy_v" USING btree ("updated_at");
  CREATE INDEX "_privacy_v_snapshot_idx" ON "_privacy_v" USING btree ("snapshot");
  CREATE INDEX "_privacy_v_published_locale_idx" ON "_privacy_v" USING btree ("published_locale");
  CREATE INDEX "_privacy_v_latest_idx" ON "_privacy_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_privacy_v_locales_locale_parent_id_unique" ON "_privacy_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_privacy_v_locales_parent_id_idx" ON "_privacy_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "privacy_sections" CASCADE;
  DROP TABLE "privacy_sections_locales" CASCADE;
  DROP TABLE "privacy" CASCADE;
  DROP TABLE "privacy_locales" CASCADE;
  DROP TABLE "_privacy_v_version_sections" CASCADE;
  DROP TABLE "_privacy_v_version_sections_locales" CASCADE;
  DROP TABLE "_privacy_v" CASCADE;
  DROP TABLE "_privacy_v_locales" CASCADE;
  DELETE FROM "users_roles" WHERE "value" = 'sales';
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP TYPE "public"."enum_privacy_status";
  DROP TYPE "public"."enum__privacy_v_version_status";
  DROP TYPE "public"."enum__privacy_v_published_locale";`)
}

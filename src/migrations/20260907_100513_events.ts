import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_days_list_style" AS ENUM('thread', 'rows');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_days_list_style" AS ENUM('thread', 'rows');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "events_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"time" varchar
  );
  
  CREATE TABLE "events_dates_locales" (
  	"label" varchar,
  	"venue" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events_days_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events_days_list_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events_days_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events_days_notes_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"list_style" "enum_events_days_list_style" DEFAULT 'thread'
  );
  
  CREATE TABLE "events_days_locales" (
  	"kicker" varchar,
  	"meta" varchar,
  	"title" varchar,
  	"body" varchar,
  	"list_label" varchar,
  	"quote_eyebrow" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"place_number" varchar,
  	"place_image_id" integer,
  	"default_journey_id" integer,
  	"pdf_id" integer,
  	"closing_image_id" integer,
  	"contact_name" varchar,
  	"contact_line" varchar,
  	"home_image_id" integer,
  	"slug" varchar,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar,
  	"eyebrow" varchar,
  	"headline" varchar,
  	"statement" varchar,
  	"intro_label" varchar,
  	"intro_headline" varchar,
  	"intro_body" varchar,
  	"days_label" varchar,
  	"days_headline" varchar,
  	"place_label" varchar,
  	"place_caption" varchar,
  	"place_headline" varchar,
  	"place_body" varchar,
  	"journeys_label" varchar,
  	"journeys_headline" varchar,
  	"closing_eyebrow" varchar,
  	"closing_headline" varchar,
  	"closing_body" varchar,
  	"closing_cta_label" varchar,
  	"collaboration_line" varchar,
  	"nav_label" varchar,
  	"home_headline" varchar,
  	"home_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"journeys_id" integer
  );
  
  CREATE TABLE "_events_v_version_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_dates_locales" (
  	"label" varchar,
  	"venue" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_version_days_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_days_list_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_version_days_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_days_notes_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_version_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"list_style" "enum__events_v_version_days_list_style" DEFAULT 'thread',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_days_locales" (
  	"kicker" varchar,
  	"meta" varchar,
  	"title" varchar,
  	"body" varchar,
  	"list_label" varchar,
  	"quote_eyebrow" varchar,
  	"quote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_place_number" varchar,
  	"version_place_image_id" integer,
  	"version_default_journey_id" integer,
  	"version_pdf_id" integer,
  	"version_closing_image_id" integer,
  	"version_contact_name" varchar,
  	"version_contact_line" varchar,
  	"version_home_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar,
  	"version_eyebrow" varchar,
  	"version_headline" varchar,
  	"version_statement" varchar,
  	"version_intro_label" varchar,
  	"version_intro_headline" varchar,
  	"version_intro_body" varchar,
  	"version_days_label" varchar,
  	"version_days_headline" varchar,
  	"version_place_label" varchar,
  	"version_place_caption" varchar,
  	"version_place_headline" varchar,
  	"version_place_body" varchar,
  	"version_journeys_label" varchar,
  	"version_journeys_headline" varchar,
  	"version_closing_eyebrow" varchar,
  	"version_closing_headline" varchar,
  	"version_closing_body" varchar,
  	"version_closing_cta_label" varchar,
  	"version_collaboration_line" varchar,
  	"version_nav_label" varchar,
  	"version_home_headline" varchar,
  	"version_home_body" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"journeys_id" integer
  );
  
  ALTER TABLE "journeys_days" ADD COLUMN "highlight" boolean;
  ALTER TABLE "journeys_days_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "journeys" ADD COLUMN "duration_short" varchar;
  ALTER TABLE "_journeys_v_version_days" ADD COLUMN "highlight" boolean;
  ALTER TABLE "_journeys_v_version_days_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_journeys_v" ADD COLUMN "version_duration_short" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "home" ADD COLUMN "featured_event_id" integer;
  ALTER TABLE "home_locales" ADD COLUMN "event_label" varchar;
  ALTER TABLE "home_locales" ADD COLUMN "event_cta_label" varchar;
  ALTER TABLE "_home_v" ADD COLUMN "version_featured_event_id" integer;
  ALTER TABLE "_home_v_locales" ADD COLUMN "version_event_label" varchar;
  ALTER TABLE "_home_v_locales" ADD COLUMN "version_event_cta_label" varchar;
  ALTER TABLE "site" ADD COLUMN "nav_event_direct" boolean DEFAULT true;
  ALTER TABLE "site_locales" ADD COLUMN "nav_events" varchar;
  ALTER TABLE "_site_v" ADD COLUMN "version_nav_event_direct" boolean DEFAULT true;
  ALTER TABLE "_site_v_locales" ADD COLUMN "version_nav_events" varchar;
  ALTER TABLE "events_dates" ADD CONSTRAINT "events_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_dates_locales" ADD CONSTRAINT "events_dates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_days_list" ADD CONSTRAINT "events_days_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_days_list_locales" ADD CONSTRAINT "events_days_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_days_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_days_notes" ADD CONSTRAINT "events_days_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_days_notes_locales" ADD CONSTRAINT "events_days_notes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_days_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_days" ADD CONSTRAINT "events_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_days_locales" ADD CONSTRAINT "events_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_place_image_id_media_id_fk" FOREIGN KEY ("place_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_default_journey_id_journeys_id_fk" FOREIGN KEY ("default_journey_id") REFERENCES "public"."journeys"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_pdf_id_media_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_closing_image_id_media_id_fk" FOREIGN KEY ("closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_home_image_id_media_id_fk" FOREIGN KEY ("home_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_journeys_fk" FOREIGN KEY ("journeys_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_dates" ADD CONSTRAINT "_events_v_version_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_dates_locales" ADD CONSTRAINT "_events_v_version_dates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_days_list" ADD CONSTRAINT "_events_v_version_days_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_days_list_locales" ADD CONSTRAINT "_events_v_version_days_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_days_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_days_notes" ADD CONSTRAINT "_events_v_version_days_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_days_notes_locales" ADD CONSTRAINT "_events_v_version_days_notes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_days_notes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_days" ADD CONSTRAINT "_events_v_version_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_days_locales" ADD CONSTRAINT "_events_v_version_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_place_image_id_media_id_fk" FOREIGN KEY ("version_place_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_default_journey_id_journeys_id_fk" FOREIGN KEY ("version_default_journey_id") REFERENCES "public"."journeys"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_pdf_id_media_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_closing_image_id_media_id_fk" FOREIGN KEY ("version_closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_home_image_id_media_id_fk" FOREIGN KEY ("version_home_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_journeys_fk" FOREIGN KEY ("journeys_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_dates_order_idx" ON "events_dates" USING btree ("_order");
  CREATE INDEX "events_dates_parent_id_idx" ON "events_dates" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_dates_locales_locale_parent_id_unique" ON "events_dates_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_days_list_order_idx" ON "events_days_list" USING btree ("_order");
  CREATE INDEX "events_days_list_parent_id_idx" ON "events_days_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_days_list_locales_locale_parent_id_unique" ON "events_days_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_days_notes_order_idx" ON "events_days_notes" USING btree ("_order");
  CREATE INDEX "events_days_notes_parent_id_idx" ON "events_days_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_days_notes_locales_locale_parent_id_unique" ON "events_days_notes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_days_order_idx" ON "events_days" USING btree ("_order");
  CREATE INDEX "events_days_parent_id_idx" ON "events_days" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_days_locales_locale_parent_id_unique" ON "events_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_hero_image_idx" ON "events" USING btree ("hero_image_id");
  CREATE INDEX "events_place_image_idx" ON "events" USING btree ("place_image_id");
  CREATE INDEX "events_default_journey_idx" ON "events" USING btree ("default_journey_id");
  CREATE INDEX "events_pdf_idx" ON "events" USING btree ("pdf_id");
  CREATE INDEX "events_closing_image_idx" ON "events" USING btree ("closing_image_id");
  CREATE INDEX "events_home_image_idx" ON "events" USING btree ("home_image_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_by_idx" ON "events" USING btree ("updated_by_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_journeys_id_idx" ON "events_rels" USING btree ("journeys_id");
  CREATE INDEX "_events_v_version_dates_order_idx" ON "_events_v_version_dates" USING btree ("_order");
  CREATE INDEX "_events_v_version_dates_parent_id_idx" ON "_events_v_version_dates" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_events_v_version_dates_locales_locale_parent_id_unique" ON "_events_v_version_dates_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_days_list_order_idx" ON "_events_v_version_days_list" USING btree ("_order");
  CREATE INDEX "_events_v_version_days_list_parent_id_idx" ON "_events_v_version_days_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_events_v_version_days_list_locales_locale_parent_id_unique" ON "_events_v_version_days_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_days_notes_order_idx" ON "_events_v_version_days_notes" USING btree ("_order");
  CREATE INDEX "_events_v_version_days_notes_parent_id_idx" ON "_events_v_version_days_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_events_v_version_days_notes_locales_locale_parent_id_unique" ON "_events_v_version_days_notes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_version_days_order_idx" ON "_events_v_version_days" USING btree ("_order");
  CREATE INDEX "_events_v_version_days_parent_id_idx" ON "_events_v_version_days" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_events_v_version_days_locales_locale_parent_id_unique" ON "_events_v_version_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_hero_image_idx" ON "_events_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_events_v_version_version_place_image_idx" ON "_events_v" USING btree ("version_place_image_id");
  CREATE INDEX "_events_v_version_version_default_journey_idx" ON "_events_v" USING btree ("version_default_journey_id");
  CREATE INDEX "_events_v_version_version_pdf_idx" ON "_events_v" USING btree ("version_pdf_id");
  CREATE INDEX "_events_v_version_version_closing_image_idx" ON "_events_v" USING btree ("version_closing_image_id");
  CREATE INDEX "_events_v_version_version_home_image_idx" ON "_events_v" USING btree ("version_home_image_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_by_idx" ON "_events_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_journeys_id_idx" ON "_events_v_rels" USING btree ("journeys_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_featured_event_id_events_id_fk" FOREIGN KEY ("featured_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_featured_event_id_events_id_fk" FOREIGN KEY ("version_featured_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "home_featured_event_idx" ON "home" USING btree ("featured_event_id");
  CREATE INDEX "_home_v_version_version_featured_event_idx" ON "_home_v" USING btree ("version_featured_event_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_dates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_dates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_days_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_days_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_days_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_days_notes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_days_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_dates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_dates_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_days_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_days_list_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_days_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_days_notes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_days_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_dates" CASCADE;
  DROP TABLE "events_dates_locales" CASCADE;
  DROP TABLE "events_days_list" CASCADE;
  DROP TABLE "events_days_list_locales" CASCADE;
  DROP TABLE "events_days_notes" CASCADE;
  DROP TABLE "events_days_notes_locales" CASCADE;
  DROP TABLE "events_days" CASCADE;
  DROP TABLE "events_days_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_dates" CASCADE;
  DROP TABLE "_events_v_version_dates_locales" CASCADE;
  DROP TABLE "_events_v_version_days_list" CASCADE;
  DROP TABLE "_events_v_version_days_list_locales" CASCADE;
  DROP TABLE "_events_v_version_days_notes" CASCADE;
  DROP TABLE "_events_v_version_days_notes_locales" CASCADE;
  DROP TABLE "_events_v_version_days" CASCADE;
  DROP TABLE "_events_v_version_days_locales" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_featured_event_id_events_id_fk";
  
  ALTER TABLE "_home_v" DROP CONSTRAINT "_home_v_version_featured_event_id_events_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "home_featured_event_idx";
  DROP INDEX "_home_v_version_version_featured_event_idx";
  ALTER TABLE "journeys_days" DROP COLUMN "highlight";
  ALTER TABLE "journeys_days_locales" DROP COLUMN "kicker";
  ALTER TABLE "journeys" DROP COLUMN "duration_short";
  ALTER TABLE "_journeys_v_version_days" DROP COLUMN "highlight";
  ALTER TABLE "_journeys_v_version_days_locales" DROP COLUMN "kicker";
  ALTER TABLE "_journeys_v" DROP COLUMN "version_duration_short";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "home" DROP COLUMN "featured_event_id";
  ALTER TABLE "home_locales" DROP COLUMN "event_label";
  ALTER TABLE "home_locales" DROP COLUMN "event_cta_label";
  ALTER TABLE "_home_v" DROP COLUMN "version_featured_event_id";
  ALTER TABLE "_home_v_locales" DROP COLUMN "version_event_label";
  ALTER TABLE "_home_v_locales" DROP COLUMN "version_event_cta_label";
  ALTER TABLE "site" DROP COLUMN "nav_event_direct";
  ALTER TABLE "site_locales" DROP COLUMN "nav_events";
  ALTER TABLE "_site_v" DROP COLUMN "version_nav_event_direct";
  ALTER TABLE "_site_v_locales" DROP COLUMN "version_nav_events";
  DROP TYPE "public"."enum_events_days_list_style";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_days_list_style";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";`)
}

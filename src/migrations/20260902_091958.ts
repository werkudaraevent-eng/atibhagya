import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_products_suitable_for" AS ENUM('solo', 'couple', 'group', 'corporate', 'community');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_suitable_for" AS ENUM('solo', 'couple', 'group', 'corporate', 'community');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_journeys_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journeys_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journeys_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'en', 'id');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_about_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_catalogue_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__catalogue_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__catalogue_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_inquiry_form_fields_kind" AS ENUM('custom', 'pick', 'ideas', 'name', 'email', 'phone', 'audience', 'organisation', 'pax', 'location', 'date', 'goal', 'notes');
  CREATE TYPE "public"."enum_inquiry_form_fields_source" AS ENUM('products', 'journeys', 'categories');
  CREATE TYPE "public"."enum_inquiry_form_fields_date_mode" AS ENUM('month', 'date');
  CREATE TYPE "public"."enum_inquiry_form_fields_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum_inquiry_form_fields_type" AS ENUM('text', 'textarea', 'email', 'tel', 'number', 'date', 'month', 'select', 'multiselect', 'checkbox');
  CREATE TYPE "public"."enum_inquiry_form_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__inquiry_form_v_version_fields_kind" AS ENUM('custom', 'pick', 'ideas', 'name', 'email', 'phone', 'audience', 'organisation', 'pax', 'location', 'date', 'goal', 'notes');
  CREATE TYPE "public"."enum__inquiry_form_v_version_fields_source" AS ENUM('products', 'journeys', 'categories');
  CREATE TYPE "public"."enum__inquiry_form_v_version_fields_date_mode" AS ENUM('month', 'date');
  CREATE TYPE "public"."enum__inquiry_form_v_version_fields_width" AS ENUM('half', 'full');
  CREATE TYPE "public"."enum__inquiry_form_v_version_fields_type" AS ENUM('text', 'textarea', 'email', 'tel', 'number', 'date', 'month', 'select', 'multiselect', 'checkbox');
  CREATE TYPE "public"."enum__inquiry_form_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__inquiry_form_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_site_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_facilities_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_suitable_for" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_suitable_for",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"code" varchar,
  	"category_id" integer,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"highlight_text" varchar,
  	"duration_text" varchar,
  	"what_to_expect" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"venues_id" integer,
  	"facilitators_id" integer
  );
  
  CREATE TABLE "_products_v_version_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_facilities_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_suitable_for" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_suitable_for",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_code" varchar,
  	"version_category_id" integer,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_description" varchar,
  	"version_highlight_text" varchar,
  	"version_duration_text" varchar,
  	"version_what_to_expect" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"venues_id" integer,
  	"facilitators_id" integer
  );
  
  CREATE TABLE "journeys_days_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"product_id" integer,
  	"venue_id" integer
  );
  
  CREATE TABLE "journeys_days_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "journeys_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "journeys_days_locales" (
  	"title" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "journeys_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "journeys_facilities_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "journeys_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "journeys_inclusions_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "journeys_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "journeys_exclusions_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "journeys_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "journeys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journeys_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "journeys_locales" (
  	"title" varchar,
  	"positioning" varchar,
  	"description" varchar,
  	"summary" varchar,
  	"duration_text" varchar,
  	"suggested_pax" varchar,
  	"location_preference" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "journeys_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"facilitators_id" integer
  );
  
  CREATE TABLE "_journeys_v_version_days_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"product_id" integer,
  	"venue_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journeys_v_version_days_items_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journeys_v_version_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journeys_v_version_days_locales" (
  	"title" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journeys_v_version_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journeys_v_version_facilities_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journeys_v_version_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journeys_v_version_inclusions_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journeys_v_version_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journeys_v_version_exclusions_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journeys_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journeys_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journeys_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__journeys_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_journeys_v_locales" (
  	"version_title" varchar,
  	"version_positioning" varchar,
  	"version_description" varchar,
  	"version_summary" varchar,
  	"version_duration_text" varchar,
  	"version_suggested_pax" varchar,
  	"version_location_preference" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journeys_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"facilitators_id" integer
  );
  
  CREATE TABLE "venues" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "venues_locales" (
  	"location" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "facilitators" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilitators_locales" (
  	"role" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries_custom_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "inquiries_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"audience" varchar,
  	"organisation" varchar,
  	"pax" varchar,
  	"preferred_location" varchar,
  	"preferred_date" varchar,
  	"goal" varchar,
  	"notes" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"locale" "enum_inquiries_locale" DEFAULT 'en',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"journeys_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"credit_url" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"cover_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'inquiries' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"products_id" integer,
  	"journeys_id" integer,
  	"venues_id" integer,
  	"facilitators_id" integer,
  	"inquiries_id" integer,
  	"media_id" integer,
  	"posts_id" integer,
  	"users_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_pillars_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"hero_video_file_id" integer,
  	"hero_video" varchar,
  	"cta_image_id" integer,
  	"_status" "enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_statement" varchar,
  	"hero_cta_label" varchar,
  	"why_eyebrow" varchar,
  	"why_headline" varchar,
  	"why_body" varchar,
  	"featured_eyebrow" varchar,
  	"featured_headline" varchar,
  	"cta_headline" varchar,
  	"cta_body" varchar,
  	"cta_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_home_v_version_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_pillars_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_image_id" integer,
  	"version_hero_video_file_id" integer,
  	"version_hero_video" varchar,
  	"version_cta_image_id" integer,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_statement" varchar,
  	"version_hero_cta_label" varchar,
  	"version_why_eyebrow" varchar,
  	"version_why_headline" varchar,
  	"version_why_body" varchar,
  	"version_featured_eyebrow" varchar,
  	"version_featured_headline" varchar,
  	"version_cta_headline" varchar,
  	"version_cta_body" varchar,
  	"version_cta_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "about_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_values_locales" (
  	"title" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_status" "enum_about_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"eyebrow" varchar,
  	"headline" varchar,
  	"lede" varchar,
  	"statement" varchar,
  	"cta_headline" varchar,
  	"cta_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_v_version_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_body_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_v_version_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_values_locales" (
  	"title" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_image_id" integer,
  	"version__status" "enum__about_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__about_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_about_v_locales" (
  	"version_eyebrow" varchar,
  	"version_headline" varchar,
  	"version_lede" varchar,
  	"version_statement" varchar,
  	"version_cta_headline" varchar,
  	"version_cta_label" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "catalogue" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_catalogue_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "catalogue_locales" (
  	"products_eyebrow" varchar,
  	"products_headline" varchar,
  	"products_intro" varchar,
  	"product_detail_eyebrow" varchar,
  	"journeys_eyebrow" varchar,
  	"journeys_headline" varchar,
  	"journeys_intro" varchar,
  	"journey_detail_eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_catalogue_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__catalogue_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__catalogue_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_catalogue_v_locales" (
  	"version_products_eyebrow" varchar,
  	"version_products_headline" varchar,
  	"version_products_intro" varchar,
  	"version_product_detail_eyebrow" varchar,
  	"version_journeys_eyebrow" varchar,
  	"version_journeys_headline" varchar,
  	"version_journeys_intro" varchar,
  	"version_journey_detail_eyebrow" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiry_form_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "inquiry_form_fields_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "inquiry_form_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"kind" "enum_inquiry_form_fields_kind" DEFAULT 'custom',
  	"source" "enum_inquiry_form_fields_source" DEFAULT 'products',
  	"multiple" boolean DEFAULT true,
  	"date_mode" "enum_inquiry_form_fields_date_mode" DEFAULT 'month',
  	"required" boolean DEFAULT false,
  	"width" "enum_inquiry_form_fields_width" DEFAULT 'half',
  	"name" varchar,
  	"type" "enum_inquiry_form_fields_type" DEFAULT 'text',
  	"show_when" jsonb
  );
  
  CREATE TABLE "inquiry_form_fields_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"help" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "inquiry_form" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_inquiry_form_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "inquiry_form_locales" (
  	"eyebrow" varchar,
  	"headline" varchar,
  	"lede" varchar,
  	"add_custom_label" varchar,
  	"required_note" varchar,
  	"submit_label" varchar,
  	"done_eyebrow" varchar,
  	"done_heading" varchar,
  	"done_body" varchar,
  	"done_contact" varchar,
  	"done_back" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_inquiry_form_v_version_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_inquiry_form_v_version_fields_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_inquiry_form_v_version_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"kind" "enum__inquiry_form_v_version_fields_kind" DEFAULT 'custom',
  	"source" "enum__inquiry_form_v_version_fields_source" DEFAULT 'products',
  	"multiple" boolean DEFAULT true,
  	"date_mode" "enum__inquiry_form_v_version_fields_date_mode" DEFAULT 'month',
  	"required" boolean DEFAULT false,
  	"width" "enum__inquiry_form_v_version_fields_width" DEFAULT 'half',
  	"name" varchar,
  	"type" "enum__inquiry_form_v_version_fields_type" DEFAULT 'text',
  	"show_when" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_inquiry_form_v_version_fields_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"help" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_inquiry_form_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__inquiry_form_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__inquiry_form_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_inquiry_form_v_locales" (
  	"version_eyebrow" varchar,
  	"version_headline" varchar,
  	"version_lede" varchar,
  	"version_add_custom_label" varchar,
  	"version_required_note" varchar,
  	"version_submit_label" varchar,
  	"version_done_eyebrow" varchar,
  	"version_done_heading" varchar,
  	"version_done_body" varchar,
  	"version_done_contact" varchar,
  	"version_done_back" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "site_inquiry_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"inquiry_from_name" varchar,
  	"_status" "enum_site_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_locales" (
  	"whatsapp_label" varchar,
  	"address" varchar,
  	"footer_tagline" varchar,
  	"footer_legal" varchar,
  	"response_time" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v_version_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v_version_inquiry_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"email" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_whatsapp" varchar,
  	"version_inquiry_from_name" varchar,
  	"version__status" "enum__site_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_v_locales" (
  	"version_whatsapp_label" varchar,
  	"version_address" varchar,
  	"version_footer_tagline" varchar,
  	"version_footer_legal" varchar,
  	"version_response_time" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_facilities" ADD CONSTRAINT "products_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_facilities_locales" ADD CONSTRAINT "products_facilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_suitable_for" ADD CONSTRAINT "products_suitable_for_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_facilitators_fk" FOREIGN KEY ("facilitators_id") REFERENCES "public"."facilitators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_facilities" ADD CONSTRAINT "_products_v_version_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_facilities_locales" ADD CONSTRAINT "_products_v_version_facilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_suitable_for" ADD CONSTRAINT "_products_v_version_suitable_for_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_product_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_facilitators_fk" FOREIGN KEY ("facilitators_id") REFERENCES "public"."facilitators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_days_items" ADD CONSTRAINT "journeys_days_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys_days_items" ADD CONSTRAINT "journeys_days_items_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys_days_items" ADD CONSTRAINT "journeys_days_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_days_items_locales" ADD CONSTRAINT "journeys_days_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys_days_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_days" ADD CONSTRAINT "journeys_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_days_locales" ADD CONSTRAINT "journeys_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_facilities" ADD CONSTRAINT "journeys_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_facilities_locales" ADD CONSTRAINT "journeys_facilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_inclusions" ADD CONSTRAINT "journeys_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_inclusions_locales" ADD CONSTRAINT "journeys_inclusions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys_inclusions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_exclusions" ADD CONSTRAINT "journeys_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_exclusions_locales" ADD CONSTRAINT "journeys_exclusions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys_exclusions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_gallery" ADD CONSTRAINT "journeys_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys_gallery" ADD CONSTRAINT "journeys_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys" ADD CONSTRAINT "journeys_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys_locales" ADD CONSTRAINT "journeys_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_rels" ADD CONSTRAINT "journeys_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_rels" ADD CONSTRAINT "journeys_rels_facilitators_fk" FOREIGN KEY ("facilitators_id") REFERENCES "public"."facilitators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_days_items" ADD CONSTRAINT "_journeys_v_version_days_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_days_items" ADD CONSTRAINT "_journeys_v_version_days_items_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_days_items" ADD CONSTRAINT "_journeys_v_version_days_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v_version_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_days_items_locales" ADD CONSTRAINT "_journeys_v_version_days_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v_version_days_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_days" ADD CONSTRAINT "_journeys_v_version_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_days_locales" ADD CONSTRAINT "_journeys_v_version_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v_version_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_facilities" ADD CONSTRAINT "_journeys_v_version_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_facilities_locales" ADD CONSTRAINT "_journeys_v_version_facilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v_version_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_inclusions" ADD CONSTRAINT "_journeys_v_version_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_inclusions_locales" ADD CONSTRAINT "_journeys_v_version_inclusions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v_version_inclusions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_exclusions" ADD CONSTRAINT "_journeys_v_version_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_exclusions_locales" ADD CONSTRAINT "_journeys_v_version_exclusions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v_version_exclusions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_gallery" ADD CONSTRAINT "_journeys_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journeys_v_version_gallery" ADD CONSTRAINT "_journeys_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v" ADD CONSTRAINT "_journeys_v_parent_id_journeys_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journeys"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journeys_v" ADD CONSTRAINT "_journeys_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journeys_v_locales" ADD CONSTRAINT "_journeys_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_rels" ADD CONSTRAINT "_journeys_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_journeys_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journeys_v_rels" ADD CONSTRAINT "_journeys_v_rels_facilitators_fk" FOREIGN KEY ("facilitators_id") REFERENCES "public"."facilitators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues_locales" ADD CONSTRAINT "venues_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilitators" ADD CONSTRAINT "facilitators_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilitators_locales" ADD CONSTRAINT "facilitators_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."facilitators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_custom_activities" ADD CONSTRAINT "inquiries_custom_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_answers" ADD CONSTRAINT "inquiries_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_rels" ADD CONSTRAINT "inquiries_rels_journeys_fk" FOREIGN KEY ("journeys_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journeys_fk" FOREIGN KEY ("journeys_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_venues_fk" FOREIGN KEY ("venues_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilitators_fk" FOREIGN KEY ("facilitators_id") REFERENCES "public"."facilitators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_pillars" ADD CONSTRAINT "home_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_pillars_locales" ADD CONSTRAINT "home_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_video_file_id_media_id_fk" FOREIGN KEY ("hero_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_pillars" ADD CONSTRAINT "_home_v_version_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_pillars_locales" ADD CONSTRAINT "_home_v_version_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_hero_video_file_id_media_id_fk" FOREIGN KEY ("version_hero_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_cta_image_id_media_id_fk" FOREIGN KEY ("version_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_body" ADD CONSTRAINT "about_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_body_locales" ADD CONSTRAINT "about_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values" ADD CONSTRAINT "about_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_values_locales" ADD CONSTRAINT "about_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_body" ADD CONSTRAINT "_about_v_version_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_body_locales" ADD CONSTRAINT "_about_v_version_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v_version_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_values" ADD CONSTRAINT "_about_v_version_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_values_locales" ADD CONSTRAINT "_about_v_version_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v_version_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v_locales" ADD CONSTRAINT "_about_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalogue_locales" ADD CONSTRAINT "catalogue_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalogue"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_catalogue_v_locales" ADD CONSTRAINT "_catalogue_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_catalogue_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_form_fields_options" ADD CONSTRAINT "inquiry_form_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_form_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_form_fields_options_locales" ADD CONSTRAINT "inquiry_form_fields_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_form_fields_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_form_fields" ADD CONSTRAINT "inquiry_form_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_form_fields_locales" ADD CONSTRAINT "inquiry_form_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_form_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiry_form_locales" ADD CONSTRAINT "inquiry_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiry_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_inquiry_form_v_version_fields_options" ADD CONSTRAINT "_inquiry_form_v_version_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_inquiry_form_v_version_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_inquiry_form_v_version_fields_options_locales" ADD CONSTRAINT "_inquiry_form_v_version_fields_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_inquiry_form_v_version_fields_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_inquiry_form_v_version_fields" ADD CONSTRAINT "_inquiry_form_v_version_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_inquiry_form_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_inquiry_form_v_version_fields_locales" ADD CONSTRAINT "_inquiry_form_v_version_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_inquiry_form_v_version_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_inquiry_form_v_locales" ADD CONSTRAINT "_inquiry_form_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_inquiry_form_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_social" ADD CONSTRAINT "site_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_inquiry_recipients" ADD CONSTRAINT "site_inquiry_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_locales" ADD CONSTRAINT "site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_social" ADD CONSTRAINT "_site_v_version_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_inquiry_recipients" ADD CONSTRAINT "_site_v_version_inquiry_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_locales" ADD CONSTRAINT "_site_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_facilities_order_idx" ON "products_facilities" USING btree ("_order");
  CREATE INDEX "products_facilities_parent_id_idx" ON "products_facilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_facilities_locales_locale_parent_id_unique" ON "products_facilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_suitable_for_order_idx" ON "products_suitable_for" USING btree ("order");
  CREATE INDEX "products_suitable_for_parent_idx" ON "products_suitable_for" USING btree ("parent_id");
  CREATE INDEX "products_hero_image_idx" ON "products" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "products_code_idx" ON "products" USING btree ("code");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_venues_id_idx" ON "products_rels" USING btree ("venues_id");
  CREATE INDEX "products_rels_facilitators_id_idx" ON "products_rels" USING btree ("facilitators_id");
  CREATE INDEX "_products_v_version_facilities_order_idx" ON "_products_v_version_facilities" USING btree ("_order");
  CREATE INDEX "_products_v_version_facilities_parent_id_idx" ON "_products_v_version_facilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_facilities_locales_locale_parent_id_uniq" ON "_products_v_version_facilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_version_suitable_for_order_idx" ON "_products_v_version_suitable_for" USING btree ("order");
  CREATE INDEX "_products_v_version_suitable_for_parent_idx" ON "_products_v_version_suitable_for" USING btree ("parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_hero_image_idx" ON "_products_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_products_v_version_version_code_idx" ON "_products_v" USING btree ("version_code");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_venues_id_idx" ON "_products_v_rels" USING btree ("venues_id");
  CREATE INDEX "_products_v_rels_facilitators_id_idx" ON "_products_v_rels" USING btree ("facilitators_id");
  CREATE INDEX "journeys_days_items_order_idx" ON "journeys_days_items" USING btree ("_order");
  CREATE INDEX "journeys_days_items_parent_id_idx" ON "journeys_days_items" USING btree ("_parent_id");
  CREATE INDEX "journeys_days_items_product_idx" ON "journeys_days_items" USING btree ("product_id");
  CREATE INDEX "journeys_days_items_venue_idx" ON "journeys_days_items" USING btree ("venue_id");
  CREATE UNIQUE INDEX "journeys_days_items_locales_locale_parent_id_unique" ON "journeys_days_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journeys_days_order_idx" ON "journeys_days" USING btree ("_order");
  CREATE INDEX "journeys_days_parent_id_idx" ON "journeys_days" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "journeys_days_locales_locale_parent_id_unique" ON "journeys_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journeys_facilities_order_idx" ON "journeys_facilities" USING btree ("_order");
  CREATE INDEX "journeys_facilities_parent_id_idx" ON "journeys_facilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "journeys_facilities_locales_locale_parent_id_unique" ON "journeys_facilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journeys_inclusions_order_idx" ON "journeys_inclusions" USING btree ("_order");
  CREATE INDEX "journeys_inclusions_parent_id_idx" ON "journeys_inclusions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "journeys_inclusions_locales_locale_parent_id_unique" ON "journeys_inclusions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journeys_exclusions_order_idx" ON "journeys_exclusions" USING btree ("_order");
  CREATE INDEX "journeys_exclusions_parent_id_idx" ON "journeys_exclusions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "journeys_exclusions_locales_locale_parent_id_unique" ON "journeys_exclusions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journeys_gallery_order_idx" ON "journeys_gallery" USING btree ("_order");
  CREATE INDEX "journeys_gallery_parent_id_idx" ON "journeys_gallery" USING btree ("_parent_id");
  CREATE INDEX "journeys_gallery_image_idx" ON "journeys_gallery" USING btree ("image_id");
  CREATE INDEX "journeys_hero_image_idx" ON "journeys" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "journeys_slug_idx" ON "journeys" USING btree ("slug");
  CREATE INDEX "journeys_updated_at_idx" ON "journeys" USING btree ("updated_at");
  CREATE INDEX "journeys_created_at_idx" ON "journeys" USING btree ("created_at");
  CREATE INDEX "journeys__status_idx" ON "journeys" USING btree ("_status");
  CREATE UNIQUE INDEX "journeys_locales_locale_parent_id_unique" ON "journeys_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journeys_rels_order_idx" ON "journeys_rels" USING btree ("order");
  CREATE INDEX "journeys_rels_parent_idx" ON "journeys_rels" USING btree ("parent_id");
  CREATE INDEX "journeys_rels_path_idx" ON "journeys_rels" USING btree ("path");
  CREATE INDEX "journeys_rels_facilitators_id_idx" ON "journeys_rels" USING btree ("facilitators_id");
  CREATE INDEX "_journeys_v_version_days_items_order_idx" ON "_journeys_v_version_days_items" USING btree ("_order");
  CREATE INDEX "_journeys_v_version_days_items_parent_id_idx" ON "_journeys_v_version_days_items" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_days_items_product_idx" ON "_journeys_v_version_days_items" USING btree ("product_id");
  CREATE INDEX "_journeys_v_version_days_items_venue_idx" ON "_journeys_v_version_days_items" USING btree ("venue_id");
  CREATE UNIQUE INDEX "_journeys_v_version_days_items_locales_locale_parent_id_uniq" ON "_journeys_v_version_days_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journeys_v_version_days_order_idx" ON "_journeys_v_version_days" USING btree ("_order");
  CREATE INDEX "_journeys_v_version_days_parent_id_idx" ON "_journeys_v_version_days" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_journeys_v_version_days_locales_locale_parent_id_unique" ON "_journeys_v_version_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journeys_v_version_facilities_order_idx" ON "_journeys_v_version_facilities" USING btree ("_order");
  CREATE INDEX "_journeys_v_version_facilities_parent_id_idx" ON "_journeys_v_version_facilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_journeys_v_version_facilities_locales_locale_parent_id_uniq" ON "_journeys_v_version_facilities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journeys_v_version_inclusions_order_idx" ON "_journeys_v_version_inclusions" USING btree ("_order");
  CREATE INDEX "_journeys_v_version_inclusions_parent_id_idx" ON "_journeys_v_version_inclusions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_journeys_v_version_inclusions_locales_locale_parent_id_uniq" ON "_journeys_v_version_inclusions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journeys_v_version_exclusions_order_idx" ON "_journeys_v_version_exclusions" USING btree ("_order");
  CREATE INDEX "_journeys_v_version_exclusions_parent_id_idx" ON "_journeys_v_version_exclusions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_journeys_v_version_exclusions_locales_locale_parent_id_uniq" ON "_journeys_v_version_exclusions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journeys_v_version_gallery_order_idx" ON "_journeys_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_journeys_v_version_gallery_parent_id_idx" ON "_journeys_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_gallery_image_idx" ON "_journeys_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_journeys_v_parent_idx" ON "_journeys_v" USING btree ("parent_id");
  CREATE INDEX "_journeys_v_version_version_hero_image_idx" ON "_journeys_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_journeys_v_version_version_slug_idx" ON "_journeys_v" USING btree ("version_slug");
  CREATE INDEX "_journeys_v_version_version_updated_at_idx" ON "_journeys_v" USING btree ("version_updated_at");
  CREATE INDEX "_journeys_v_version_version_created_at_idx" ON "_journeys_v" USING btree ("version_created_at");
  CREATE INDEX "_journeys_v_version_version__status_idx" ON "_journeys_v" USING btree ("version__status");
  CREATE INDEX "_journeys_v_created_at_idx" ON "_journeys_v" USING btree ("created_at");
  CREATE INDEX "_journeys_v_updated_at_idx" ON "_journeys_v" USING btree ("updated_at");
  CREATE INDEX "_journeys_v_snapshot_idx" ON "_journeys_v" USING btree ("snapshot");
  CREATE INDEX "_journeys_v_published_locale_idx" ON "_journeys_v" USING btree ("published_locale");
  CREATE INDEX "_journeys_v_latest_idx" ON "_journeys_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_journeys_v_locales_locale_parent_id_unique" ON "_journeys_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journeys_v_rels_order_idx" ON "_journeys_v_rels" USING btree ("order");
  CREATE INDEX "_journeys_v_rels_parent_idx" ON "_journeys_v_rels" USING btree ("parent_id");
  CREATE INDEX "_journeys_v_rels_path_idx" ON "_journeys_v_rels" USING btree ("path");
  CREATE INDEX "_journeys_v_rels_facilitators_id_idx" ON "_journeys_v_rels" USING btree ("facilitators_id");
  CREATE INDEX "venues_image_idx" ON "venues" USING btree ("image_id");
  CREATE INDEX "venues_updated_at_idx" ON "venues" USING btree ("updated_at");
  CREATE INDEX "venues_created_at_idx" ON "venues" USING btree ("created_at");
  CREATE UNIQUE INDEX "venues_locales_locale_parent_id_unique" ON "venues_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "facilitators_photo_idx" ON "facilitators" USING btree ("photo_id");
  CREATE INDEX "facilitators_updated_at_idx" ON "facilitators" USING btree ("updated_at");
  CREATE INDEX "facilitators_created_at_idx" ON "facilitators" USING btree ("created_at");
  CREATE UNIQUE INDEX "facilitators_locales_locale_parent_id_unique" ON "facilitators_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_custom_activities_order_idx" ON "inquiries_custom_activities" USING btree ("_order");
  CREATE INDEX "inquiries_custom_activities_parent_id_idx" ON "inquiries_custom_activities" USING btree ("_parent_id");
  CREATE INDEX "inquiries_answers_order_idx" ON "inquiries_answers" USING btree ("_order");
  CREATE INDEX "inquiries_answers_parent_id_idx" ON "inquiries_answers" USING btree ("_parent_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "inquiries_rels_order_idx" ON "inquiries_rels" USING btree ("order");
  CREATE INDEX "inquiries_rels_parent_idx" ON "inquiries_rels" USING btree ("parent_id");
  CREATE INDEX "inquiries_rels_path_idx" ON "inquiries_rels" USING btree ("path");
  CREATE INDEX "inquiries_rels_products_id_idx" ON "inquiries_rels" USING btree ("products_id");
  CREATE INDEX "inquiries_rels_journeys_id_idx" ON "inquiries_rels" USING btree ("journeys_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_journeys_id_idx" ON "payload_locked_documents_rels" USING btree ("journeys_id");
  CREATE INDEX "payload_locked_documents_rels_venues_id_idx" ON "payload_locked_documents_rels" USING btree ("venues_id");
  CREATE INDEX "payload_locked_documents_rels_facilitators_id_idx" ON "payload_locked_documents_rels" USING btree ("facilitators_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_pillars_order_idx" ON "home_pillars" USING btree ("_order");
  CREATE INDEX "home_pillars_parent_id_idx" ON "home_pillars" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_pillars_locales_locale_parent_id_unique" ON "home_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_hero_image_idx" ON "home" USING btree ("hero_image_id");
  CREATE INDEX "home_hero_video_file_idx" ON "home" USING btree ("hero_video_file_id");
  CREATE INDEX "home_cta_image_idx" ON "home" USING btree ("cta_image_id");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_products_id_idx" ON "home_rels" USING btree ("products_id");
  CREATE INDEX "_home_v_version_pillars_order_idx" ON "_home_v_version_pillars" USING btree ("_order");
  CREATE INDEX "_home_v_version_pillars_parent_id_idx" ON "_home_v_version_pillars" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_pillars_locales_locale_parent_id_unique" ON "_home_v_version_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_version_hero_image_idx" ON "_home_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_home_v_version_version_hero_video_file_idx" ON "_home_v" USING btree ("version_hero_video_file_id");
  CREATE INDEX "_home_v_version_version_cta_image_idx" ON "_home_v" USING btree ("version_cta_image_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_snapshot_idx" ON "_home_v" USING btree ("snapshot");
  CREATE INDEX "_home_v_published_locale_idx" ON "_home_v" USING btree ("published_locale");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_home_v_locales_locale_parent_id_unique" ON "_home_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_rels_order_idx" ON "_home_v_rels" USING btree ("order");
  CREATE INDEX "_home_v_rels_parent_idx" ON "_home_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_v_rels_path_idx" ON "_home_v_rels" USING btree ("path");
  CREATE INDEX "_home_v_rels_products_id_idx" ON "_home_v_rels" USING btree ("products_id");
  CREATE INDEX "about_body_order_idx" ON "about_body" USING btree ("_order");
  CREATE INDEX "about_body_parent_id_idx" ON "about_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_body_locales_locale_parent_id_unique" ON "about_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_values_order_idx" ON "about_values" USING btree ("_order");
  CREATE INDEX "about_values_parent_id_idx" ON "about_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_values_locales_locale_parent_id_unique" ON "about_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_image_idx" ON "about" USING btree ("image_id");
  CREATE INDEX "about__status_idx" ON "about" USING btree ("_status");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_v_version_body_order_idx" ON "_about_v_version_body" USING btree ("_order");
  CREATE INDEX "_about_v_version_body_parent_id_idx" ON "_about_v_version_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_about_v_version_body_locales_locale_parent_id_unique" ON "_about_v_version_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_v_version_values_order_idx" ON "_about_v_version_values" USING btree ("_order");
  CREATE INDEX "_about_v_version_values_parent_id_idx" ON "_about_v_version_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_about_v_version_values_locales_locale_parent_id_unique" ON "_about_v_version_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_v_version_version_image_idx" ON "_about_v" USING btree ("version_image_id");
  CREATE INDEX "_about_v_version_version__status_idx" ON "_about_v" USING btree ("version__status");
  CREATE INDEX "_about_v_created_at_idx" ON "_about_v" USING btree ("created_at");
  CREATE INDEX "_about_v_updated_at_idx" ON "_about_v" USING btree ("updated_at");
  CREATE INDEX "_about_v_snapshot_idx" ON "_about_v" USING btree ("snapshot");
  CREATE INDEX "_about_v_published_locale_idx" ON "_about_v" USING btree ("published_locale");
  CREATE INDEX "_about_v_latest_idx" ON "_about_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_about_v_locales_locale_parent_id_unique" ON "_about_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "catalogue__status_idx" ON "catalogue" USING btree ("_status");
  CREATE UNIQUE INDEX "catalogue_locales_locale_parent_id_unique" ON "catalogue_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_catalogue_v_version_version__status_idx" ON "_catalogue_v" USING btree ("version__status");
  CREATE INDEX "_catalogue_v_created_at_idx" ON "_catalogue_v" USING btree ("created_at");
  CREATE INDEX "_catalogue_v_updated_at_idx" ON "_catalogue_v" USING btree ("updated_at");
  CREATE INDEX "_catalogue_v_snapshot_idx" ON "_catalogue_v" USING btree ("snapshot");
  CREATE INDEX "_catalogue_v_published_locale_idx" ON "_catalogue_v" USING btree ("published_locale");
  CREATE INDEX "_catalogue_v_latest_idx" ON "_catalogue_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_catalogue_v_locales_locale_parent_id_unique" ON "_catalogue_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiry_form_fields_options_order_idx" ON "inquiry_form_fields_options" USING btree ("_order");
  CREATE INDEX "inquiry_form_fields_options_parent_id_idx" ON "inquiry_form_fields_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "inquiry_form_fields_options_locales_locale_parent_id_unique" ON "inquiry_form_fields_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiry_form_fields_order_idx" ON "inquiry_form_fields" USING btree ("_order");
  CREATE INDEX "inquiry_form_fields_parent_id_idx" ON "inquiry_form_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "inquiry_form_fields_locales_locale_parent_id_unique" ON "inquiry_form_fields_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiry_form__status_idx" ON "inquiry_form" USING btree ("_status");
  CREATE UNIQUE INDEX "inquiry_form_locales_locale_parent_id_unique" ON "inquiry_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_inquiry_form_v_version_fields_options_order_idx" ON "_inquiry_form_v_version_fields_options" USING btree ("_order");
  CREATE INDEX "_inquiry_form_v_version_fields_options_parent_id_idx" ON "_inquiry_form_v_version_fields_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_inquiry_form_v_version_fields_options_locales_locale_parent" ON "_inquiry_form_v_version_fields_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_inquiry_form_v_version_fields_order_idx" ON "_inquiry_form_v_version_fields" USING btree ("_order");
  CREATE INDEX "_inquiry_form_v_version_fields_parent_id_idx" ON "_inquiry_form_v_version_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_inquiry_form_v_version_fields_locales_locale_parent_id_uniq" ON "_inquiry_form_v_version_fields_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_inquiry_form_v_version_version__status_idx" ON "_inquiry_form_v" USING btree ("version__status");
  CREATE INDEX "_inquiry_form_v_created_at_idx" ON "_inquiry_form_v" USING btree ("created_at");
  CREATE INDEX "_inquiry_form_v_updated_at_idx" ON "_inquiry_form_v" USING btree ("updated_at");
  CREATE INDEX "_inquiry_form_v_snapshot_idx" ON "_inquiry_form_v" USING btree ("snapshot");
  CREATE INDEX "_inquiry_form_v_published_locale_idx" ON "_inquiry_form_v" USING btree ("published_locale");
  CREATE INDEX "_inquiry_form_v_latest_idx" ON "_inquiry_form_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_inquiry_form_v_locales_locale_parent_id_unique" ON "_inquiry_form_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_social_order_idx" ON "site_social" USING btree ("_order");
  CREATE INDEX "site_social_parent_id_idx" ON "site_social" USING btree ("_parent_id");
  CREATE INDEX "site_inquiry_recipients_order_idx" ON "site_inquiry_recipients" USING btree ("_order");
  CREATE INDEX "site_inquiry_recipients_parent_id_idx" ON "site_inquiry_recipients" USING btree ("_parent_id");
  CREATE INDEX "site__status_idx" ON "site" USING btree ("_status");
  CREATE UNIQUE INDEX "site_locales_locale_parent_id_unique" ON "site_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_version_social_order_idx" ON "_site_v_version_social" USING btree ("_order");
  CREATE INDEX "_site_v_version_social_parent_id_idx" ON "_site_v_version_social" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_inquiry_recipients_order_idx" ON "_site_v_version_inquiry_recipients" USING btree ("_order");
  CREATE INDEX "_site_v_version_inquiry_recipients_parent_id_idx" ON "_site_v_version_inquiry_recipients" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_version__status_idx" ON "_site_v" USING btree ("version__status");
  CREATE INDEX "_site_v_created_at_idx" ON "_site_v" USING btree ("created_at");
  CREATE INDEX "_site_v_updated_at_idx" ON "_site_v" USING btree ("updated_at");
  CREATE INDEX "_site_v_snapshot_idx" ON "_site_v" USING btree ("snapshot");
  CREATE INDEX "_site_v_published_locale_idx" ON "_site_v" USING btree ("published_locale");
  CREATE INDEX "_site_v_latest_idx" ON "_site_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_v_locales_locale_parent_id_unique" ON "_site_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "products_facilities" CASCADE;
  DROP TABLE "products_facilities_locales" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_suitable_for" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_facilities" CASCADE;
  DROP TABLE "_products_v_version_facilities_locales" CASCADE;
  DROP TABLE "_products_v_version_gallery" CASCADE;
  DROP TABLE "_products_v_version_suitable_for" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "journeys_days_items" CASCADE;
  DROP TABLE "journeys_days_items_locales" CASCADE;
  DROP TABLE "journeys_days" CASCADE;
  DROP TABLE "journeys_days_locales" CASCADE;
  DROP TABLE "journeys_facilities" CASCADE;
  DROP TABLE "journeys_facilities_locales" CASCADE;
  DROP TABLE "journeys_inclusions" CASCADE;
  DROP TABLE "journeys_inclusions_locales" CASCADE;
  DROP TABLE "journeys_exclusions" CASCADE;
  DROP TABLE "journeys_exclusions_locales" CASCADE;
  DROP TABLE "journeys_gallery" CASCADE;
  DROP TABLE "journeys" CASCADE;
  DROP TABLE "journeys_locales" CASCADE;
  DROP TABLE "journeys_rels" CASCADE;
  DROP TABLE "_journeys_v_version_days_items" CASCADE;
  DROP TABLE "_journeys_v_version_days_items_locales" CASCADE;
  DROP TABLE "_journeys_v_version_days" CASCADE;
  DROP TABLE "_journeys_v_version_days_locales" CASCADE;
  DROP TABLE "_journeys_v_version_facilities" CASCADE;
  DROP TABLE "_journeys_v_version_facilities_locales" CASCADE;
  DROP TABLE "_journeys_v_version_inclusions" CASCADE;
  DROP TABLE "_journeys_v_version_inclusions_locales" CASCADE;
  DROP TABLE "_journeys_v_version_exclusions" CASCADE;
  DROP TABLE "_journeys_v_version_exclusions_locales" CASCADE;
  DROP TABLE "_journeys_v_version_gallery" CASCADE;
  DROP TABLE "_journeys_v" CASCADE;
  DROP TABLE "_journeys_v_locales" CASCADE;
  DROP TABLE "_journeys_v_rels" CASCADE;
  DROP TABLE "venues" CASCADE;
  DROP TABLE "venues_locales" CASCADE;
  DROP TABLE "facilitators" CASCADE;
  DROP TABLE "facilitators_locales" CASCADE;
  DROP TABLE "inquiries_custom_activities" CASCADE;
  DROP TABLE "inquiries_answers" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "inquiries_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_pillars" CASCADE;
  DROP TABLE "home_pillars_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "_home_v_version_pillars" CASCADE;
  DROP TABLE "_home_v_version_pillars_locales" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_home_v_locales" CASCADE;
  DROP TABLE "_home_v_rels" CASCADE;
  DROP TABLE "about_body" CASCADE;
  DROP TABLE "about_body_locales" CASCADE;
  DROP TABLE "about_values" CASCADE;
  DROP TABLE "about_values_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "_about_v_version_body" CASCADE;
  DROP TABLE "_about_v_version_body_locales" CASCADE;
  DROP TABLE "_about_v_version_values" CASCADE;
  DROP TABLE "_about_v_version_values_locales" CASCADE;
  DROP TABLE "_about_v" CASCADE;
  DROP TABLE "_about_v_locales" CASCADE;
  DROP TABLE "catalogue" CASCADE;
  DROP TABLE "catalogue_locales" CASCADE;
  DROP TABLE "_catalogue_v" CASCADE;
  DROP TABLE "_catalogue_v_locales" CASCADE;
  DROP TABLE "inquiry_form_fields_options" CASCADE;
  DROP TABLE "inquiry_form_fields_options_locales" CASCADE;
  DROP TABLE "inquiry_form_fields" CASCADE;
  DROP TABLE "inquiry_form_fields_locales" CASCADE;
  DROP TABLE "inquiry_form" CASCADE;
  DROP TABLE "inquiry_form_locales" CASCADE;
  DROP TABLE "_inquiry_form_v_version_fields_options" CASCADE;
  DROP TABLE "_inquiry_form_v_version_fields_options_locales" CASCADE;
  DROP TABLE "_inquiry_form_v_version_fields" CASCADE;
  DROP TABLE "_inquiry_form_v_version_fields_locales" CASCADE;
  DROP TABLE "_inquiry_form_v" CASCADE;
  DROP TABLE "_inquiry_form_v_locales" CASCADE;
  DROP TABLE "site_social" CASCADE;
  DROP TABLE "site_inquiry_recipients" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "site_locales" CASCADE;
  DROP TABLE "_site_v_version_social" CASCADE;
  DROP TABLE "_site_v_version_inquiry_recipients" CASCADE;
  DROP TABLE "_site_v" CASCADE;
  DROP TABLE "_site_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_suitable_for";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_suitable_for";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_journeys_status";
  DROP TYPE "public"."enum__journeys_v_version_status";
  DROP TYPE "public"."enum__journeys_v_published_locale";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum__home_v_published_locale";
  DROP TYPE "public"."enum_about_status";
  DROP TYPE "public"."enum__about_v_version_status";
  DROP TYPE "public"."enum__about_v_published_locale";
  DROP TYPE "public"."enum_catalogue_status";
  DROP TYPE "public"."enum__catalogue_v_version_status";
  DROP TYPE "public"."enum__catalogue_v_published_locale";
  DROP TYPE "public"."enum_inquiry_form_fields_kind";
  DROP TYPE "public"."enum_inquiry_form_fields_source";
  DROP TYPE "public"."enum_inquiry_form_fields_date_mode";
  DROP TYPE "public"."enum_inquiry_form_fields_width";
  DROP TYPE "public"."enum_inquiry_form_fields_type";
  DROP TYPE "public"."enum_inquiry_form_status";
  DROP TYPE "public"."enum__inquiry_form_v_version_fields_kind";
  DROP TYPE "public"."enum__inquiry_form_v_version_fields_source";
  DROP TYPE "public"."enum__inquiry_form_v_version_fields_date_mode";
  DROP TYPE "public"."enum__inquiry_form_v_version_fields_width";
  DROP TYPE "public"."enum__inquiry_form_v_version_fields_type";
  DROP TYPE "public"."enum__inquiry_form_v_version_status";
  DROP TYPE "public"."enum__inquiry_form_v_published_locale";
  DROP TYPE "public"."enum_site_status";
  DROP TYPE "public"."enum__site_v_version_status";
  DROP TYPE "public"."enum__site_v_published_locale";`)
}

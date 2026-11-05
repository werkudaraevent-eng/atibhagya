import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  CREATE INDEX "product_categories_locales_parent_id_idx" ON "product_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "products_facilities_locales_parent_id_idx" ON "products_facilities_locales" USING btree ("_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_facilities_locales_parent_id_idx" ON "_products_v_version_facilities_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "journeys_days_items_locales_parent_id_idx" ON "journeys_days_items_locales" USING btree ("_parent_id");
  CREATE INDEX "journeys_days_locales_parent_id_idx" ON "journeys_days_locales" USING btree ("_parent_id");
  CREATE INDEX "journeys_facilities_locales_parent_id_idx" ON "journeys_facilities_locales" USING btree ("_parent_id");
  CREATE INDEX "journeys_inclusions_locales_parent_id_idx" ON "journeys_inclusions_locales" USING btree ("_parent_id");
  CREATE INDEX "journeys_exclusions_locales_parent_id_idx" ON "journeys_exclusions_locales" USING btree ("_parent_id");
  CREATE INDEX "journeys_locales_parent_id_idx" ON "journeys_locales" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_days_items_locales_parent_id_idx" ON "_journeys_v_version_days_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_days_locales_parent_id_idx" ON "_journeys_v_version_days_locales" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_facilities_locales_parent_id_idx" ON "_journeys_v_version_facilities_locales" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_inclusions_locales_parent_id_idx" ON "_journeys_v_version_inclusions_locales" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_version_exclusions_locales_parent_id_idx" ON "_journeys_v_version_exclusions_locales" USING btree ("_parent_id");
  CREATE INDEX "_journeys_v_locales_parent_id_idx" ON "_journeys_v_locales" USING btree ("_parent_id");
  CREATE INDEX "events_dates_locales_parent_id_idx" ON "events_dates_locales" USING btree ("_parent_id");
  CREATE INDEX "events_days_list_locales_parent_id_idx" ON "events_days_list_locales" USING btree ("_parent_id");
  CREATE INDEX "events_days_notes_locales_parent_id_idx" ON "events_days_notes_locales" USING btree ("_parent_id");
  CREATE INDEX "events_days_locales_parent_id_idx" ON "events_days_locales" USING btree ("_parent_id");
  CREATE INDEX "events_downloads_locales_parent_id_idx" ON "events_downloads_locales" USING btree ("_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "events_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_dates_locales_parent_id_idx" ON "_events_v_version_dates_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_days_list_locales_parent_id_idx" ON "_events_v_version_days_list_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_days_notes_locales_parent_id_idx" ON "_events_v_version_days_notes_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_days_locales_parent_id_idx" ON "_events_v_version_days_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_downloads_locales_parent_id_idx" ON "_events_v_version_downloads_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_locales_parent_id_idx" ON "_events_v_locales" USING btree ("_parent_id");
  CREATE INDEX "venues_locales_parent_id_idx" ON "venues_locales" USING btree ("_parent_id");
  CREATE INDEX "facilitators_locales_parent_id_idx" ON "facilitators_locales" USING btree ("_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE INDEX "home_pillars_locales_parent_id_idx" ON "home_pillars_locales" USING btree ("_parent_id");
  CREATE INDEX "home_locales_parent_id_idx" ON "home_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_pillars_locales_parent_id_idx" ON "_home_v_version_pillars_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_locales_parent_id_idx" ON "_home_v_locales" USING btree ("_parent_id");
  CREATE INDEX "about_body_locales_parent_id_idx" ON "about_body_locales" USING btree ("_parent_id");
  CREATE INDEX "about_values_locales_parent_id_idx" ON "about_values_locales" USING btree ("_parent_id");
  CREATE INDEX "about_locales_parent_id_idx" ON "about_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_body_locales_parent_id_idx" ON "_about_v_version_body_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_values_locales_parent_id_idx" ON "_about_v_version_values_locales" USING btree ("_parent_id");
  CREATE INDEX "_about_v_locales_parent_id_idx" ON "_about_v_locales" USING btree ("_parent_id");
  CREATE INDEX "catalogue_locales_parent_id_idx" ON "catalogue_locales" USING btree ("_parent_id");
  CREATE INDEX "_catalogue_v_locales_parent_id_idx" ON "_catalogue_v_locales" USING btree ("_parent_id");
  CREATE INDEX "inquiry_form_fields_options_locales_parent_id_idx" ON "inquiry_form_fields_options_locales" USING btree ("_parent_id");
  CREATE INDEX "inquiry_form_fields_locales_parent_id_idx" ON "inquiry_form_fields_locales" USING btree ("_parent_id");
  CREATE INDEX "inquiry_form_locales_parent_id_idx" ON "inquiry_form_locales" USING btree ("_parent_id");
  CREATE INDEX "_inquiry_form_v_version_fields_options_locales_parent_id_idx" ON "_inquiry_form_v_version_fields_options_locales" USING btree ("_parent_id");
  CREATE INDEX "_inquiry_form_v_version_fields_locales_parent_id_idx" ON "_inquiry_form_v_version_fields_locales" USING btree ("_parent_id");
  CREATE INDEX "_inquiry_form_v_locales_parent_id_idx" ON "_inquiry_form_v_locales" USING btree ("_parent_id");
  CREATE INDEX "site_locales_parent_id_idx" ON "site_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_locales_parent_id_idx" ON "_site_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "product_categories_locales_parent_id_idx";
  DROP INDEX "products_facilities_locales_parent_id_idx";
  DROP INDEX "products_locales_parent_id_idx";
  DROP INDEX "_products_v_version_facilities_locales_parent_id_idx";
  DROP INDEX "_products_v_locales_parent_id_idx";
  DROP INDEX "journeys_days_items_locales_parent_id_idx";
  DROP INDEX "journeys_days_locales_parent_id_idx";
  DROP INDEX "journeys_facilities_locales_parent_id_idx";
  DROP INDEX "journeys_inclusions_locales_parent_id_idx";
  DROP INDEX "journeys_exclusions_locales_parent_id_idx";
  DROP INDEX "journeys_locales_parent_id_idx";
  DROP INDEX "_journeys_v_version_days_items_locales_parent_id_idx";
  DROP INDEX "_journeys_v_version_days_locales_parent_id_idx";
  DROP INDEX "_journeys_v_version_facilities_locales_parent_id_idx";
  DROP INDEX "_journeys_v_version_inclusions_locales_parent_id_idx";
  DROP INDEX "_journeys_v_version_exclusions_locales_parent_id_idx";
  DROP INDEX "_journeys_v_locales_parent_id_idx";
  DROP INDEX "events_dates_locales_parent_id_idx";
  DROP INDEX "events_days_list_locales_parent_id_idx";
  DROP INDEX "events_days_notes_locales_parent_id_idx";
  DROP INDEX "events_days_locales_parent_id_idx";
  DROP INDEX "events_downloads_locales_parent_id_idx";
  DROP INDEX "events_locales_parent_id_idx";
  DROP INDEX "_events_v_version_dates_locales_parent_id_idx";
  DROP INDEX "_events_v_version_days_list_locales_parent_id_idx";
  DROP INDEX "_events_v_version_days_notes_locales_parent_id_idx";
  DROP INDEX "_events_v_version_days_locales_parent_id_idx";
  DROP INDEX "_events_v_version_downloads_locales_parent_id_idx";
  DROP INDEX "_events_v_locales_parent_id_idx";
  DROP INDEX "venues_locales_parent_id_idx";
  DROP INDEX "facilitators_locales_parent_id_idx";
  DROP INDEX "media_locales_parent_id_idx";
  DROP INDEX "posts_locales_parent_id_idx";
  DROP INDEX "_posts_v_locales_parent_id_idx";
  DROP INDEX "home_pillars_locales_parent_id_idx";
  DROP INDEX "home_locales_parent_id_idx";
  DROP INDEX "_home_v_version_pillars_locales_parent_id_idx";
  DROP INDEX "_home_v_locales_parent_id_idx";
  DROP INDEX "about_body_locales_parent_id_idx";
  DROP INDEX "about_values_locales_parent_id_idx";
  DROP INDEX "about_locales_parent_id_idx";
  DROP INDEX "_about_v_version_body_locales_parent_id_idx";
  DROP INDEX "_about_v_version_values_locales_parent_id_idx";
  DROP INDEX "_about_v_locales_parent_id_idx";
  DROP INDEX "catalogue_locales_parent_id_idx";
  DROP INDEX "_catalogue_v_locales_parent_id_idx";
  DROP INDEX "inquiry_form_fields_options_locales_parent_id_idx";
  DROP INDEX "inquiry_form_fields_locales_parent_id_idx";
  DROP INDEX "inquiry_form_locales_parent_id_idx";
  DROP INDEX "_inquiry_form_v_version_fields_options_locales_parent_id_idx";
  DROP INDEX "_inquiry_form_v_version_fields_locales_parent_id_idx";
  DROP INDEX "_inquiry_form_v_locales_parent_id_idx";
  DROP INDEX "site_locales_parent_id_idx";
  DROP INDEX "_site_v_locales_parent_id_idx";
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";`)
}

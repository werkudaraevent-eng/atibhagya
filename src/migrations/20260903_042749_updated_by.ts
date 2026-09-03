import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_categories" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "products" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "journeys" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_journeys_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "venues" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "facilitators" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "media" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "posts" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "home" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_home_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "about" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_about_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "catalogue" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_catalogue_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "inquiry_form" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_inquiry_form_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "site" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_site_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys" ADD CONSTRAINT "journeys_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journeys_v" ADD CONSTRAINT "_journeys_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "venues" ADD CONSTRAINT "venues_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilitators" ADD CONSTRAINT "facilitators_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "catalogue" ADD CONSTRAINT "catalogue_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_catalogue_v" ADD CONSTRAINT "_catalogue_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiry_form" ADD CONSTRAINT "inquiry_form_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_inquiry_form_v" ADD CONSTRAINT "_inquiry_form_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_v" ADD CONSTRAINT "_site_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_categories_updated_by_idx" ON "product_categories" USING btree ("updated_by_id");
  CREATE INDEX "products_updated_by_idx" ON "products" USING btree ("updated_by_id");
  CREATE INDEX "_products_v_version_version_updated_by_idx" ON "_products_v" USING btree ("version_updated_by_id");
  CREATE INDEX "journeys_updated_by_idx" ON "journeys" USING btree ("updated_by_id");
  CREATE INDEX "_journeys_v_version_version_updated_by_idx" ON "_journeys_v" USING btree ("version_updated_by_id");
  CREATE INDEX "venues_updated_by_idx" ON "venues" USING btree ("updated_by_id");
  CREATE INDEX "facilitators_updated_by_idx" ON "facilitators" USING btree ("updated_by_id");
  CREATE INDEX "media_updated_by_idx" ON "media" USING btree ("updated_by_id");
  CREATE INDEX "posts_updated_by_idx" ON "posts" USING btree ("updated_by_id");
  CREATE INDEX "_posts_v_version_version_updated_by_idx" ON "_posts_v" USING btree ("version_updated_by_id");
  CREATE INDEX "home_updated_by_idx" ON "home" USING btree ("updated_by_id");
  CREATE INDEX "_home_v_version_version_updated_by_idx" ON "_home_v" USING btree ("version_updated_by_id");
  CREATE INDEX "about_updated_by_idx" ON "about" USING btree ("updated_by_id");
  CREATE INDEX "_about_v_version_version_updated_by_idx" ON "_about_v" USING btree ("version_updated_by_id");
  CREATE INDEX "catalogue_updated_by_idx" ON "catalogue" USING btree ("updated_by_id");
  CREATE INDEX "_catalogue_v_version_version_updated_by_idx" ON "_catalogue_v" USING btree ("version_updated_by_id");
  CREATE INDEX "inquiry_form_updated_by_idx" ON "inquiry_form" USING btree ("updated_by_id");
  CREATE INDEX "_inquiry_form_v_version_version_updated_by_idx" ON "_inquiry_form_v" USING btree ("version_updated_by_id");
  CREATE INDEX "site_updated_by_idx" ON "site" USING btree ("updated_by_id");
  CREATE INDEX "_site_v_version_version_updated_by_idx" ON "_site_v" USING btree ("version_updated_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_updated_by_id_users_id_fk";
  
  ALTER TABLE "products" DROP CONSTRAINT "products_updated_by_id_users_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "journeys" DROP CONSTRAINT "journeys_updated_by_id_users_id_fk";
  
  ALTER TABLE "_journeys_v" DROP CONSTRAINT "_journeys_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "venues" DROP CONSTRAINT "venues_updated_by_id_users_id_fk";
  
  ALTER TABLE "facilitators" DROP CONSTRAINT "facilitators_updated_by_id_users_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_updated_by_id_users_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_updated_by_id_users_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_updated_by_id_users_id_fk";
  
  ALTER TABLE "_home_v" DROP CONSTRAINT "_home_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_updated_by_id_users_id_fk";
  
  ALTER TABLE "_about_v" DROP CONSTRAINT "_about_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "catalogue" DROP CONSTRAINT "catalogue_updated_by_id_users_id_fk";
  
  ALTER TABLE "_catalogue_v" DROP CONSTRAINT "_catalogue_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "inquiry_form" DROP CONSTRAINT "inquiry_form_updated_by_id_users_id_fk";
  
  ALTER TABLE "_inquiry_form_v" DROP CONSTRAINT "_inquiry_form_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "site" DROP CONSTRAINT "site_updated_by_id_users_id_fk";
  
  ALTER TABLE "_site_v" DROP CONSTRAINT "_site_v_version_updated_by_id_users_id_fk";
  
  DROP INDEX "product_categories_updated_by_idx";
  DROP INDEX "products_updated_by_idx";
  DROP INDEX "_products_v_version_version_updated_by_idx";
  DROP INDEX "journeys_updated_by_idx";
  DROP INDEX "_journeys_v_version_version_updated_by_idx";
  DROP INDEX "venues_updated_by_idx";
  DROP INDEX "facilitators_updated_by_idx";
  DROP INDEX "media_updated_by_idx";
  DROP INDEX "posts_updated_by_idx";
  DROP INDEX "_posts_v_version_version_updated_by_idx";
  DROP INDEX "home_updated_by_idx";
  DROP INDEX "_home_v_version_version_updated_by_idx";
  DROP INDEX "about_updated_by_idx";
  DROP INDEX "_about_v_version_version_updated_by_idx";
  DROP INDEX "catalogue_updated_by_idx";
  DROP INDEX "_catalogue_v_version_version_updated_by_idx";
  DROP INDEX "inquiry_form_updated_by_idx";
  DROP INDEX "_inquiry_form_v_version_version_updated_by_idx";
  DROP INDEX "site_updated_by_idx";
  DROP INDEX "_site_v_version_version_updated_by_idx";
  ALTER TABLE "product_categories" DROP COLUMN "updated_by_id";
  ALTER TABLE "products" DROP COLUMN "updated_by_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "journeys" DROP COLUMN "updated_by_id";
  ALTER TABLE "_journeys_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "venues" DROP COLUMN "updated_by_id";
  ALTER TABLE "facilitators" DROP COLUMN "updated_by_id";
  ALTER TABLE "media" DROP COLUMN "updated_by_id";
  ALTER TABLE "posts" DROP COLUMN "updated_by_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "home" DROP COLUMN "updated_by_id";
  ALTER TABLE "_home_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "about" DROP COLUMN "updated_by_id";
  ALTER TABLE "_about_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "catalogue" DROP COLUMN "updated_by_id";
  ALTER TABLE "_catalogue_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "inquiry_form" DROP COLUMN "updated_by_id";
  ALTER TABLE "_inquiry_form_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "site" DROP COLUMN "updated_by_id";
  ALTER TABLE "_site_v" DROP COLUMN "version_updated_by_id";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// media._objectkey is added by the storage adapter, not by this change; IF NOT
// EXISTS keeps the migration safe where that column is already present, and the
// down step leaves it alone for the same reason.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_locales" ADD COLUMN "products_label" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "products_headline" varchar;
  ALTER TABLE "events_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "_events_v_locales" ADD COLUMN "version_products_label" varchar;
  ALTER TABLE "_events_v_locales" ADD COLUMN "version_products_headline" varchar;
  ALTER TABLE "_events_v_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "inquiries" ADD COLUMN "event_id" integer;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_rels_products_id_idx" ON "events_rels" USING btree ("products_id");
  CREATE INDEX "_events_v_rels_products_id_idx" ON "_events_v_rels" USING btree ("products_id");
  CREATE INDEX "inquiries_event_idx" ON "inquiries" USING btree ("event_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_rels" DROP CONSTRAINT "events_rels_products_fk";
  
  ALTER TABLE "_events_v_rels" DROP CONSTRAINT "_events_v_rels_products_fk";
  
  ALTER TABLE "inquiries" DROP CONSTRAINT "inquiries_event_id_events_id_fk";
  
  DROP INDEX "events_rels_products_id_idx";
  DROP INDEX "_events_v_rels_products_id_idx";
  DROP INDEX "inquiries_event_idx";
  ALTER TABLE "events_locales" DROP COLUMN "products_label";
  ALTER TABLE "events_locales" DROP COLUMN "products_headline";
  ALTER TABLE "events_rels" DROP COLUMN "products_id";
  ALTER TABLE "_events_v_locales" DROP COLUMN "version_products_label";
  ALTER TABLE "_events_v_locales" DROP COLUMN "version_products_headline";
  ALTER TABLE "_events_v_rels" DROP COLUMN "products_id";
  ALTER TABLE "inquiries" DROP COLUMN "event_id";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_element" AS ENUM('earth', 'water', 'fire', 'air', 'ether');
  CREATE TYPE "public"."enum__products_v_version_element" AS ENUM('earth', 'water', 'fire', 'air', 'ether');
  ALTER TABLE "products" ADD COLUMN "element" "enum_products_element";
  ALTER TABLE "_products_v" ADD COLUMN "version_element" "enum__products_v_version_element";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "element";
  ALTER TABLE "_products_v" DROP COLUMN "version_element";
  DROP TYPE "public"."enum_products_element";
  DROP TYPE "public"."enum__products_v_version_element";`)
}

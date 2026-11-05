import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The S3/R2 storage adapter adds a hidden `_objectKey` field to `media`. The
 * Payload 3.92 upgrade migration was generated without a bucket configured,
 * so it missed the column and the production build failed reading `media`.
 * `IF NOT EXISTS`: staging already had the column.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";`)
}

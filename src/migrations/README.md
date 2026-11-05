# Payload migrations

Created with `npm run migrate:create` against a Postgres database (a Neon
dev or staging branch — never production), reviewed, committed together with
the config change that needs them, and applied by `npm run migrate` as the
first step of `npm run build:deploy`.

SQLite in local development does not use these: its schema is pushed
automatically. See README → Deploying.

**Generate with a bucket set.** The S3/R2 storage adapter is only registered
when `S3_BUCKET` is set, and it adds a column to `media` (`_objectkey`).
Production and previews have a bucket, so a migration generated without one
misses that column and the production build fails reading `media`. Any value
works, nothing is uploaded:

    S3_BUCKET=generate npm run migrate:create -- <name>

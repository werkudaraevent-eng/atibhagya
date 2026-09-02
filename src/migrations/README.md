# Payload migrations

Created with `npm run migrate:create` against a Postgres database (a Neon
dev or staging branch — never production), reviewed, committed together with
the config change that needs them, and applied by `npm run migrate` as the
first step of `npm run build:deploy`.

SQLite in local development does not use these: its schema is pushed
automatically. See README → Deploying.

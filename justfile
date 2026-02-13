# https://just.systems/man/en/

import 'variables.just'

mod setup
mod container

set dotenv-load := true

help:
    just --list --unsorted

dev:
    bin/dev

aider-rb *args:
    aider -c .config/aider.conf.rb.yml --cache-prompts {{ args }}

aider-js *args:
    aider -c .config/aider.conf.js.yml --cache-prompts {{ args }}

heroku-pipelines-open:
    heroku pipelines:open {{ heroku_pipeline }}

heroku-pipelines-diff:
    heroku pipelines:diff --app {{ heroku_app_staging }}

heroku-pipelines-promote:
    heroku pipelines:promote --app {{ heroku_app_staging }}

_heroku-pull-db app:
    bin/rails db:drop DISABLE_DATABASE_ENVIRONMENT_CHECK=1
    bin/rails db:create RAILS_ENV=test
    bin/rails db:test:prepare
    heroku pg:pull DATABASE_URL {{ pg_db_prefix }}_development --app {{ app }}

heroku-pull-db-staging:
    just _heroku-pull-db {{ heroku_app_staging }}

heroku-pull-db-production:
    @just _heroku-pull-db {{ heroku_app_production }}
    psql -c "truncate table active_storage_blobs, active_storage_attachments, active_storage_variant_records" -d {{ pg_db_prefix }}_development

# https://just.systems/man/en/

set dotenv-load := true

project_name := "prefab"
heroku_pipeline := "prefab"
heroku_app_staging := "prefab-staging"
heroku_app_production := "prefab-production"
tanookiapp_domain_staging := "prefab-staging.tanookiapp.com"
tanookiapp_domain_production := "prefab-production.tanookiapp.com"
pg_db_development := "tanooki_prefab_development"

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

heroku-git-remote-setup:
    -heroku git:remote -a {{ heroku_app_staging }} --remote staging
    -heroku git:remote -a {{ heroku_app_production }} --remote production

# heroku management

_heroku-buildpacks app:
    heroku buildpacks:clear -a {{ app }}
    heroku buildpacks:add heroku/nodejs -a {{ app }}
    heroku buildpacks:add heroku/ruby -a {{ app }}

_heroku-provision-redis app:
    heroku addons:create heroku-redis:mini -a {{ app }}

_heroku-set-secret-key-base app:
    #!/usr/bin/env bash
    set -euxo pipefail

    SECRET_KEY_BASE=$(heroku config:get SECRET_KEY_BASE --app {{ app }})

    if [[ -z "$SECRET_KEY_BASE" ]]; then
      NEW_SECRET_KEY_BASE=$(rails secret)
      heroku config:set SECRET_KEY_BASE=$NEW_SECRET_KEY_BASE --app {{ app }}
    fi

_heroku-set-default-origin app:
    #!/usr/bin/env bash
    set -euxo pipefail

    EXISTING_ORIGIN=$(heroku config:get ORIGIN --app {{ app }})
    if [[ -z "$EXISTING_ORIGIN" ]]; then
      ORIGIN="https://$(heroku domains --json -r staging | jq -r '.[0].hostname')"
      heroku config:set ORIGIN=$ORIGIN --app {{ app }}
    fi

_tanookiapp-heroku-domains-add app domain:
    heroku domains:add {{ domain }} --app {{ app }}

_tanookiapp-cloudflare-set-cname app domain:
    jo name="{{ domain }}" \
      proxied=true \
      ttl=3600 \
      type=CNAME \
      content=$(heroku domains --json -a {{ app }} | jq -r '.[] | select(.hostname == "{{ domain }}").cname') \
       | curl -i --json @- \
         --header "Authorization: Bearer $(op items get 'Cloudflare tanookiapp api token' --fields credential --reveal)" \
         --url "https://api.cloudflare.com/client/v4/zones/714eb87a667dafedfac5e6b06bdd93d1/dns_records"

_tanookiapp-certs app:
    heroku certs:auto:enable --app {{ app }}
    heroku certs:auto:wait --app {{ app }}

tanookiapp-heroku-domains-add-staging:
    @just _tanookiapp-heroku-domains-add {{ heroku_app_staging }} {{ tanookiapp_domain_staging }}

tanookiapp-heroku-domains-add-production:
    @just _tanookiapp-heroku-domains-add {{ heroku_app_production }} {{ tanookiapp_domain_production }}

tanookiapp-cloudflare-set-cname-staging:
    @just _tanookiapp-cloudflare-set-cname {{ heroku_app_staging }} {{ tanookiapp_domain_staging }}

tanookiapp-cloudflare-set-cname-production:
    @just _tanookiapp-cloudflare-set-cname {{ heroku_app_production }} {{ tanookiapp_domain_production }}

tanookiapp-certs-staging:
    @just _tanookiapp-certs {{ heroku_app_staging }}

tanookiapp-certs-production:
    @just _tanookiapp-certs {{ heroku_app_production }}

tanookiapp-heroku-set-origin-staging:
    heroku config:set ORIGIN=https://{{ tanookiapp_domain_staging }} --app {{ heroku_app_staging }}

tanookiapp-heroku-set-origin-production:
    heroku config:set ORIGIN=https://{{ tanookiapp_domain_production }} --app {{ heroku_app_production }}

_heroku-set-default-env-vars app:
    heroku config:set \
      RACK_ENV=production \
      RAILS_ENV=production \
      LANG=en_US.UTF-8 \
      -a {{ app }}
    just _heroku-set-secret-key-base {{ app }}
    just _heroku-set-default-origin {{ app }}

heroku-buildpacks-setup-staging:
    @just _heroku-buildpacks {{ heroku_app_staging }}

heroku-buildpacks-setup-production:
    @just _heroku-buildpacks {{ heroku_app_production }}

heroku-provision-pg-staging:
    heroku addons:create heroku-postgresql:essential-0 -a {{ heroku_app_staging }}

heroku-provision-pg-production:
    heroku addons:create heroku-postgresql:standard-0 -a {{ heroku_app_production }}

heroku-provision-redis-staging:
    @just _heroku-provision-redis {{ heroku_app_staging }}

heroku-provision-redis-production:
    @just _heroku-provision-redis {{ heroku_app_production }}

heroku-set-default-env-vars-staging:
    @just _heroku-set-default-env-vars {{ heroku_app_staging }}

heroku-set-default-env-vars-production:
    @just _heroku-set-default-env-vars {{ heroku_app_production }}

heroku-set-secret-key-base-staging:
    @just _heroku-set-secret-key-base {{ heroku_app_staging }}

heroku-set-secret-key-base-production:
    @just _heroku-set-secret-key-base {{ heroku_app_production }}

_heroku-pull-db app:
    bin/rails db:drop DISABLE_DATABASE_ENVIRONMENT_CHECK=1
    bin/rails db:create RAILS_ENV=test
    bin/rails db:test:prepare
    heroku pg:pull DATABASE_URL {{ pg_db_development }} --app {{ app }}

heroku-pull-db-staging:
    just _heroku-pull-db {{ heroku_app_staging }}

heroku-pull-db-production:
    @just _heroku-pull-db {{ heroku_app_production }}
    psql -c "truncate table active_storage_blobs, active_storage_attachments, active_storage_variant_records" -d {{ pg_db_development }}

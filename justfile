# https://just.systems/man/en/

set dotenv-load

heroku_pipeline := "prefab"
heroku_app_staging := "prefab-staging"
heroku_app_production := "prefab-production"

dev:
    bin/dev

aider-rb *args:
  aider -c .config/aider.conf.rb.yml --cache-prompts {{args}}

aider-js *args:
  aider -c .config/aider.conf.js.yml --cache-prompts {{args}}

_heroku-buildpacks-setup app:
  heroku buildpacks:clear -a {{app}}
  heroku buildpacks:add heroku/nodejs -a {{app}}
  heroku buildpacks:add heroku/ruby -a {{app}}

heroku-buildpacks-setup-staging:
  just _heroku-buildpacks-setup {{heroku_app_staging}}

heroku-buildpacks-setup-production:
  just _heroku-buildpacks-setup {{heroku_app_staging}}

_heroku-provision-pg app:
   heroku addons:create heroku-postgresql:essential-0 -a {{app}}

heroku-provision-pg-staging:
  just _heroku-provision-pg {{heroku_app_staging}}

heroku-provision-pg-production:
  just _heroku-provision-pg {{heroku_app_production}}

_heroku-provision-redis app:
  heroku addons:create heroku-redis:mini -a {{app}}

heroku-provision-redis-staging:
  just _heroku-provision-redis {{heroku_app_staging}}

heroku-provision-redis-production:
  just _heroku-provision-redis {{heroku_app_production}}

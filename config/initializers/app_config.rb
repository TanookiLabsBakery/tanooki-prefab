require_relative "../../lib/config_builder"

# This class allows easy sharing of config to the frontend
# BACKEND SECRETS SHOULD BE MARKED AS `frontend: false`

# After making changes, run `bin/rails app_config:generate` and restart server to propagate to frontend

class AppConfig < ConfigBuilder
  # Default app name. Build MVP overwrites this via APP_NAME in .env at
  # provisioning time (see DropletCreateService on console-new) so the
  # rendered <title>, meta tags, and PWA manifest reflect the actual
  # project name instead of the template default.
  config :app_name, ENV.fetch("APP_NAME", "AllSpark App"), frontend: true
  config :default_from_email, "#{ENV.fetch("APP_NAME", "AllSpark App")} <notifications@prefab.tanookiapp.com>", frontend: false
  config :direct_uploads_url, -> { Rails.application.routes.url_helpers.rails_direct_uploads_url(host: ENV["ORIGIN"]) }, frontend: true
end

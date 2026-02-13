require_relative "../../lib/config_builder"

# This class allows easy sharing of config to the frontend
# BACKEND SECRETS SHOULD BE MARKED AS `frontend: false`

# After making changes, run `bin/rails app_config:generate` and restart server to propagate to frontend

class AppConfig < ConfigBuilder
  config :app_name, "Tanooki Prefab", frontend: true
  config :default_from_email, "Tanooki Prefab <notifications@prefab.tanookiapp.com>", frontend: false
  config :direct_uploads_url, -> { Rails.application.routes.url_helpers.rails_direct_uploads_url(host: ENV["ORIGIN"]) }, frontend: true
end

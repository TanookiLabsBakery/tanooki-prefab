Rails.application.configure do
  origin = AppOrigin.url
  config.asset_host = origin
  config.action_mailer.default_url_options = {host: origin}
  Rails.application.routes.default_url_options[:host] = origin
end

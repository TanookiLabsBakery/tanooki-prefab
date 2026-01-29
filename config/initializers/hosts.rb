if Rails.env.development?
  origin_uri = AppOrigin.uri
  Rails.application.config.hosts << origin_uri.host
  Rails.application.config.hosts << /.*\.dev.tanookiapp\.com/
end

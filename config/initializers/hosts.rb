if Rails.env.development?
  origin_uri = URI.parse(ENV.fetch("ORIGIN"))
  Rails.application.config.hosts << origin_uri.host
  Rails.application.config.hosts << /.*\.dev.tanookiapp\.com/
end

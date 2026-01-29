if Rails.env.development?
  origin_uri = AppOrigin.uri
  Rails.application.config.hosts << origin_uri.host
  Rails.application.config.hosts << /.*\.dev.tanookiapp\.com/

  if ENV["RAILS_HOSTS"].present?
    ENV["RAILS_HOSTS"].split(",").each do |host|
      Rails.application.config.hosts << host.strip
    end
  end
end

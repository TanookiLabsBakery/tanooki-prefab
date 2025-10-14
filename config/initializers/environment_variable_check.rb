if Rails.env.production?
  %w[
    ORIGIN
    SECRET_KEY_BASE
    DATABASE_URL
    REDIS_URL
    SENTRY_CURRENT_ENV
  ].each do |var|
    raise "#{var} is not set in the environment" if ENV[var].blank?
  end
end

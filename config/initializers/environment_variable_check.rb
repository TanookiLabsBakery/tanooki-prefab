if Rails.env.production?
  %w[
    ORIGIN
    SECRET_KEY_BASE
    DATABASE_URL
    REDIS_URL
  ].each do |var|
    raise "#{var} is not set in the environment" if ENV[var].blank?
  end
end

if Rails.env.production?
  raise "SECRET_KEY_BASE is not set in the environment" if ENV["SECRET_KEY_BASE"].blank?
end

source "https://rubygems.org"

ruby "3.4.6"

gem "rails", "~> 8.1"
gem "pg", "~> 1.6.2"
gem "puma", ">= 7.1"
gem "redis", ">= 5.4.1"
gem "bcrypt", "~> 3.1.7"
gem "tzinfo-data", platforms: %i[windows jruby]
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.14"

gem "graphql"
gem "vite_rails"
gem "mjml-rails"
gem "cool_id", "~> 0.2.4"
gem "sorcery"
gem "action_policy-graphql"
gem "action_policy"
gem "discard"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "brakeman", require: false
  gem "dotenv-rails"
  gem "standard"
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "ruby-lsp-rubyfmt", git: "https://github.com/aaronlifton/ruby-lsp-rubyfmt.git", branch: "main"
  gem "zonebie"
end

group :development do
  gem "annotaterb"
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
  gem "letter_opener"
  gem "letter_opener_web"
end

group :test do
  gem "cuprite"
  gem "thruster"
  gem "capybara-thruster"
end

gem "aws-sdk-s3", require: false

gem "postmark-rails", "~> 0.22.1"

gem "lograge"

gem "sidekiq", "~> 8.0.0"
gem "sidekiq-scheduler", "~> 6.0.1"

gem "sentry-rails"
gem "sentry-sidekiq"

gem "anthropic"

gem "httparty"
gem "nokogiri"

Sidekiq.strict_args!

Sidekiq.configure_server do |config|
  config.redis = {
    url: ENV[ENV.fetch("REDIS_PROVIDER", "REDIS_URL")] ||
      Rails.application.credentials.dig(:redis, :url) ||
      "redis://localhost:6379/1",
    ssl_params: {verify_mode: OpenSSL::SSL::VERIFY_NONE}
  }

  config.death_handlers <<
    lambda do |worker, ex|
      Rails.logger.error("Worker #{worker} failed with exception: #{ex.message}")
      Sentry.capture_exception(ex, {data: worker.to_s})
    end

  # Middleware server attachment
  # config.client_middleware do |chain|
  #   chain.add SidekiqMiddleware::Client::ActorJobAttribute
  # end
  # config.server_middleware do |chain|
  #   chain.add SidekiqMiddleware::Server::ActorSetter
  # end

  config.on(:startup) do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: ENV[ENV.fetch("REDIS_PROVIDER", "REDIS_URL")] ||
      Rails.application.credentials.dig(:redis, :url) ||
      "redis://localhost:6379/1",
    ssl_params: {verify_mode: OpenSSL::SSL::VERIFY_NONE}
  }
  # Middleware Client attachment
  # config.client_middleware do |chain|
  #   chain.add SidekiqMiddleware::Client::ActorJobAttribute
  # end
end

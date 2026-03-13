# Clear CoolId's prefix registry before each code reload in development.
# Without this, Zeitwerk class reloading causes CoolId::DuplicatePrefixError
# because models re-register their prefixes on reload.
if Rails.env.development?
  Rails.application.config.to_prepare do
    CoolId.registry.instance_variable_get(:@prefix_map)&.clear
  end
end

Rails.application.config.generators do |g|
  # limit default generation
  g.test_framework(
    :rspec,
    fixtures: true,
    view_specs: false,
    controller_specs: false,
    routing_specs: false,
    request_specs: false
  )

  g.fixture_replacement :factory_bot, dir: "spec/factories"
  g.factory_bot suffix: "factory"
end

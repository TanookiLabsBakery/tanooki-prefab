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

  # delete the string version of this if this PR is merged
  # https://github.com/rmosolgo/graphql-ruby/pull/5068
  g.graphql "namespaced_types" => true
  g.graphql namespaced_types: true
end

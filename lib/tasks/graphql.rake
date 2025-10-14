require "graphql/rake_task"

GraphQL::RakeTask.new(
  schema_name: "AppSchema",
  load_context: ->(_task) { {visibility_profile: :internal_admin} }
)

require "graphql/rake_task"

GraphQL::RakeTask.new(
  schema_name: "AppSchema",
  namespace: "graphql:public",
  idl_outfile: "schema-public.graphql",
  load_context: ->(_task) { {visibility_profile: :public} }
)

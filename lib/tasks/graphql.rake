require "graphql/rake_task"

GraphQL::RakeTask.new(
  schema_name: "AppSchema",
  load_context: ->(_task) { {visibility_profile: :internal_admin} }
)

namespace :graphql do
  namespace :schemas do
    desc "Dump both internal and public GraphQL schemas to IDL"
    task dump: [:environment, "graphql:schema:idl", "graphql:public:schema:idl"]
  end
end

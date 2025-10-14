# https://graphql-ruby.org/testing/integration_tests.html
module GraphqlHelpers
  class GraphqlError < StandardError; end

  def graphql_execute(query, current_user:, session: nil, variables: nil, allow_errors: false, context: {})
    visibility_profile = if current_user && InternalAdminPolicy.new(nil, user: current_user).apply(:view?)
      :internal_admin
    else
      :public
    end

    result = AppSchema.execute(
      query,
      context: {
        current_user: current_user,
        session: session,
        visibility_profile: visibility_profile
      }.merge(context),
      variables: variables
    )

    if result["errors"] && !allow_errors
      raise "Unexpected graphql errors: #{result["errors"].inspect}"
    end

    result
  end

  def graphql_data(query, current_user:, variables: nil)
    result = graphql_execute(query, current_user: current_user, variables: variables)
    result["data"]
  end
end

RSpec.configure do |c|
  c.include GraphqlHelpers
end

# https://graphql-ruby.org/testing/integration_tests.html
module GraphqlHelpers
  def graphql_execute(query, current_user:, variables: nil, allow_errors: false)
    result = AppSchema.execute(
      query,
      context: {
        current_user:
      },
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

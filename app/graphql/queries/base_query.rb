module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    include ActionPolicy::GraphQL::Behaviour
  end
end

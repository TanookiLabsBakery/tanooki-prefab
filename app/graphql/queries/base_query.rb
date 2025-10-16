module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    include ActionPolicy::GraphQL::Behaviour
    include InternalAdminVisibility
  end
end

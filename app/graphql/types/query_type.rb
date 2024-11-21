# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    include ActionPolicy::GraphQL::Behaviour

    field :node, resolver: Queries::NodeQuery, authorize: true
    field :nodes, resolver: Queries::NodesQuery
    field :viewer, resolver: Queries::ViewerQuery
    field :users, resolver: Queries::UsersQuery
  end
end

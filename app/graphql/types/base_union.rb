# frozen_string_literal: true

module Types
  class BaseUnion < GraphQL::Schema::Union
    edge_type_class(Types::Edges::BaseEdge)
    connection_type_class(Types::Connections::BaseConnection)
  end
end

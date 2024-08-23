# frozen_string_literal: true

module Types
  module BaseInterface
    include GraphQL::Schema::Interface
    edge_type_class(Types::Edges::BaseEdge)
    connection_type_class(Types::Connections::BaseConnection)

    field_class Types::BaseField
  end
end

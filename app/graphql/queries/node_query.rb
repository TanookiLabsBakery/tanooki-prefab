module Queries
  class NodeQuery < BaseQuery
    type GraphQL::Types::Relay::Node, null: true
    description "Fetches an object given its ID."

    argument :id, ID, required: false, description: "ID of the object."

    def resolve(id: nil)
      return nil unless id
      context.schema.object_from_id(id, context)
    end
  end
end

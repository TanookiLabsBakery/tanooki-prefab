module Queries
  class NodesQuery < BaseQuery
    type [GraphQL::Types::Relay::Node, null: true], null: false
    description "Fetches a list of objects given a list of IDs."

    argument :ids, [ID], required: false, description: "IDs of the objects."

    def resolve(ids:)
      nodes = ids.map { |id| context.schema.object_from_id(id, context) }
      # would be better to show error for unauthorized nodes but not sure how, for now silently returning nil is fine
      nodes.map { |node| allowed_to?(:show?, node) ? node : nil }
    end
  end
end

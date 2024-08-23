module Types
  module Connections
    class MembershipConnectionType < BaseConnection
      edge_type(Types::Edges::MembershipEdgeType)

      def nodes
        object.edge_nodes.map(&:organization)
      end
    end
  end
end

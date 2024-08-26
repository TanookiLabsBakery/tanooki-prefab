module Types
  module Edges
    class MembershipEdgeType < BaseEdge
      node_type(Types::Objects::OrganizationType)

      field :role, Enums::MembershipRoleType, null: false
      def membership_role
        object.node.membership_role
      end

      # point node method to the associated org
      def node
        object.node.organization
      end
    end
  end
end

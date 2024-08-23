module Types
  module Enums
    class MembershipRoleEnum < BaseEnum
      description "Membership Role enum"

      rails_enum(Membership.membership_roles)
    end
  end
end

# frozen_string_literal: true

module Types
  class Enums::MembershipRoleType < Types::Enums::BaseEnum
    description "Membership role enum"
    rails_enum(Membership.membership_roles)
  end
end

# frozen_string_literal: true

module Types
  class Enums::UserRoleType < Types::BaseEnum
    description "User role enum"

    rails_enum(User.user_roles)
  end
end

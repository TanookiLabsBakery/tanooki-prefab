module Types
  module Enums
    class UserRoleEnum < BaseEnum
      description "User Role enum"

      rails_enum(User.user_roles)
    end
  end
end

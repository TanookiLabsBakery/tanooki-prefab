module Types
  module Enums
    class UserStatusEnum < BaseEnum
      description "User Status enum"

      rails_enum(User.user_statuses)
    end
  end
end

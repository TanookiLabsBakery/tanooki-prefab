# frozen_string_literal: true

module Types
  class Enums::UserStatusType < Types::Enums::BaseEnum
    description "User status enum"
    rails_enum(User.user_statuses)
  end
end

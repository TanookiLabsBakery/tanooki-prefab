# frozen_string_literal: true

module Types
  class Inputs::UserInputType < Types::BaseInputObject
    argument :email, String, required: false
    argument :first_name, String, required: false
    argument :last_name, String, required: false
    argument :time_zone, String, required: false
    argument :user_status, Types::Enums::UserStatusType, required: false
    argument :user_role, Types::Enums::UserRoleType, required: false
  end
end

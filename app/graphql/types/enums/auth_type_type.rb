# frozen_string_literal: true

module Types
  class Enums::AuthTypeType < Types::BaseEnum
    description "Auth type"

    value "SESSION", value: "session"
    value "TOKEN", value: "token"
  end
end

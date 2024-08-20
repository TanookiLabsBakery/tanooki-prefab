# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :logout, mutation: Mutations::Logout
    field :login_with_credentials, mutation: Mutations::LoginWithCredentials

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end
  end
end

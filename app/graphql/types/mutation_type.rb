# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :email_token_user_auth, mutation: Mutations::EmailTokenUserAuth
    field :credentials_user_auth, mutation: Mutations::CredentialsUserAuth
    field :email_user_auth_challenge, mutation: Mutations::EmailUserAuthChallenge
    field :logout, mutation: Mutations::Logout

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end
  end
end

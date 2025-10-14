# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :internal_admin_user_update, mutation: Mutations::InternalAdmin::UserUpdate
    field :email_token_user_auth, mutation: Mutations::EmailTokenUserAuth
    field :credentials_user_auth, mutation: Mutations::CredentialsUserAuth
    field :email_user_auth_challenge, mutation: Mutations::EmailUserAuthChallenge
    field :logout, mutation: Mutations::Logout

    field :viewer_update, mutation: Mutations::ViewerUpdate
  end
end

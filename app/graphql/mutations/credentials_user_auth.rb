# frozen_string_literal: true

module Mutations
  class CredentialsUserAuth < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :remember_me, Boolean, required: true
    argument :auth_type, Types::Enums::AuthTypeType, required: false

    field :user, Types::Objects::UserType, null: true
    field :csrf_token, String, null: false
    field :auth_token, String, null: true

    def resolve(email:, password:, remember_me:, auth_type: "session")
      user = if auth_type == "session"
        context[:login].call(email.downcase, password, remember_me)
      elsif auth_type == "token"
        user_ = User.find_by(email: email.downcase)
        user_.valid_password?(password) ? user_ : nil
      end

      if user && auth_type == "session"
        csrf_token = context[:form_authenticity_token].call
        {user:, csrf_token:, auth_token: nil}
      elsif user && auth_type == "token"
        auth_token = user.user_auth_tokens.create!.token
        {user:, csrf_token:, auth_token:}
      else
        raise GraphQL::ExecutionError.new("Invalid email or password")
      end
    end
  end
end

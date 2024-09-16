# frozen_string_literal: true

module Mutations
  class EmailTokenUserAuth < BaseMutation
    description "Authenticate a user with an email token"

    argument :email, String, required: true
    argument :token, String, required: true
    argument :time_zone, String, required: true
    argument :auth_type, Types::Enums::AuthTypeType, required: false

    field :success, Boolean, null: false
    field :csrf_token, String, null: false
    field :auth_token, String, null: true

    def resolve(email:, token:, time_zone:, auth_type: "session")
      # TODO: consider if we want to update the user
      # time_zone

      user = User.find_by(email: email.downcase)
      raise GraphQL::ExecutionError, "User not found" unless user

      bypass_code = ENV["DANGEROUS__AUTH_BYPASS_CODE"]

      if bypass_code && token == bypass_code
        auth_token = if auth_type == "session"
          context[:auto_login].call(user.email)
          nil
        else
          user.user_auth_tokens.create!.token
        end
        csrf_token = context[:form_authenticity_token].call
        {success: true, csrf_token: csrf_token, auth_token:}
      else
        challenge = user.user_auth_challenges.order(created_at: :desc).first
        raise GraphQL::ExecutionError, "No challenge found" if challenge.nil?

        if challenge.authenticate(token)
          if challenge.expired?
            raise GraphQL::ExecutionError, "Token has expired"
          else
            auth_token = if auth_type == "session"
              context[:auto_login].call(user.email)
              nil
            else
              user.user_auth_tokens.create!.token
            end
            challenge.update!(claimed_at: Time.current)
            csrf_token = context[:form_authenticity_token].call
            {success: true, csrf_token: csrf_token, auth_token:}
          end
        else
          raise GraphQL::ExecutionError, "Invalid token"
        end
      end
    end
  end
end

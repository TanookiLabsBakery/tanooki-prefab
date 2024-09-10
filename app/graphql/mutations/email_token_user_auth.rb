# frozen_string_literal: true

module Mutations
  class EmailTokenUserAuth < BaseMutation
    description "Authenticate a user with an email token"

    argument :email, String, required: true
    argument :token, String, required: true
    argument :time_zone, String, required: true

    field :success, Boolean, null: false
    field :csrf_token, String, null: false

    def resolve(input)
      email = input[:email]
      token = input[:token]

      # TODO: consider if we want to update the user
      # time_zone = input[:time_zone]

      user = User.find_by(email: email.downcase)
      raise GraphQL::ExecutionError, "User not found" unless user

      bypass_code = ENV["DANGEROUS__AUTH_BYPASS_CODE"]

      if bypass_code && token == bypass_code
        context[:auto_login].call(user.email)
        csrf_token = context[:form_authenticity_token].call
        {success: true, csrf_token: csrf_token}
      else
        challenge = user.user_auth_challenges.order(created_at: :desc).first
        raise GraphQL::ExecutionError, "No challenge found" if challenge.nil?

        if challenge.authenticate(token)
          if challenge.expired?
            raise GraphQL::ExecutionError, "Token has expired"
          else
            context[:auto_login].call(user.email)
            challenge.update!(claimed_at: Time.current)
            csrf_token = context[:form_authenticity_token].call
            {success: true, csrf_token: csrf_token}
          end
        else
          raise GraphQL::ExecutionError, "Invalid token"
        end
      end
    end
  end
end

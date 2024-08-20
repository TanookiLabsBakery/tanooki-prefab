# frozen_string_literal: true

module Mutations
  class EmailTokenUserAuth < BaseMutation
    description "Authenticate a user with an email token"

    argument :email, String, required: true
    argument :token, String, required: true
    argument :time_zone, String, required: true

    field :success, Boolean, null: false

    def resolve(input)
      email = input[:email]
      token = input[:token]

      # TODO: consider if we want to update the user
      # time_zone = input[:time_zone]

      user = User.find_by(email: email.downcase)
      raise GraphQL::ExecutionError, "User not found" unless user

      challenge = user.user_auth_challenges.order(created_at: :desc).first
      raise GraphQL::ExecutionError, "No challenge found" if challenge.nil?

      if challenge.authenticate(token)
        if challenge.expired?
          raise GraphQL::ExecutionError, "Token has expired"
        else
          context[:auto_login].call(user.email)
          challenge.update!(claimed_at: Time.current)
          {success: true}
        end
      else
        raise GraphQL::ExecutionError, "Invalid token"
      end
    end
  end
end

# frozen_string_literal: true

module Mutations
  class EmailUserAuthChallenge < BaseMutation
    description("Send an email to the user with a challenge code")
    field :success, Boolean, null: false

    argument :email, String, required: true
    argument :client_auth_code, String, required: true

    def resolve(email:, client_auth_code:)
      user = User.find_by(email: email.downcase)
      raise GraphQL::ExecutionError, "User not found" unless user

      token = UserAuthChallenge.generate_token

      challenge = UserAuthChallenge.new(
        user: user,
        client_auth_code: client_auth_code,
        timeout_at: UserAuthChallenge.default_timeout.from_now
      )
      challenge.token = token
      challenge.save!

      AuthenticationMailer.auth_challenge_email(user, token, client_auth_code).deliver_later(queue: "mailers")

      {success: true}
    rescue => e
      raise GraphQL::ExecutionError, e.message
    end
  end
end

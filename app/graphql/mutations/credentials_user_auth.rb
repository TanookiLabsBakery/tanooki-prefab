# frozen_string_literal: true

module Mutations
  class CredentialsUserAuth < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :remember_me, Boolean, required: true

    field :user, Types::Objects::UserType, null: true

    def resolve(email:, password:, remember_me:)
      user = context[:login].call(email.downcase, password, remember_me)

      if user
        {user: user}
      else
        raise GraphQL::ExecutionError.new("Invalid email or password")
      end
    end
  end
end

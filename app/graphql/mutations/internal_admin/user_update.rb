# frozen_string_literal: true

module Mutations
  class InternalAdmin::UserUpdate < BaseMutation
    description "Updates a user by id"

    field :user, Types::Objects::UserType, null: false

    argument :id, ID, required: true
    argument :user_input, Types::Inputs::InternalAdmin::UserInputType, required: true

    def resolve(id:, user_input:)
      user = ::User.find(id)
      raise GraphQL::ExecutionError.new "Error updating user", extensions: user.errors.to_hash unless user.update(**user_input)

      {user: user}
    end
  end
end

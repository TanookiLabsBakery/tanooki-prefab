# frozen_string_literal: true

module Mutations
  class UserUpdate < BaseMutation
    description "Updates a user by id"

    field :user, Types::Objects::UserType, null: false

    argument :id, ID, required: true
    argument :user_input, Types::Inputs::UserInputType, required: true

    def resolve(id:, user_input:)
      user = ::User.find(id)
      authorize! user, to: :update?

      unless user.update(user_input.to_h)
        raise ValidationError.new "Error updating user", record: user
      end

      {user: user}
    end
  end
end

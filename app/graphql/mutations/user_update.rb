# frozen_string_literal: true

module Mutations
  class UserUpdate < BaseMutation
    description "Updates a user by id"

    field :user, Types::Objects::UserType, null: false

    argument :id, ID, required: true
    argument :user_input, Types::Inputs::UserInputType, required: true
    argument :avatar_signed_id, ID, required: false
    argument :remove_avatar, Boolean, required: false

    ADMIN_FIELDS = [:user_role, :user_status]

    def resolve(id:, user_input:, avatar_signed_id: nil, remove_avatar: false)
      user = ::User.find(id)
      authorize! user, to: :update?

      user_input_hash = user_input.to_h

      if (user_input_hash.keys & ADMIN_FIELDS).any?
        authorize! user, to: :administrate?
      end

      unless user.update(user_input_hash)
        raise ValidationError.new "Error updating user", record: user
      end

      if avatar_signed_id.present?
        user.avatar.attach(avatar_signed_id)
        user.save!
      end

      if remove_avatar
        user.avatar.purge
      end

      {user: user}
    end
  end
end

# frozen_string_literal: true

module Mutations
  class ViewerUpdate < BaseMutation
    description "Updates the current viewer"

    field :user, Types::Objects::UserType, null: false

    argument :viewer_input, Types::Inputs::ViewerInputType, required: true
    argument :avatar_signed_id, ID, required: false
    argument :remove_avatar, Boolean, required: false

    def resolve(viewer_input:, avatar_signed_id: nil, remove_avatar: false)
      user = context[:current_user]

      unless user.update(viewer_input.to_h)
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

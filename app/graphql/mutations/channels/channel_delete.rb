# frozen_string_literal: true

module Mutations
  module Channels
    class ChannelDelete < BaseMutation
      description "Deletes a channel, disconnecting a social media account"

      field :success, Boolean, null: false

      argument :id, ID, required: true

      def resolve(id:)
        channel = ::Channel.find(id)
        authorize! channel, to: :destroy?
        channel.destroy!
        {success: true}
      end
    end
  end
end

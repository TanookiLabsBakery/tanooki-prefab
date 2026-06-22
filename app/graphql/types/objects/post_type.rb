# frozen_string_literal: true

module Types
  class Objects::PostType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :status, Enums::PostStatusType, null: false
    field :scheduled_at, GraphQL::Types::ISO8601DateTime, null: true
    field :channels, [Types::Objects::ChannelType], null: false
    field :channel_variants, [Types::Objects::PostChannelVariantType], null: false, method: :post_channel_variants
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :viewer_can_approve, Boolean, null: false
    def viewer_can_approve
      allowed_to?(:approve?, object)
    end

    field :viewer_can_request_approval, Boolean, null: false
    def viewer_can_request_approval
      allowed_to?(:request_approval?, object)
    end

    field :viewer_can_repurpose, Boolean, null: false
    def viewer_can_repurpose
      allowed_to?(:repurpose?, object)
    end
  end
end

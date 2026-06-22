# frozen_string_literal: true

module Types
  class Objects::ChannelType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :name, String, null: false
    field :provider, Enums::ChannelProviderType, null: false
    field :remote_id, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

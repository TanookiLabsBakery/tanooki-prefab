# frozen_string_literal: true

module Types
  class Objects::PostChannelVariantType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :body, String, null: true
    field :channel, Types::Objects::ChannelType, null: false
    field :post_analytic, Types::Objects::PostAnalyticType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

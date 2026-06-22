# frozen_string_literal: true

module Types
  class Objects::PostAnalyticType < Types::BaseObject
    implements GraphQL::Types::Relay::Node

    field :impressions, Integer, null: false
    field :likes, Integer, null: false
    field :comments, Integer, null: false
    field :shares, Integer, null: false
    field :reposts, Integer, null: false
    field :fetched_at, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end

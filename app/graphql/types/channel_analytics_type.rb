# frozen_string_literal: true

module Types
  class ChannelAnalyticsType < Types::BaseObject
    field :channel, Types::Objects::ChannelType, null: false
    field :impressions, Integer, null: false
    field :likes, Integer, null: false
    field :engagement_rate, Float, null: false
    field :top_posts, [Types::Objects::PostType], null: false
  end
end

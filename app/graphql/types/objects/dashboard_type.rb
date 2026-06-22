# frozen_string_literal: true

module Types
  class Objects::DashboardType < Types::BaseObject
    field :scheduled_posts, [Types::Objects::PostType], null: false
    field :needs_approval_posts, [Types::Objects::PostType], null: false
    field :recent_published_posts, [Types::Objects::PostType], null: false
    field :channels, [Types::Objects::ChannelType], null: false
  end
end

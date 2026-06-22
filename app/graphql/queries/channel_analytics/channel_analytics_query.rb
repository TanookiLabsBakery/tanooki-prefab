# frozen_string_literal: true

module Queries
  module ChannelAnalytics
    class ChannelAnalyticsQuery < BaseQuery
      type [Types::ChannelAnalyticsType], null: false

      def resolve
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to view analytics" unless organization

        authorize! ::Post, to: :index?, with: PostPolicy

        ::Channel.where(organization_id: organization.id).order(:name).map do |channel|
          channel_analytics_for(channel)
        end
      end

      private

      def channel_analytics_for(channel)
        scope = ::PostChannelVariant
          .joins(:post, :post_analytic)
          .where(channel_id: channel.id)
          .where(posts: {status: "published"})
          .where("posts.scheduled_at > ?", 30.days.ago)

        total_impressions = scope.sum("post_analytics.impressions")
        total_likes = scope.sum("post_analytics.likes")

        engagement_rate = if total_impressions > 0
          ((total_likes.to_f / total_impressions) * 100).round(2)
        else
          0.0
        end

        top_posts = ::Post
          .joins(post_channel_variants: :post_analytic)
          .where(post_channel_variants: {channel_id: channel.id})
          .where(status: "published")
          .where("posts.scheduled_at > ?", 30.days.ago)
          .order("post_analytics.likes DESC")
          .limit(5)

        {
          channel: channel,
          impressions: total_impressions,
          likes: total_likes,
          engagement_rate: engagement_rate,
          top_posts: top_posts
        }
      end
    end
  end
end

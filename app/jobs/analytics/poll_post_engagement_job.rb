# frozen_string_literal: true

module Analytics
  class PollPostEngagementJob < ApplicationJob
    queue_as :analytics

    LOOKBACK_WINDOW = 30.days

    def perform
      published_variants.find_each do |variant|
        update_analytics_for(variant)
      end
    end

    private

    def published_variants
      PostChannelVariant
        .joins(:post)
        .where(posts: {status: "published"})
        .where(posts: {updated_at: LOOKBACK_WINDOW.ago..})
        .includes(:channel, :post_analytic)
    end

    def update_analytics_for(variant)
      stats = Analytics::EngagementFetcher.new(variant).fetch
      analytic = variant.post_analytic || variant.build_post_analytic
      analytic.update!(**stats, fetched_at: Time.current)
    rescue => e
      Rails.logger.error("[Analytics::PollPostEngagementJob] Failed for variant #{variant.id}: #{e.message}")
    end
  end
end

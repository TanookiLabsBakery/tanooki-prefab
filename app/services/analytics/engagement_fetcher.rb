# frozen_string_literal: true

module Analytics
  class EngagementFetcher
    def initialize(post_channel_variant)
      @variant = post_channel_variant
    end

    def fetch
      case @variant.channel.provider
      when "bluesky"
        BlueskyEngagementFetcher.new(@variant).fetch
      else
        default_engagement
      end
    end

    private

    def default_engagement
      {
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        reposts: 0
      }
    end
  end
end

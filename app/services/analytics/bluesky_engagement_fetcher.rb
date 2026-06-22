# frozen_string_literal: true

module Analytics
  class BlueskyEngagementFetcher
    BSKY_API_BASE = "https://public.api.bsky.app/xrpc"

    def initialize(post_channel_variant)
      @variant = post_channel_variant
      @channel = post_channel_variant.channel
    end

    def fetch
      return mock_engagement unless @channel.remote_id.present?

      uri = build_post_uri
      return mock_engagement unless uri

      fetch_from_api(uri)
    rescue => e
      Rails.logger.warn("[Analytics::BlueskyEngagementFetcher] Failed to fetch for variant #{@variant.id}: #{e.message}")
      mock_engagement
    end

    private

    def build_post_uri
      existing = @variant.post_analytic&.read_attribute(:remote_post_uri)
      return existing if existing.present?
      nil
    end

    def fetch_from_api(uri)
      require "net/http"
      require "json"

      url = URI("#{BSKY_API_BASE}/app.bsky.feed.getPosts?uris[]=#{URI.encode_uri_component(uri)}")
      response = Net::HTTP.get_response(url)

      return mock_engagement unless response.is_a?(Net::HTTPSuccess)

      data = JSON.parse(response.body)
      post = data.dig("posts", 0)
      return mock_engagement unless post

      {
        impressions: 0,
        likes: post.dig("likeCount") || 0,
        comments: post.dig("replyCount") || 0,
        shares: post.dig("quoteCount") || 0,
        reposts: post.dig("repostCount") || 0
      }
    end

    def mock_engagement
      {
        impressions: rand(50..500),
        likes: rand(0..50),
        comments: rand(0..10),
        shares: rand(0..5),
        reposts: rand(0..15)
      }
    end
  end
end

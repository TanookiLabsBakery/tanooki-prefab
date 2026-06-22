require "rails_helper"

RSpec.describe Queries::ChannelAnalytics::ChannelAnalyticsQuery do
  let!(:organization) { create(:organization) }
  let!(:current_user) { create(:user, organization: organization) }
  let!(:credential) { create(:credential, organization: organization) }

  let(:query) do
    <<-GRAPHQL
      query ChannelAnalytics {
        channelAnalytics {
          channel {
            id
            name
          }
          impressions
          likes
          engagementRate
          topPosts {
            id
            status
          }
        }
      }
    GRAPHQL
  end

  context "when the user has channels with analytics in the last 30 days" do
    let!(:channel) { create(:channel, organization: organization, credential: credential, name: "My Channel") }
    let!(:post1) { create(:post, organization: organization, status: "published", scheduled_at: 5.days.ago) }
    let!(:post2) { create(:post, organization: organization, status: "published", scheduled_at: 10.days.ago) }
    let!(:variant1) { create(:post_channel_variant, post: post1, channel: channel) }
    let!(:variant2) { create(:post_channel_variant, post: post2, channel: channel) }
    let!(:analytic1) { create(:post_analytic, post_channel_variant: variant1, impressions: 500, likes: 50) }
    let!(:analytic2) { create(:post_analytic, post_channel_variant: variant2, impressions: 200, likes: 20) }

    it "returns aggregated impressions and likes for the channel" do
      result = graphql_execute(query, current_user: current_user)

      analytics = result.dig("data", "channelAnalytics")
      expect(analytics.length).to eq 1

      channel_data = analytics.first
      expect(channel_data.dig("channel", "name")).to eq "My Channel"
      expect(channel_data["impressions"]).to eq 700
      expect(channel_data["likes"]).to eq 70
    end

    it "calculates the engagement rate as likes / impressions * 100" do
      result = graphql_execute(query, current_user: current_user)

      channel_data = result.dig("data", "channelAnalytics", 0)
      expect(channel_data["engagementRate"]).to eq 10.0
    end

    it "returns the top posts ordered by likes descending" do
      result = graphql_execute(query, current_user: current_user)

      top_posts = result.dig("data", "channelAnalytics", 0, "topPosts")
      expect(top_posts.length).to eq 2
      expect(top_posts.first["id"]).to eq post1.id
    end
  end

  context "when posts are older than 30 days" do
    let!(:channel) { create(:channel, organization: organization, credential: credential) }
    let!(:old_post) { create(:post, organization: organization, status: "published", scheduled_at: 45.days.ago) }
    let!(:variant) { create(:post_channel_variant, post: old_post, channel: channel) }
    let!(:analytic) { create(:post_analytic, post_channel_variant: variant, impressions: 1000, likes: 100) }

    it "excludes posts older than 30 days from the aggregates" do
      result = graphql_execute(query, current_user: current_user)

      channel_data = result.dig("data", "channelAnalytics", 0)
      expect(channel_data["impressions"]).to eq 0
      expect(channel_data["likes"]).to eq 0
      expect(channel_data["engagementRate"]).to eq 0.0
      expect(channel_data["topPosts"]).to eq []
    end
  end

  context "when a channel has no analytics at all" do
    let!(:channel) { create(:channel, organization: organization, credential: credential) }

    it "returns zero metrics and an empty top posts list" do
      result = graphql_execute(query, current_user: current_user)

      channel_data = result.dig("data", "channelAnalytics", 0)
      expect(channel_data["impressions"]).to eq 0
      expect(channel_data["likes"]).to eq 0
      expect(channel_data["engagementRate"]).to eq 0.0
      expect(channel_data["topPosts"]).to eq []
    end
  end

  context "when there are multiple channels" do
    let!(:channel1) { create(:channel, organization: organization, credential: credential, name: "Alpha Channel") }
    let!(:channel2) { create(:channel, organization: organization, credential: credential, name: "Beta Channel") }

    it "returns analytics for each channel ordered by name" do
      result = graphql_execute(query, current_user: current_user)

      analytics = result.dig("data", "channelAnalytics")
      expect(analytics.length).to eq 2
      expect(analytics.map { |a| a.dig("channel", "name") }).to eq ["Alpha Channel", "Beta Channel"]
    end
  end

  context "when channels belong to a different organization" do
    let!(:other_org) { create(:organization) }
    let!(:other_credential) { create(:credential, organization: other_org) }
    let!(:other_channel) { create(:channel, organization: other_org, credential: other_credential) }

    it "does not include channels from other organizations" do
      result = graphql_execute(query, current_user: current_user)

      expect(result.dig("data", "channelAnalytics")).to eq []
    end
  end

  context "when no user is authenticated" do
    it "returns an error" do
      result = graphql_execute(query, current_user: nil, allow_errors: true)

      expect(result["errors"]).to be_present
    end
  end
end

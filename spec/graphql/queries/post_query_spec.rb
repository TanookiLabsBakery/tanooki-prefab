require "rails_helper"

RSpec.describe Queries::Posts::PostQuery do
  let!(:organization) { create(:organization) }
  let!(:current_user) { create(:user, organization: organization) }

  let(:query) do
    <<-GRAPHQL
      query Post($id: ID!) {
        post(id: $id) {
          id
          status
          scheduledAt
          channelVariants {
            id
            body
            channel {
              id
              name
            }
            postAnalytic {
              id
              impressions
              likes
              comments
              shares
              reposts
              fetchedAt
            }
          }
        }
      }
    GRAPHQL
  end

  let!(:post) do
    create(:post, organization: organization, status: "published",
      scheduled_at: Time.zone.parse("2026-06-15 10:00:00"))
  end

  context "when the post exists and belongs to the user's organization" do
    it "returns the post with channel variants and analytics" do
      credential = create(:credential, organization: organization)
      channel = create(:channel, organization: organization, credential: credential)
      variant = create(:post_channel_variant, post: post, channel: channel, body: "Hello world")
      analytic = create(:post_analytic, post_channel_variant: variant)

      result = graphql_execute(query, current_user: current_user, variables: {id: post.id})

      post_data = result.dig("data", "post")
      expect(post_data["id"]).to eq post.id
      expect(post_data["status"]).to eq "PUBLISHED"

      variant_data = post_data["channelVariants"].first
      expect(variant_data["id"]).to eq variant.id
      expect(variant_data["body"]).to eq "Hello world"

      analytic_data = variant_data["postAnalytic"]
      expect(analytic_data["impressions"]).to eq analytic.impressions
      expect(analytic_data["likes"]).to eq analytic.likes
      expect(analytic_data["comments"]).to eq analytic.comments
    end

    it "returns nil postAnalytic when no analytics have been collected" do
      credential = create(:credential, organization: organization)
      channel = create(:channel, organization: organization, credential: credential)
      create(:post_channel_variant, post: post, channel: channel)

      result = graphql_execute(query, current_user: current_user, variables: {id: post.id})

      variant_data = result.dig("data", "post", "channelVariants").first
      expect(variant_data["postAnalytic"]).to be_nil
    end
  end

  context "when the post belongs to a different organization" do
    let!(:other_org) { create(:organization) }
    let!(:other_post) do
      create(:post, organization: other_org, status: "published",
        scheduled_at: Time.zone.parse("2026-06-15 10:00:00"))
    end

    it "returns nil" do
      result = graphql_execute(query, current_user: current_user, variables: {id: other_post.id})
      expect(result.dig("data", "post")).to be_nil
    end
  end

  context "when the post does not exist" do
    it "returns nil" do
      result = graphql_execute(query, current_user: current_user, variables: {id: "post_nonexistent"})
      expect(result.dig("data", "post")).to be_nil
    end
  end

  context "when no user is authenticated" do
    it "returns an error" do
      result = graphql_execute(query, current_user: nil, variables: {id: post.id}, allow_errors: true)
      expect(result.dig("data", "post")).to be_nil
      expect(result["errors"]).to be_present
    end
  end
end

require "rails_helper"

RSpec.describe Queries::Dashboard::DashboardQuery do
  let!(:organization) { create(:organization) }
  let!(:current_user) { create(:user, organization: organization) }
  let!(:credential) { create(:credential, organization: organization) }
  let!(:channel) { create(:channel, organization: organization, credential: credential) }

  let(:query) do
    <<-GRAPHQL
      query Dashboard {
        dashboard {
          scheduledPosts {
            id
            scheduledAt
            channelVariants {
              id
              body
              channel {
                id
                name
              }
            }
          }
          needsApprovalPosts {
            id
            scheduledAt
            viewerCanApprove
            channelVariants {
              id
              body
            }
          }
          recentPublishedPosts {
            id
            scheduledAt
            channelVariants {
              id
              body
              postAnalytic {
                id
                impressions
                likes
                comments
              }
            }
          }
          channels {
            id
            name
            provider
          }
        }
      }
    GRAPHQL
  end

  def execute
    graphql_execute(query, current_user: current_user)
  end

  describe "scheduledPosts" do
    it "returns upcoming scheduled posts for the organization" do
      post = create(:post, organization: organization, status: "scheduled",
        scheduled_at: 1.day.from_now)
      create(:post_channel_variant, post: post, channel: channel, body: "Upcoming post")

      data = execute.dig("data", "dashboard", "scheduledPosts")

      expect(data.length).to eq 1
      expect(data.first["id"]).to eq post.id
      expect(data.first["channelVariants"].first["body"]).to eq "Upcoming post"
    end

    it "excludes past scheduled posts" do
      create(:post, organization: organization, status: "scheduled",
        scheduled_at: 1.day.ago)

      data = execute.dig("data", "dashboard", "scheduledPosts")

      expect(data).to be_empty
    end

    it "orders by scheduled_at ascending" do
      post_later = create(:post, organization: organization, status: "scheduled",
        scheduled_at: 3.days.from_now)
      post_sooner = create(:post, organization: organization, status: "scheduled",
        scheduled_at: 1.day.from_now)

      data = execute.dig("data", "dashboard", "scheduledPosts")

      expect(data.map { |p| p["id"] }).to eq [post_sooner.id, post_later.id]
    end

    it "does not return posts from other organizations" do
      other_org = create(:organization)
      create(:credential, organization: other_org)
      create(:post, organization: other_org, status: "scheduled",
        scheduled_at: 1.day.from_now)

      data = execute.dig("data", "dashboard", "scheduledPosts")

      expect(data).to be_empty
    end
  end

  describe "needsApprovalPosts" do
    it "returns posts needing approval for the organization" do
      post = create(:post, organization: organization, status: "needs_approval")
      create(:post_channel_variant, post: post, channel: channel)

      data = execute.dig("data", "dashboard", "needsApprovalPosts")

      expect(data.length).to eq 1
      expect(data.first["id"]).to eq post.id
    end

    it "does not return posts from other organizations" do
      other_org = create(:organization)
      create(:post, organization: other_org, status: "needs_approval")

      data = execute.dig("data", "dashboard", "needsApprovalPosts")

      expect(data).to be_empty
    end
  end

  describe "recentPublishedPosts" do
    it "returns published posts with analytics" do
      post = create(:post, organization: organization, status: "published",
        scheduled_at: 1.day.ago)
      variant = create(:post_channel_variant, post: post, channel: channel, body: "Published!")
      analytic = create(:post_analytic, post_channel_variant: variant)

      data = execute.dig("data", "dashboard", "recentPublishedPosts")

      expect(data.length).to eq 1
      expect(data.first["id"]).to eq post.id

      analytic_data = data.first["channelVariants"].first["postAnalytic"]
      expect(analytic_data["impressions"]).to eq analytic.impressions
      expect(analytic_data["likes"]).to eq analytic.likes
      expect(analytic_data["comments"]).to eq analytic.comments
    end

    it "returns nil postAnalytic when no analytics collected" do
      post = create(:post, organization: organization, status: "published",
        scheduled_at: 1.day.ago)
      create(:post_channel_variant, post: post, channel: channel)

      data = execute.dig("data", "dashboard", "recentPublishedPosts")

      expect(data.first["channelVariants"].first["postAnalytic"]).to be_nil
    end

    it "orders by scheduled_at descending" do
      post_older = create(:post, organization: organization, status: "published",
        scheduled_at: 5.days.ago)
      post_newer = create(:post, organization: organization, status: "published",
        scheduled_at: 1.day.ago)

      data = execute.dig("data", "dashboard", "recentPublishedPosts")

      expect(data.map { |p| p["id"] }).to eq [post_newer.id, post_older.id]
    end
  end

  describe "channels" do
    it "returns channels for the organization sorted by name" do
      other_credential = create(:credential, organization: organization)
      create(:channel, organization: organization, credential: other_credential, name: "Beta")
      create(:channel, organization: organization, credential: other_credential, name: "Alpha")

      data = execute.dig("data", "dashboard", "channels")

      names = data.map { |c| c["name"] }
      expect(names).to include("Alpha", "Beta")
      expect(names.index("Alpha")).to be < names.index("Beta")
    end

    it "does not return channels from other organizations" do
      other_org = create(:organization)
      other_credential = create(:credential, organization: other_org)
      create(:channel, organization: other_org, credential: other_credential, name: "Other Channel")

      data = execute.dig("data", "dashboard", "channels")

      expect(data.map { |c| c["name"] }).not_to include("Other Channel")
    end
  end

  context "when no user is authenticated" do
    it "returns an error" do
      result = graphql_execute(query, current_user: nil, allow_errors: true)

      expect(result.dig("data", "dashboard")).to be_nil
      expect(result["errors"]).to be_present
    end
  end
end

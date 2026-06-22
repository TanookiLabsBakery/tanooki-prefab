require "rails_helper"

RSpec.describe Queries::Posts::PostsQuery do
  let!(:organization) { create(:organization) }
  let!(:current_user) { create(:user, organization: organization) }

  let(:query) do
    <<-GRAPHQL
      query CalendarPosts($startDate: ISO8601Date!, $endDate: ISO8601Date!) {
        calendarPosts(startDate: $startDate, endDate: $endDate) {
          id
          status
          scheduledAt
          channelVariants {
            id
            body
          }
        }
      }
    GRAPHQL
  end

  context "when posts exist within the date range" do
    let!(:post_in_range) do
      create(:post, organization: organization, status: "scheduled", scheduled_at: Time.zone.parse("2026-06-15 10:00:00"))
    end

    let!(:post_before_range) do
      create(:post, organization: organization, status: "published", scheduled_at: Time.zone.parse("2026-05-31 23:59:59"))
    end

    let!(:post_after_range) do
      create(:post, organization: organization, status: "draft", scheduled_at: Time.zone.parse("2026-07-01 00:00:00"))
    end

    let!(:post_no_scheduled_at) do
      create(:post, organization: organization, status: "draft", scheduled_at: nil)
    end

    it "returns only posts within the date range" do
      result = graphql_execute(
        query,
        current_user: current_user,
        variables: {startDate: "2026-06-01", endDate: "2026-06-30"}
      )

      posts = result.dig("data", "calendarPosts")
      expect(posts).to be_present
      expect(posts.length).to eq 1
      expect(posts.first["id"]).to eq post_in_range.id
      expect(posts.first["status"]).to eq "SCHEDULED"
      expect(posts.first["scheduledAt"]).to be_present
    end

    it "returns posts ordered by scheduled_at" do
      create(:post, organization: organization, status: "scheduled", scheduled_at: Time.zone.parse("2026-06-20 10:00:00"))
      create(:post, organization: organization, status: "scheduled", scheduled_at: Time.zone.parse("2026-06-05 10:00:00"))

      result = graphql_execute(
        query,
        current_user: current_user,
        variables: {startDate: "2026-06-01", endDate: "2026-06-30"}
      )

      posts = result.dig("data", "calendarPosts")
      scheduled_times = posts.map { |p| p["scheduledAt"] }
      expect(scheduled_times).to eq scheduled_times.sort
    end
  end

  context "when the user belongs to a different organization" do
    let!(:other_org) { create(:organization) }
    let!(:other_post) do
      create(:post, organization: other_org, status: "scheduled", scheduled_at: Time.zone.parse("2026-06-15 10:00:00"))
    end

    it "does not return posts from other organizations" do
      result = graphql_execute(
        query,
        current_user: current_user,
        variables: {startDate: "2026-06-01", endDate: "2026-06-30"}
      )

      posts = result.dig("data", "calendarPosts")
      expect(posts).to be_empty
    end
  end

  context "when no user is authenticated" do
    it "returns an error" do
      result = graphql_execute(
        query,
        current_user: nil,
        variables: {startDate: "2026-06-01", endDate: "2026-06-30"},
        allow_errors: true
      )

      expect(result.dig("data", "calendarPosts")).to be_nil
      expect(result["errors"]).to be_present
    end
  end
end

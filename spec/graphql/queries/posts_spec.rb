require "rails_helper"

RSpec.describe Queries::Posts::PaginatedPostsQuery do
  let!(:organization) { create(:organization) }
  let!(:current_user) { create(:user, organization: organization) }

  let(:query) do
    <<-GRAPHQL
      query Posts($first: Int, $after: String, $status: PostStatus) {
        posts(first: $first, after: $after, status: $status) {
          nodes {
            id
            status
            scheduledAt
            channels {
              id
              name
            }
            channelVariants {
              id
              body
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    GRAPHQL
  end

  context "when posts exist" do
    let!(:draft_post) { create(:post, organization: organization, status: "draft") }
    let!(:scheduled_post) { create(:post, organization: organization, status: "scheduled", scheduled_at: 1.day.from_now) }
    let!(:published_post) { create(:post, organization: organization, status: "published") }

    it "returns all organization posts" do
      result = graphql_execute(query, current_user: current_user)

      nodes = result.dig("data", "posts", "nodes")
      expect(nodes).to be_present
      expect(nodes.length).to eq 3
    end

    it "includes pageInfo in the response" do
      result = graphql_execute(query, current_user: current_user)

      page_info = result.dig("data", "posts", "pageInfo")
      expect(page_info).to include(
        "hasNextPage" => false,
        "hasPreviousPage" => false
      )
    end

    it "orders posts by created_at descending" do
      result = graphql_execute(query, current_user: current_user)

      nodes = result.dig("data", "posts", "nodes")
      ids = nodes.map { |n| n["id"] }
      expect(ids).to eq [published_post.id, scheduled_post.id, draft_post.id]
    end

    context "with first argument for pagination" do
      it "limits results to the requested count" do
        result = graphql_execute(query, current_user: current_user, variables: {first: 2})

        nodes = result.dig("data", "posts", "nodes")
        expect(nodes.length).to eq 2
        expect(result.dig("data", "posts", "pageInfo", "hasNextPage")).to be true
      end
    end

    context "with cursor-based pagination" do
      it "returns the next page using after cursor" do
        first_result = graphql_execute(query, current_user: current_user, variables: {first: 1})
        cursor = first_result.dig("data", "posts", "pageInfo", "endCursor")

        second_result = graphql_execute(query, current_user: current_user, variables: {first: 1, after: cursor})
        nodes = second_result.dig("data", "posts", "nodes")
        expect(nodes.length).to eq 1
        expect(nodes.first["id"]).to eq scheduled_post.id
      end
    end
  end

  context "with status filter" do
    let!(:draft_post_1) { create(:post, organization: organization, status: "draft") }
    let!(:draft_post_2) { create(:post, organization: organization, status: "draft") }
    let!(:scheduled_post) { create(:post, organization: organization, status: "scheduled", scheduled_at: 1.day.from_now) }

    it "returns only posts matching the given status" do
      result = graphql_execute(query, current_user: current_user, variables: {status: "DRAFT"})

      nodes = result.dig("data", "posts", "nodes")
      expect(nodes.length).to eq 2
      expect(nodes.map { |n| n["status"] }.uniq).to eq ["DRAFT"]
    end

    it "returns empty list when no posts match the status filter" do
      result = graphql_execute(query, current_user: current_user, variables: {status: "PUBLISHED"})

      nodes = result.dig("data", "posts", "nodes")
      expect(nodes).to be_empty
    end
  end

  context "when the user belongs to a different organization" do
    let!(:other_org) { create(:organization) }
    let!(:other_post) { create(:post, organization: other_org, status: "published") }

    it "does not return posts from other organizations" do
      result = graphql_execute(query, current_user: current_user)

      nodes = result.dig("data", "posts", "nodes")
      expect(nodes).to be_empty
    end
  end

  context "when no user is authenticated" do
    it "returns an error" do
      result = graphql_execute(query, current_user: nil, allow_errors: true)

      expect(result.dig("data", "posts")).to be_nil
      expect(result["errors"]).to be_present
    end
  end
end

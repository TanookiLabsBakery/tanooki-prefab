require "rails_helper"

RSpec.describe Mutations::Posts::PostApprove, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation PostApprove($input: PostApproveInput!) {
        postApprove(input: $input) {
          post {
            id
            status
          }
        }
      }
    GRAPHQL
  end

  context "as an editor in the same organization" do
    it "approves a post that needs approval" do
      organization = create(:organization)
      editor = create(:user, organization: organization, user_role: "editor")
      post = create(:post, organization: organization, status: "needs_approval")

      result = graphql_execute(
        mutation,
        current_user: editor,
        variables: {input: {postId: post.id}}
      )

      expect(result.dig("data", "postApprove", "post", "status")).to eq("DRAFT")
      expect(post.reload.status).to eq("draft")
    end
  end

  context "as an admin in the same organization" do
    it "approves a post that needs approval" do
      organization = create(:organization)
      admin = create(:user, organization: organization, user_role: "admin")
      post = create(:post, organization: organization, status: "needs_approval")

      result = graphql_execute(
        mutation,
        current_user: admin,
        variables: {input: {postId: post.id}}
      )

      expect(result.dig("data", "postApprove", "post", "status")).to eq("DRAFT")
    end
  end

  context "as a contributor in the same organization" do
    it "returns not authorized" do
      organization = create(:organization)
      contributor = create(:user, organization: organization, user_role: "contributor")
      post = create(:post, organization: organization, status: "needs_approval")

      result = graphql_execute(
        mutation,
        current_user: contributor,
        variables: {input: {postId: post.id}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(result["errors"].first["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end

  context "as a default user in the same organization" do
    it "returns not authorized" do
      organization = create(:organization)
      user = create(:user, organization: organization, user_role: "default")
      post = create(:post, organization: organization, status: "needs_approval")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end

  context "when the post is still in draft status" do
    it "returns not authorized because the post is not pending approval" do
      organization = create(:organization)
      editor = create(:user, organization: organization, user_role: "editor")
      post = create(:post, organization: organization, status: "draft")

      result = graphql_execute(
        mutation,
        current_user: editor,
        variables: {input: {postId: post.id}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end

  context "as an editor from a different organization" do
    it "returns not authorized" do
      organization = create(:organization)
      other_organization = create(:organization)
      editor = create(:user, organization: other_organization, user_role: "editor")
      post = create(:post, organization: organization, status: "needs_approval")

      result = graphql_execute(
        mutation,
        current_user: editor,
        variables: {input: {postId: post.id}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end
end

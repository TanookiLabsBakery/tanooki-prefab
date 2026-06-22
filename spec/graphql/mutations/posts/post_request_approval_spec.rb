require "rails_helper"

RSpec.describe Mutations::Posts::PostRequestApproval, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation PostRequestApproval($input: PostRequestApprovalInput!) {
        postRequestApproval(input: $input) {
          post {
            id
            status
          }
        }
      }
    GRAPHQL
  end

  context "as a contributor in the same organization" do
    it "changes the post status to needs_approval" do
      organization = create(:organization)
      contributor = create(:user, organization: organization, user_role: "contributor")
      post = create(:post, organization: organization, status: "draft")

      result = graphql_execute(
        mutation,
        current_user: contributor,
        variables: {input: {postId: post.id}}
      )

      expect(result.dig("data", "postRequestApproval", "post", "status")).to eq("NEEDS_APPROVAL")
      expect(post.reload.status).to eq("needs_approval")
    end

    it "enqueues an approval email for each designated approver" do
      ActiveJob::Base.queue_adapter = :test
      organization = create(:organization)
      contributor = create(:user, organization: organization, user_role: "contributor")
      create(:user, organization: organization, user_role: "editor")
      create(:user, organization: organization, user_role: "admin")
      post = create(:post, organization: organization, status: "draft")

      expect {
        graphql_execute(
          mutation,
          current_user: contributor,
          variables: {input: {postId: post.id}}
        )
      }.to have_enqueued_mail(PostApprovalMailer, :request_approval_email).twice
    end
  end

  context "as a default user in the same organization" do
    it "changes the post status to needs_approval" do
      organization = create(:organization)
      user = create(:user, organization: organization, user_role: "default")
      post = create(:post, organization: organization, status: "draft")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id}}
      )

      expect(result.dig("data", "postRequestApproval", "post", "status")).to eq("NEEDS_APPROVAL")
    end
  end

  context "when the post is not in draft status" do
    it "returns not authorized because the post is already pending approval" do
      organization = create(:organization)
      user = create(:user, organization: organization)
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

  context "as a user from a different organization" do
    it "returns not authorized" do
      organization = create(:organization)
      other_organization = create(:organization)
      user = create(:user, organization: other_organization)
      post = create(:post, organization: organization, status: "draft")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
    end
  end
end

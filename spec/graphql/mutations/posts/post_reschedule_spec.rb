require "rails_helper"

RSpec.describe Mutations::Posts::PostReschedule, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation PostReschedule($input: PostRescheduleInput!) {
        postReschedule(input: $input) {
          post {
            id
            scheduledAt
          }
        }
      }
    GRAPHQL
  end

  let(:job_double) { double(provider_job_id: "new-jid-123") }
  let(:job_set_double) { double(perform_later: job_double) }

  before do
    allow(::Posts::PublishPostJob).to receive(:set).and_return(job_set_double)
  end

  context "as a user in the same organization" do
    it "updates the post's scheduled_at to the new time" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      post = create(:post, organization: organization, status: "scheduled", scheduled_at: 1.day.from_now)
      new_time = 2.days.from_now

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id, scheduledAt: new_time.iso8601}}
      )

      expect(result.dig("data", "postReschedule", "post", "scheduledAt")).to be_present
      expect(post.reload.scheduled_at).to be_within(1.second).of(new_time)
    end

    it "reschedules the Sidekiq job to the new time" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      post = create(:post, organization: organization, status: "scheduled", scheduled_at: 1.day.from_now)
      new_time = 2.days.from_now

      graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id, scheduledAt: new_time.iso8601}}
      )

      expect(::Posts::PublishPostJob).to have_received(:set).with(wait_until: be_within(1.second).of(new_time))
      expect(post.reload.sidekiq_job_id).to eq("new-jid-123")
    end

    it "deletes the existing Sidekiq job before rescheduling" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      old_job = double(delete: nil)
      scheduled_set = double(find: old_job)
      allow(::Sidekiq::ScheduledSet).to receive(:new).and_return(scheduled_set)
      post = create(:post, organization: organization, status: "scheduled", scheduled_at: 1.day.from_now, sidekiq_job_id: "old-jid-456")

      graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id, scheduledAt: 2.days.from_now.iso8601}}
      )

      expect(old_job).to have_received(:delete)
    end
  end

  context "as a user from a different organization" do
    it "returns not authorized" do
      organization = create(:organization)
      other_organization = create(:organization)
      user = create(:user, organization: other_organization)
      post = create(:post, organization: organization, status: "scheduled", scheduled_at: 1.day.from_now)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id, scheduledAt: 2.days.from_now.iso8601}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(result["errors"].first["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end

  context "when the post is not in scheduled status" do
    it "returns not authorized" do
      organization = create(:organization)
      user = create(:user, organization: organization)
      post = create(:post, organization: organization, status: "draft")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {postId: post.id, scheduledAt: 2.days.from_now.iso8601}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(result["errors"].first["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end
end

require "rails_helper"

RSpec.describe Mutations::CompleteOnboarding, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation CompleteOnboarding($input: CompleteOnboardingInput!) {
        completeOnboarding(input: $input) {
          viewer {
            id
            onboardingCompletedAt
          }
        }
      }
    GRAPHQL
  end

  context "as an authenticated user" do
    it "sets onboarding_completed_at when not yet set" do
      user = create(:user, onboarding_completed_at: nil)

      result = graphql_execute(mutation, current_user: user, variables: {input: {}})

      expect(result.dig("data", "completeOnboarding", "viewer", "onboardingCompletedAt")).to be_present
      expect(user.reload.onboarding_completed_at).to be_present
    end

    it "is idempotent when onboarding is already complete" do
      completed_at = 1.day.ago
      user = create(:user, onboarding_completed_at: completed_at)

      result = graphql_execute(mutation, current_user: user, variables: {input: {}})

      expect(result.dig("data", "completeOnboarding", "viewer", "onboardingCompletedAt")).to be_present
      expect(user.reload.onboarding_completed_at.to_i).to eq(completed_at.to_i)
    end
  end

  context "as an unauthenticated user" do
    it "returns an error" do
      result = graphql_execute(mutation, current_user: nil, variables: {input: {}}, allow_errors: true)

      expect(result["errors"]).to be_present
    end
  end
end

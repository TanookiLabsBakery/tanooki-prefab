require "rails_helper"

RSpec.describe Mutations::Organizations::OrganizationUpdateBrandVoice, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation OrganizationUpdateBrandVoice($input: OrganizationUpdateBrandVoiceInput!) {
        organizationUpdateBrandVoice(input: $input) {
          organization {
            id
            brandVoiceGuidelines
          }
        }
      }
    GRAPHQL
  end

  let(:brand_voice_input) do
    {
      tone: "Professional",
      messagingPillars: ["Quality", "Innovation"],
      wordsToAvoid: ["cheap", "basic"],
      approvedHashtagSets: ["#tech #innovation", "#quality #craftsmanship"]
    }
  end

  context "as an admin" do
    it "updates the brand voice guidelines" do
      organization = create(:organization)
      admin = create(:user, organization: organization, user_role: "admin")

      result = graphql_execute(
        mutation,
        current_user: admin,
        variables: {input: {brandVoiceInput: brand_voice_input}}
      )

      expect(result.dig("data", "organizationUpdateBrandVoice", "organization", "id")).to eq(organization.id)

      guidelines = JSON.parse(organization.reload.brand_voice_guidelines)
      expect(guidelines["tone"]).to eq("Professional")
      expect(guidelines["messaging_pillars"]).to eq(["Quality", "Innovation"])
      expect(guidelines["words_to_avoid"]).to eq(["cheap", "basic"])
      expect(guidelines["approved_hashtag_sets"]).to eq(["#tech #innovation", "#quality #craftsmanship"])
    end
  end

  context "as a system admin" do
    it "updates the brand voice guidelines" do
      organization = create(:organization)
      system_admin = create(:user, organization: organization, user_role: "system_admin")

      result = graphql_execute(
        mutation,
        current_user: system_admin,
        variables: {input: {brandVoiceInput: brand_voice_input}}
      )

      expect(result.dig("data", "organizationUpdateBrandVoice", "organization", "id")).to eq(organization.id)
      expect(organization.reload.brand_voice_guidelines).to be_present
    end
  end

  context "as a default user" do
    it "returns not authorized" do
      organization = create(:organization)
      user = create(:user, organization: organization, user_role: "default")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {input: {brandVoiceInput: brand_voice_input}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(result["errors"].first["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end

  context "as a contributor" do
    it "returns not authorized" do
      organization = create(:organization)
      contributor = create(:user, organization: organization, user_role: "contributor")

      result = graphql_execute(
        mutation,
        current_user: contributor,
        variables: {input: {brandVoiceInput: brand_voice_input}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(result["errors"].first["extensions"]["code"]).to eq("NOT_AUTHORIZED")
    end
  end
end

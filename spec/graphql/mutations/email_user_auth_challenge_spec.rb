require "rails_helper"

RSpec.describe "EmailUserAuthChallenge Mutation", type: :request do
  let(:user) { create(:user) }
  let(:email) { user.email }
  let(:client_auth_code) { SecureRandom.uuid }
  let(:query) do
    <<~GQL
      mutation EmailUserAuthChallenge($input: EmailUserAuthChallengeInput!) {
        emailUserAuthChallenge(input: $input) {
          success
        }
      }
    GQL
  end

  describe "POST /graphql" do
    it "creates a UserAuthChallenge, sends an email" do
      expect {
        post "/graphql", params: {
          query: query,
          variables: {input: {email: email, clientAuthCode: client_auth_code}}
        }, as: :json
      }.to change(UserAuthChallenge, :count).by(1)
        .and have_enqueued_job.on_queue("mailers")

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      expect(json_response["errors"]).to be_nil
      expect(json_response["data"]["emailUserAuthChallenge"]["success"]).to be true

      challenge = UserAuthChallenge.last
      expect(challenge.user).to eq(user)
      expect(challenge.client_auth_code).to eq(client_auth_code)
      expect(challenge.timeout_at).to be_within(1.second).of(5.minutes.from_now)
    end

    it "raises an error if user is not found" do
      post "/graphql", params: {
        query: query,
        variables: {input: {email: "nonexistent@example.com", clientAuthCode: client_auth_code}}
      }, as: :json

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      expect(json_response["errors"]).to be_present
      expect(json_response["errors"][0]["message"]).to eq("User not found")
      expect(json_response["data"]).to be_nil
    end
  end
end

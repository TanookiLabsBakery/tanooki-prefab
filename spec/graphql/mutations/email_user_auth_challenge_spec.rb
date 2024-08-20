require "rails_helper"

RSpec.describe Mutations::EmailUserAuthChallenge do
  let(:mutation) do
    <<~GQL
      mutation EmailUserAuthChallenge($input: EmailUserAuthChallengeInput!) {
        emailUserAuthChallenge(input: $input) {
          success
        }
      }
    GQL
  end
  describe ".resolve" do
    let(:user) { create(:user) }
    let(:email) { user.email }
    let(:client_auth_code) { SecureRandom.uuid }

    it "creates a UserAuthChallenge and sends an email" do
      expect {
        graphql_execute(
          mutation,
          current_user: nil,
          variables: {input: {email: email, clientAuthCode: client_auth_code}}
        )
      }.to change(UserAuthChallenge, :count).by(1)
        .and have_enqueued_job.on_queue("mailers")

      result = graphql_execute(
        mutation,
        current_user: nil,
        variables: {input: {email: email, clientAuthCode: client_auth_code}}
      )
      expect(result["data"]["emailUserAuthChallenge"]["success"]).to be true

      challenge = UserAuthChallenge.last
      expect(challenge.user).to eq(user)
      expect(challenge.client_auth_code).to eq(client_auth_code)
      expect(challenge.timeout_at).to be_within(1.second).of(5.minutes.from_now)
    end

    it "raises an error if user is not found" do
      result = graphql_execute(
        mutation,
        current_user: nil,
        variables: {input: {email: "nonexistent@example.com", clientAuthCode: client_auth_code}},
        allow_errors: true
      )

      expect(result["errors"]).to be_present
      expect(result["errors"][0]["message"]).to eq("User not found")
    end
  end
end

require "rails_helper"

RSpec.describe Mutations::EmailTokenUserAuth, type: :request do
  let(:user) { create(:user) }
  let(:challenge) { create(:user_auth_challenge, user: user, token: "123456") }
  let(:mutation) do
    <<~GQL
      mutation EmailTokenUserAuth($input: EmailTokenUserAuthInput!) {
        emailTokenUserAuth(input: $input) {
          success
          authToken
        }
      }
    GQL
  end

  describe "session auth" do
    context "with valid credentials" do
      it "authenticates the user and sets remember me cookie" do
        challenge # create the challenge
        post "/graphql", params: {query: mutation, variables: {input: {email: user.email, token: "123456", timeZone: "UTC"}}}

        json = JSON.parse(response.body)
        expect(json["data"]["emailTokenUserAuth"]["success"]).to be true
        expect(json["data"]["emailTokenUserAuth"]["authToken"]).to eq nil
        expect(challenge.reload.claimed_at).not_to be_nil

        expect(response).to have_http_status(:ok)
        expect(response.cookies["remember_me_token"]).to be_present
        set_cookie_header = response.headers["Set-Cookie"][0]
        expect(set_cookie_header).to include("remember_me_token=")
        expect(set_cookie_header).to include("httponly")
        expect(set_cookie_header).to include("expires=")
      end
    end

    context "with invalid email" do
      it "returns an error" do
        post "/graphql", params: {query: mutation, variables: {input: {email: "wrong@example.com", token: "123456", timeZone: "UTC"}}}

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
        expect(json["errors"][0]["message"]).to eq("User not found")
      end
    end

    context "with invalid token" do
      it "returns an error" do
        challenge # create the challenge
        post "/graphql", params: {query: mutation, variables: {input: {email: user.email, token: "wrong", timeZone: "UTC"}}}

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
        expect(json["errors"][0]["message"]).to eq("Invalid token")
      end
    end

    context "with expired token" do
      it "returns an error" do
        create(:user_auth_challenge, :expired, user: user, token: "123456")
        post "/graphql", params: {query: mutation, variables: {input: {email: user.email, token: "123456", timeZone: "UTC"}}}

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
        expect(json["errors"][0]["message"]).to eq("Token has expired")
      end
    end
  end

  describe "token auth" do
    context "with valid credentials" do
      it "authenticates the user and sets remember me cookie" do
        challenge # create the challenge
        post "/graphql", params: {query: mutation, variables: {input: {email: user.email, token: "123456", timeZone: "UTC", authType: "TOKEN"}}}

        json = JSON.parse(response.body)
        expect(json["data"]["emailTokenUserAuth"]["success"]).to be true
        expect(json["data"]["emailTokenUserAuth"]["authToken"]).to_not eq nil
        expect(challenge.reload.claimed_at).not_to be_nil

        expect(response).to have_http_status(:ok)
        expect(response.cookies["remember_me_token"]).to eq nil
      end
    end

    context "with invalid token" do
      it "returns an error" do
        challenge # create the challenge
        post "/graphql", params: {query: mutation, variables: {input: {email: user.email, token: "wrong", timeZone: "UTC", authType: "TOKEN"}}}

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
        expect(json["errors"][0]["message"]).to eq("Invalid token")
        expect(json["data"]).to eq nil
      end
    end
  end
end

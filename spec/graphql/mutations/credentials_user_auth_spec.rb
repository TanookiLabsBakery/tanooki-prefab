require "rails_helper"

RSpec.describe Mutations::CredentialsUserAuth, type: :request do
  let(:user) { create(:user, email: "user@example.com", password: "password") }
  let(:query) do
    <<~GQL
      mutation($email: String!, $password: String!, $rememberMe: Boolean!) {
        credentialsUserAuth(input: { email: $email, password: $password, rememberMe: $rememberMe }) {
          user {
            id
            firstName
            lastName
          }
        }
      }
    GQL
  end

  describe "POST /graphql" do
    context "with valid credentials" do
      it "returns a user" do
        post "/graphql", params: {query: query, variables: {email: user.email, password: "password", rememberMe: false}}, as: :json

        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to be_nil

        data = json_response["data"]["credentialsUserAuth"]
        expect(data["user"]["firstName"]).to eq(user.first_name)
        expect(data["user"]["lastName"]).to eq(user.last_name)
        expect(session[:user_id]).to eq(user.id)
      end

      it "sets remember_me token when requested" do
        post "/graphql", params: {query: query, variables: {email: user.email, password: "password", rememberMe: true}}, as: :json

        json_response = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(json_response["errors"]).to be_nil
        data = json_response["data"]["credentialsUserAuth"]

        expect(response).to have_http_status(:ok)
        expect(data["user"]["firstName"]).to eq(user.first_name)
        expect(data["user"]["lastName"]).to eq(user.last_name)
        expect(session[:user_id]).to eq(user.id)
        expect(response.cookies["remember_me_token"]).to be_present
        set_cookie_header = response.headers["Set-Cookie"][0]
        expect(set_cookie_header).to include("remember_me_token=")
        expect(set_cookie_header).to include("httponly")
        expect(set_cookie_header).to include("expires=")
      end
    end

    context "with invalid credentials" do
      it "returns an error" do
        post "/graphql", params: {query: query, variables: {email: user.email, password: "wrong_password", rememberMe: false}}, as: :json

        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["errors"]).to be_present
        expect(json_response["errors"][0]["message"]).to eq("Invalid email or password")
        expect(json_response["data"]).to be_nil
      end
    end
  end
end

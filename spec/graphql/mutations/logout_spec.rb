require "rails_helper"

RSpec.describe "Logout Mutation", type: :request do
  let(:user) { create(:user, password: "password") }
  let(:query) do
    <<~GQL
      mutation {
        logout(input: {}) {
          success
        }
      }
    GQL
  end

  describe "POST /graphql" do
    context "when user is logged in" do
      it "logs out the user" do
        viewer_query = <<~GQL
          query {
            viewer {
              id
            }
          }
        GQL

        # Log in the user
        login_mutation = <<~GQL
          mutation($email: String!, $password: String!, $rememberMe: Boolean!) {
            login: loginWithCredentials(input: { email: $email, password: $password, rememberMe: $rememberMe }) {
              user { id }
            }
          }
        GQL

        post "/graphql", params: {
          query: login_mutation,
          variables: {email: user.email, password: "password", rememberMe: false}
        }, as: :json

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["errors"]).to be_nil
        expect(JSON.parse(response.body)["data"]["login"]["user"]).to be_present

        # Verify that the user is logged in
        post "/graphql", params: {query: viewer_query}, as: :json
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to be_nil
        expect(json_response["data"]["viewer"]["id"]).to eq(user.id)

        # Now perform the logout
        post "/graphql", params: {query: query}, as: :json
        expect(response).to have_http_status(:ok)

        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to be_nil

        data = json_response["data"]["logout"]
        expect(data["success"]).to be true

        # Verify that the user is logged out
        post "/graphql", params: {query: viewer_query}, as: :json
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to be_nil
        expect(json_response["data"]["viewer"]).to be_nil
      end
    end

    context "when user is not logged in" do
      it "returns an error" do
        post "/graphql", params: {query: query}, as: :json

        json_response = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json_response["errors"]).to be_present
        expect(json_response["errors"][0]["message"]).to eq("Not authenticated")
        expect(json_response["data"]).to be_nil
      end
    end
  end
end

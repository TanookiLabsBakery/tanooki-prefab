require "rails_helper"

RSpec.describe GraphqlController, type: :request do
  it "authenticates" do
    user = create(:user, first_name: "Ryan", last_name: "B")
    auth_token = create(:user_auth_token, user: user)

    query = <<~GRAPHQL
      {
        viewer {
          id
          firstName
          lastName
        }
      }
    GRAPHQL

    post(
      graphql_path,
      params: {query: query}.to_json,
      headers: {CONTENT_TYPE: "application/json", Authorization: "Bearer #{auth_token.token}"}
    )

    data = JSON.parse(response.body)

    expect(data.dig("errors")).to be_nil
    expect(data.dig("data", "viewer", "firstName")).to eql("Ryan")
    expect(data.dig("data", "viewer", "lastName")).to eql("B")
  end

  it "returns nil for invalid tokens" do
    user = create(:user, first_name: "Ryan", last_name: "B")
    create(:user_auth_token, user: user)

    query = <<~GRAPHQL
      {
        viewer {
          id
          firstName
          lastName
        }
      }
    GRAPHQL

    post(
      graphql_path,
      params: {query: query}.to_json,
      headers: {CONTENT_TYPE: "application/json", Authorization: "Bearer invalid"}
    )

    data = JSON.parse(response.body)

    expect(data.dig("errors", 0, "extensions", "code")).to eq "FORBIDDEN"
  end
end

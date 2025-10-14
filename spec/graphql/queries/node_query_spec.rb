require "rails_helper"

RSpec.describe Queries::NodeQuery do
  let(:current_user) { create(:user, first_name: "Jane", last_name: "Smith", email: "jane@example.com") }
  let(:other_user) { create(:user, first_name: "John", last_name: "Doe", email: "john@example.com") }

  let(:query) do
    <<-GRAPHQL
      query userDetails($userId: ID!) {
        node(id: $userId) {
          ... on User {
            id
            firstName
            lastName
            email
            fullName
            createdAt
            updatedAt
          }
        }
      }
    GRAPHQL
  end

  let(:admin_query) do
    <<-GRAPHQL
      query userDetails($userId: ID!) {
        node(id: $userId) {
          ... on User {
            id
            userRole
            userStatus
            firstName
            lastName
            email
            fullName
            createdAt
            updatedAt
          }
        }
      }
    GRAPHQL
  end

  it "returns the user node with all fields when accessing own user" do
    result = graphql_execute(
      query,
      current_user: current_user,
      variables: {
        userId: current_user.id
      }
    )

    user_node = result.dig("data", "node")
    expect(user_node["id"]).to eq current_user.id
    expect(user_node["firstName"]).to eq "Jane"
    expect(user_node["lastName"]).to eq "Smith"
    expect(user_node["email"]).to eq "jane@example.com"
    expect(user_node["fullName"]).to eq "Jane Smith"
    expect(user_node["createdAt"]).to be_present
    expect(user_node["updatedAt"]).to be_present
  end

  it "returns nil for node when accessing unauthorized user" do
    result = graphql_execute(
      query,
      current_user: current_user,
      variables: {
        userId: other_user.id
      },
      allow_errors: true
    )

    user_node = result.dig("data", "node")
    expect(user_node).to be_nil
    expect(result.dig("errors", 0, "message")).to eq "Not authorized"
  end

  context "when user is a system admin" do
    let(:admin_user) { create(:user, user_role: "system_admin") }

    it "returns all fields including admin fields when accessing another user" do
      result = graphql_execute(
        admin_query,
        current_user: admin_user,
        variables: {
          userId: other_user.id
        }
      )

      user_node = result.dig("data", "node")
      expect(user_node["id"]).to eq other_user.id
      expect(user_node["email"]).to eq "john@example.com"
      expect(user_node["userRole"]).to eq "DEFAULT"
      expect(user_node["userStatus"]).to eq "ACTIVE"
      expect(user_node["createdAt"]).to be_present
      expect(user_node["updatedAt"]).to be_present
    end
  end

  it "returns nil when node does not exist" do
    result = graphql_execute(
      query,
      current_user: current_user,
      variables: {
        userId: "usr_nonexistent"
      }
    )

    expect(result.dig("data", "node")).to be_nil
  end
end

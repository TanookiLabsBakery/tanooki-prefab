require "rails_helper"

RSpec.describe Queries::ViewerQuery do
  let!(:current_user) { create(:user, first_name: "Jane", last_name: "Smith", email: "jane@example.com") }

  let!(:query) do
    <<-GRAPHQL
      query Viewer {
        viewer {
          id
          userRole
          userStatus
          firstName
          lastName
          email
          fullName
          createdAt
          updatedAt
          avatarUrl
          avatarThumbUrl
        }
      }
    GRAPHQL
  end

  it "returns all user fields for the current user" do
    result = graphql_execute(query, current_user: current_user)

    viewer = result.dig("data", "viewer")
    expect(viewer["id"]).to eq current_user.id
    expect(viewer["userRole"]).to eq "DEFAULT"
    expect(viewer["userStatus"]).to eq "ACTIVE"
    expect(viewer["firstName"]).to eq "Jane"
    expect(viewer["lastName"]).to eq "Smith"
    expect(viewer["email"]).to eq "jane@example.com"
    expect(viewer["fullName"]).to eq "Jane Smith"
    expect(viewer["createdAt"]).to be_present
    expect(viewer["updatedAt"]).to be_present
    expect(viewer["avatarUrl"]).to be_nil
    expect(viewer["avatarThumbUrl"]).to be_nil
  end

  it "returns nil when there is no current user" do
    result = graphql_execute(query, current_user: nil)

    expect(result.dig("data", "viewer")).to be_nil
  end

  describe "authorized fields" do
    it "allows the user to view their own email, createdAt, and updatedAt" do
      result = graphql_execute(query, current_user: current_user)

      viewer = result.dig("data", "viewer")
      expect(viewer["email"]).to eq "jane@example.com"
      expect(viewer["createdAt"]).to be_present
      expect(viewer["updatedAt"]).to be_present
    end
  end
end

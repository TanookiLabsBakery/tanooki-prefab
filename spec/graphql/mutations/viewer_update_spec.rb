require "rails_helper"

RSpec.describe Mutations::ViewerUpdate, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation ViewerUpdate($input: ViewerUpdateInput!) {
        viewerUpdate(input: $input) {
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    GRAPHQL
  end

  context "as a regular user" do
    it "can update their own profile" do
      user = create(:user, user_role: "default")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            viewerInput: {
              firstName: "John",
              lastName: "Doe",
              email: "johndoe@example.com"
            }
          }
        }
      )

      expect(result.dig("data", "viewerUpdate", "user", "firstName")).to(eq("John"))
      expect(user.reload.first_name).to(eq("John"))
      expect(user.reload.last_name).to(eq("Doe"))
      expect(user.reload.email).to(eq("johndoe@example.com"))
    end

    it "raises validation errors" do
      user = create(:user, user_role: "default", first_name: "John", last_name: "Doe")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            viewerInput: {
              firstName: "",
              lastName: "",
              email: "johndoe@example.com"
            }
          }
        },
        allow_errors: true
      )

      expect(result["errors"]).to(be_present)
      expect(result.dig("errors", 0, "extensions")).to(
        eql(
          "code" => "VALIDATION_ERROR",
          "validationErrors" => [
            {
              "field" => "firstName",
              "fullMessage" => "First name can't be blank",
              "message" => "can't be blank",
              "resource" => "User",
              "type" => "blank"
            },
            {
              "field" => "lastName",
              "fullMessage" => "Last name can't be blank",
              "message" => "can't be blank",
              "resource" => "User",
              "type" => "blank"
            }
          ]
        )
      )

      expect(user.reload.first_name).to(eq("John"))
    end
  end
end

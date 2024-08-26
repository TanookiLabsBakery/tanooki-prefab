require "rails_helper"

RSpec.describe Mutations::UserUpdate, type: :request do
  let(:new_attributes) do
    {
      first_name: "FirstName",
      last_name: "LastName",
      email: "updated_email@example.com"
    }
  end

  let(:mutation) do
    <<-GRAPHQL
      mutation UpdateUser($input: UserUpdateInput!) {
        userUpdate(input: $input) {
          user {
            id
            firstName
            lastName
            userStatus
          }
        }
      }
    GRAPHQL
  end

  context "as a system admin" do
    it "can update another user" do
      user = create(:user, user_role: "system_admin")
      user_to_update = create(:user, user_status: "blocked")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            id: user_to_update.id,
            userInput: {
              firstName: "John",
              lastName: "Doe",
              email: "johndoe@example.com",
              userStatus: "ACTIVE"
            }
          }
        }
      )

      expect(result.dig("data", "userUpdate", "user", "firstName")).to(eq("John"))
      expect(user_to_update.reload.first_name).to(eq("John"))
      expect(user_to_update.reload.last_name).to(eq("Doe"))
      expect(user_to_update.reload.email).to(eq("johndoe@example.com"))
      expect(user_to_update.reload.user_status).to(eq("active"))
    end

    it "raises validation errors" do
      user = create(:user, user_role: "system_admin")
      user_to_update = create(:user, first_name: "John", last_name: "Doe")

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            id: user_to_update.id,
            userInput: {
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

      expect(user_to_update.reload.first_name).to(eq("John"))
    end
  end
end

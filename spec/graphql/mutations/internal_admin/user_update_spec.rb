require "rails_helper"

RSpec.describe Mutations::InternalAdmin::UserUpdate, type: :request do
  let(:mutation) do
    <<-GRAPHQL
      mutation InternalAdminUserUpdate($input: InternalAdminUserUpdateInput!) {
        internalAdminUserUpdate(input: $input) {
          user {
            id
            firstName
            lastName
            userStatus
            userRole
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

      expect(result.dig("data", "internalAdminUserUpdate", "user", "firstName")).to(eq("John"))
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
      expect(user_to_update.reload.first_name).to(eq("John"))
    end

    it "can change a user role" do
      user = create(:user, user_role: "system_admin")
      user_to_update = create(:user, user_role: "default")

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
              userRole: "SYSTEM_ADMIN"
            }
          }
        }
      )

      expect(result.dig("data", "internalAdminUserUpdate", "user", "firstName")).to(eq("John"))
      expect(user_to_update.reload.user_role).to(eq("system_admin"))
    end

    it "can change a user status" do
      user = create(:user, user_role: "system_admin")
      user_to_update = create(:user, user_status: "active")

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
              userStatus: "BLOCKED"
            }
          }
        }
      )

      expect(result.dig("data", "internalAdminUserUpdate", "user", "firstName")).to(eq("John"))
      expect(user_to_update.reload.user_status).to(eq("blocked"))
    end
  end

  context "as a default user" do
    it "cannot see the mutation" do
      user = create(:user, user_role: "default")
      user_to_update = create(:user)

      result = graphql_execute(
        mutation,
        current_user: user,
        variables: {
          input: {
            id: user_to_update.id,
            userInput: {
              firstName: "John",
              lastName: "Doe",
              email: "johndoe@example.com"
            }
          }
        },
        allow_errors: true
      )

      expect(result["errors"]).to(be_present)
      expect(result.dig("errors", 0, "message")).to(include("Field 'internalAdminUserUpdate' doesn't exist"))
    end
  end
end

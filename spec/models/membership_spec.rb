require "rails_helper"

RSpec.describe Membership, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)
      membership = Membership.new(organization: organization, user: user, membership_role: "default")

      expect(membership).to be_valid
    end

    it "is invalid with duplicate user and organization combination" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)

      Membership.create!(organization: organization, user: user, membership_role: "default")

      duplicate_membership = Membership.new(organization: organization, user: user, membership_role: "organization_admin")

      expect(duplicate_membership).not_to be_valid
      expect(duplicate_membership.errors[:user_id]).to include("has already been taken")
    end
  end

  describe "associations" do
    it "belongs to an organization" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)
      membership = Membership.create!(organization: organization, user: user, membership_role: "default")

      expect(membership.organization).to eq(organization)
    end

    it "belongs to a user" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)
      membership = Membership.create!(organization: organization, user: user, membership_role: "default")

      expect(membership.user).to eq(user)
    end
  end

  describe "pg_enum" do
    it "sets membership_role to one of the allowed values" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)
      membership = Membership.new(organization: organization, user: user, membership_role: "organization_admin")

      expect(membership.membership_role).to eq("organization_admin")
    end

    it "raises an error if membership_role is not one of the allowed values" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)

      expect {
        Membership.new(organization: organization, user: user, membership_role: "invalid_role")
      }.to raise_error(ArgumentError)
    end
  end
end

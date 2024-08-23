require "rails_helper"

RSpec.describe Organization, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      organization = Organization.new(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      expect(organization).to be_valid
    end

    it "is invalid without a name" do
      organization = Organization.new(name: nil)
      organization.valid?
      expect(organization.errors[:name]).to include("can't be blank")
    end

    it "is invalid without a slug" do
      organization = Organization.new(slug: nil)
      organization.valid?
      expect(organization.errors[:slug]).to include("can't be blank")
    end

    it "is invalid without a time zone" do
      organization = Organization.new(time_zone: nil)
      organization.valid?
      expect(organization.errors[:time_zone]).to include("can't be blank")
    end

    it "is invalid with an invalid time zone" do
      organization = Organization.new(time_zone: "Invalid_Time_Zone")
      organization.valid?
      expect(organization.errors[:time_zone]).to include("is not included in the list")
    end
  end

  describe "associations" do
    it "has many memberships" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)

      Membership.create!(user: user, organization: organization, membership_role: "default")

      # Attempting to create a second membership for the same user and organization should fail
      duplicate_membership = Membership.new(user: user, organization: organization, membership_role: "default")
      expect(duplicate_membership).not_to be_valid
      expect(duplicate_membership.errors[:user_id]).to include("has already been taken")
    end

    it "has many users through memberships" do
      organization = Organization.create!(name: "Test Organization", slug: "test-organization", time_zone: "UTC")
      user1 = User.create!(first_name: "John", last_name: "Doe", time_zone: "UTC", email: "john@example.com", current_organization: organization)
      user2 = User.create!(first_name: "Jane", last_name: "Smith", time_zone: "UTC", email: "jane@example.com", current_organization: organization)

      Membership.create!(user: user1, organization: organization, membership_role: "default")
      Membership.create!(user: user2, organization: organization, membership_role: "default")

      expect(organization.users).to include(user1, user2)
    end
  end

  describe "callbacks" do
    it "generates a slug before validation if name is present" do
      organization = Organization.new(name: "Test Organization", slug: nil, time_zone: "UTC")
      organization.valid?
      expect(organization.slug).to eq("test-organization")
    end
  end

  describe "pg_enum" do
    it "sets organization_type to one of the allowed values" do
      organization = Organization.new(name: "Test Organization", organization_type: "standard", time_zone: "UTC")
      expect(organization.organization_type).to eq("standard")
    end

    it "raises an error if organization_type is not one of the allowed values" do
      expect {
        Organization.new(name: "Test Organization", organization_type: "invalid", time_zone: "UTC")
      }.to raise_error(ArgumentError)
    end
  end

  describe "name normalization" do
    it "strips leading and trailing whitespace from the name" do
      organization = Organization.new(name: "  Test Organization  ", time_zone: "UTC")
      organization.valid?
      expect(organization.name).to eq("Test Organization")
    end
  end
end

require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    let(:organization) { create(:organization) }

    it "is valid with a valid time zone, first name, last name, current_organization, and membership" do
      user = build(:user, current_organization: organization)
      membership = build(:membership, user: user, organization: organization)

      user.memberships << membership

      expect(user).to be_valid
    end

    # it "is invalid without a current_organization" do
    #   user = build(:user, current_organization: nil)
    #   expect(user).to be_invalid
    #   expect(user.errors[:current_organization]).to include("must exist")
    # end

    it "is invalid with an invalid time zone" do
      user = build(:user, current_organization: organization, time_zone: "Invalid_Time_Zone")
      expect(user).to be_invalid
      expect(user.errors[:time_zone]).to include("is not included in the list")
    end
  end
end

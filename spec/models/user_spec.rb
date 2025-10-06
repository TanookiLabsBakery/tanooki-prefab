require "rails_helper"

RSpec.describe User, type: :model do
  describe "validations" do
    it "is valid with a valid time zone, first name, and last name" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "is invalid with an invalid time zone" do
      user = build(:user, time_zone: "Invalid_Time_Zone")
      expect(user).to be_invalid
      expect(user.errors[:time_zone]).to include("is not included in the list")
    end
  end
end

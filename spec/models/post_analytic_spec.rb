require "rails_helper"

RSpec.describe PostAnalytic, type: :model do
  describe "associations" do
    it "belongs to a post_channel_variant" do
      analytic = build(:post_analytic)
      expect(analytic.post_channel_variant).to be_present
    end
  end

  describe "validations" do
    it "is valid with default attributes" do
      analytic = build(:post_analytic)
      expect(analytic).to be_valid
    end

    it "is invalid when impressions is negative" do
      analytic = build(:post_analytic, impressions: -1)
      expect(analytic).to be_invalid
      expect(analytic.errors[:impressions]).to be_present
    end

    it "is invalid when likes is negative" do
      analytic = build(:post_analytic, likes: -1)
      expect(analytic).to be_invalid
    end

    it "enforces uniqueness per post_channel_variant" do
      variant = create(:post_channel_variant)
      create(:post_analytic, post_channel_variant: variant)
      duplicate = build(:post_analytic, post_channel_variant: variant)
      expect(duplicate).to be_invalid
    end
  end
end

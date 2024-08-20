require "rails_helper"

RSpec.describe UserAuthChallenge, type: :model do
  describe "#token=" do
    it "creates a bcrypt hash of the token" do
      challenge = UserAuthChallenge.new
      challenge.token = "test_token"
      expect(challenge.token_digest).to start_with("$2a$")
    end

    it "creates different hashes for different tokens" do
      challenge1 = UserAuthChallenge.new
      challenge2 = UserAuthChallenge.new
      challenge1.token = "token1"
      challenge2.token = "token2"
      expect(challenge1.token_digest).not_to eq(challenge2.token_digest)
    end
  end

  describe "#authenticate" do
    let(:challenge) { UserAuthChallenge.new }
    let(:token) { "test_token" }

    before do
      challenge.token = token
    end

    it "returns true for the correct token" do
      expect(challenge.authenticate(token)).to be true
    end

    it "returns false for an incorrect token" do
      expect(challenge.authenticate("wrong_token")).to be false
    end
  end
end

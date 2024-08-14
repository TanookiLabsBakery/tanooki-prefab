require "rails_helper"

RSpec.describe "Factories" do
  it "lints all factory bot factories successfully" do
    FactoryBot.lint
  end
end

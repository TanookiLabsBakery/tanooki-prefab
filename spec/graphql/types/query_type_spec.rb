require "rails_helper"

RSpec.describe Types::QueryType do
  it "returns a test field" do
    result = graphql_data("{ testField }", current_user: nil)
    expect(result["testField"]).to eq("Hello World!")
  end
end

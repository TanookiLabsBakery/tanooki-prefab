require "rails_helper"

RSpec.describe "RootScreen", type: :system do
  before do
    visit root_path
  end

  it "displays the root screen with the correct data-testid" do
    expect(page).to have_css('[data-testid="root-screen"]')
  end
end

RSpec.describe "LandingScreen", type: :system do
  before do
    visit root_path
  end

  it "displays the landing screen with the correct data-testid" do
    expect(page).to have_css('[data-testid="landing-screen"]')
  end
end

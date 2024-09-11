require "rails_helper"

RSpec.describe "Authentication", type: :system do
  describe "Email and OTP login" do
    it "allows a user to log in with email and manually entered OTP" do
      user = create(:user, email: "user@example.com")
      visit login_path

      # Enter email
      fill_in "Email", with: user.email
      click_button "Send Login Link"

      # Verify email sent message
      expect(page).to have_content("Check your email for the login link")

      # Process the job queue to send the email
      perform_enqueued_jobs

      # Retrieve the last email sent
      email = ActionMailer::Base.deliveries.last
      expect(email).to be_present
      expect(email.to).to eq([user.email])

      otp_code = email.body.to_s[/id="otp-code"[^>]*>([^<]+)</, 1].strip
      expect(otp_code).to be_present
      expect(otp_code.length).to eq(6)

      click_button "Enter code manually"

      find("input[name='otp']").set(otp_code)

      click_button "Continue with login code"

      expect(page).to have_content("Authentication Successful")
    end

    it "allows a user to log in by following the email link" do
      user = create(:user, email: "user@example.com")
      visit login_path

      # Enter email
      fill_in "Email", with: user.email
      click_button "Send Login Link"

      # Verify email sent message
      expect(page).to have_content("Check your email for the login link")

      # Process the job queue to send the email
      perform_enqueued_jobs

      # Retrieve the last email sent
      email = ActionMailer::Base.deliveries.last
      expect(email).to be_present
      expect(email.to).to eq([user.email])

      # Extract the authentication URL and client auth code from the email
      auth_url = email.body.to_s[/href="([^"]+)"/, 1]
      client_auth_code = auth_url.split("/").last
      expect(auth_url).to be_present
      expect(client_auth_code).to be_present

      # Parse the path from the auth_url and visit it without the host
      auth_path = URI.parse(auth_url).path
      visit auth_path

      # Expect to see the authentication button
      expect(page).to have_button("Authenticate")

      # Click the authentication button
      click_button "Authenticate"

      # Expect to be redirected to the authenticated page
      expect(page).to have_content("Authentication Successful")
    end
  end
end

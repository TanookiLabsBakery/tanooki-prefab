require "rails_helper"

RSpec.describe AuthenticationMailer, type: :mailer do
  describe "auth_challenge_email" do
    let(:user) { create(:user, email: "user@example.com") }
    let(:token) { "123456" }
    let(:client_auth_code) { "abcdef" }
    let(:mail) { AuthenticationMailer.auth_challenge_email(user, token, client_auth_code).deliver_now }

    it "renders the headers" do
      expect(mail.subject).to eq("Login to #{AppConfig.app_name}")
      expect(mail.to).to eq([user.email]) # Extract email from formatted email
      expect(mail.from).to eq([AppConfig.default_from_email[/<(.+)>/, 1]]) # Ensure matching email extraction
    end

    it "renders the MJML content" do
      expect(mail.body.encoded).to match(/Login to #{AppConfig.app_name}/o)
      expect(mail.body.encoded).to match(/Click the following link to log in:/)
      expect(mail.body.encoded).to match(/This link and code will only be valid for the next/)
      expect(mail.body.encoded).to match(/#{token}/)
    end

    it "includes the correct login URL" do
      auth_url = Rails.application.routes.url_helpers.auth_email_url(email: user.email, token: token, client_auth_code: client_auth_code)
      expect(mail.body.encoded).to include(auth_url)
    end
  end
end

# Preview all emails at http://localhost:5100/rails/mailers/authentication_mailer
class AuthenticationMailerPreview < ActionMailer::Preview
  def reset_password_email
    user = User.new(
      email: "user@example.com",
      first_name: "Jane",
      last_name: "Smith",
      time_zone: "America/New_York"
    )
    AuthenticationMailer.reset_password_email(user)
  end

  def auth_challenge_email
    user = User.new(
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      time_zone: "America/New_York"
    )
    token = "143223"
    client_auth_code = "xyz789"
    AuthenticationMailer.auth_challenge_email(user, token, client_auth_code)
  end
end

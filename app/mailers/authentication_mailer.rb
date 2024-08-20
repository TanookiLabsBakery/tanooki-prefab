class AuthenticationMailer < ApplicationMailer
  def reset_password_email(user)
    @user = user
    mail subject: "Reset your password", to: @user.email_formatted
  end

  def auth_challenge_email(user, token, client_auth_code)
    @user = user
    @token = token
    @client_auth_code = client_auth_code
    @auth_url = auth_email_url(email: @user.email, token: @token, client_auth_code: @client_auth_code)

    mail(
      to: @user.email_formatted,
      subject: "Login to #{AppConstants::APP_NAME}"
    )
  end
end

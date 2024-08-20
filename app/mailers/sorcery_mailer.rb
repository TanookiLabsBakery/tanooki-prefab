class SorceryMailer < ApplicationMailer
  def reset_password_email(user)
    @user = user
    mail subject: "Reset your password", to: @user.email_formatted
  end
end

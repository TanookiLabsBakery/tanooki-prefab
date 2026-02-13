class ApplicationMailer < ActionMailer::Base
  default from: AppConfig.default_from_email
  layout "mailer"
end

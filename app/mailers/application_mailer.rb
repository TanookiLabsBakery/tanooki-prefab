class ApplicationMailer < ActionMailer::Base
  default from: AppConstants::DEFAULT_FROM_EMAIL
  layout "mailer"
end

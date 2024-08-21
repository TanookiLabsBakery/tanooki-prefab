class ExampleMailer < ApplicationMailer
  def example
    attachments.inline["example_logo.png"] = Rails.root.join("app", "assets", "images", "example_logo.png").read
    mail(to: "user@example.com", subject: "Example")
  end
end

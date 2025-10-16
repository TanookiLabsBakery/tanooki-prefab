# Preview all emails at http://localhost:5100/rails/mailers/example_mailer
class ExampleMailerPreview < ActionMailer::Preview
  def example
    ExampleMailer.example
  end
end

require "mail"

if ENV.key?("POSTMARK_API_TOKEN")
  ActionMailer::Base.delivery_method = :postmark
  ActionMailer::Base.postmark_settings = {
    api_token: ENV.fetch("POSTMARK_API_TOKEN")
  }
elsif ENV.key?("MAILTRAP_USER")
  ActionMailer::Base.delivery_method = :smtp
  ActionMailer::Base.smtp_settings = {
    user_name: ENV.fetch("MAILTRAP_USER"),
    password: ENV.fetch("MAILTRAP_PASSWORD"),
    address: "sandbox.smtp.mailtrap.io",
    domain: "sandbox.smtp.mailtrap.io",
    port: "2525",
    authentication: :cram_md5
  }
end

class MailInterceptor
  def self.delivering_email(message)
    domain_allowlist = ENV["EMAIL_HOST_ALLOWLIST"].then { |d| d&.split(",")&.map(&:strip) }

    to_addresses = message.to.is_a?(Array) ? message.to : [message.to]
    message.to = to_addresses.select do |to|
      domain = Mail::Address.new(to).domain
      domain_allowlist.include?(domain)
    end

    if message.to.empty?
      Rails.logger.info "Intercepted email to #{to_addresses} with subject: #{message.subject}"
      message.perform_deliveries = false
    end
  end
end

if ENV["EMAIL_HOST_ALLOWLIST"].present?
  ActionMailer::Base.register_interceptor(MailInterceptor)
end

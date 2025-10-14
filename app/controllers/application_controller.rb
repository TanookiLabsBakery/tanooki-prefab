class ApplicationController < ActionController::Base
  before_action :set_sentry_context

  def current_user
    @current_user ||= if session[:user_id]
      User.find_by(id: session[:user_id])
    elsif header_auth_token
      token_record = UserAuthToken.find_by(token: header_auth_token)
      token_record&.user
    end
  end

  def header_auth_token
    header = request.headers["HTTP_AUTHORIZATION"]
    return nil unless header.present?
    header.split(" ").last
  end

  private

  def set_sentry_context
    Sentry.set_user({id: current_user.id, email: current_user.email}) if current_user

    begin
      Sentry.configure_scope do |scope|
        scope.set_context("request", {params: params.to_unsafe_h, url: request.url})
      end
    rescue ActionDispatch::Http::Parameters::ParseError
    end
  end
end

class ApplicationController < ActionController::Base
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
end

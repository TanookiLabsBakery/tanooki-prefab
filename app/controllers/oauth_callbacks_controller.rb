require "net/http"
require "json"
require "cgi"

class OauthCallbacksController < ApplicationController
  THREADS_AUTH_URL = "https://www.threads.net/oauth/authorize"
  THREADS_TOKEN_URL = "https://graph.threads.net/oauth/access_token"
  THREADS_PROFILE_URL = "https://graph.threads.net/v1.0/me"
  THREADS_SCOPES = "threads_basic,threads_content_publish"

  def threads_authorize
    unless current_user
      redirect_to "/login" and return
    end

    unless current_user.organization_id.present?
      redirect_to "/dashboard" and return
    end

    state = SecureRandom.hex(16)
    session[:oauth_state] = state
    session[:oauth_provider] = "threads"

    query = URI.encode_www_form(
      client_id: ENV["THREADS_CLIENT_ID"],
      redirect_uri: threads_callback_url,
      scope: THREADS_SCOPES,
      response_type: "code",
      state: state
    )

    redirect_to "#{THREADS_AUTH_URL}?#{query}", allow_other_host: true
  end

  def threads
    unless current_user
      redirect_to "/login" and return
    end

    unless current_user.organization_id.present?
      redirect_to "/dashboard" and return
    end

    if params[:error].present?
      redirect_to "/dashboard/channels/connect?error=#{CGI.escape(params[:error])}" and return
    end

    if params[:state] != session.delete(:oauth_state)
      redirect_to "/dashboard/channels/connect?error=invalid_state" and return
    end

    code = params[:code]
    if code.blank?
      redirect_to "/dashboard/channels/connect?error=missing_code" and return
    end

    token_data = exchange_threads_code(code)
    if token_data[:error].present?
      Rails.logger.error("Threads token exchange error: #{token_data[:error]}")
      redirect_to "/dashboard/channels/connect?error=token_exchange_failed" and return
    end

    access_token = token_data[:access_token]
    profile = fetch_threads_profile(access_token)

    credential = current_user.organization.credentials.create!(
      provider: "threads",
      access_token: access_token,
      expires_at: expires_at_string(token_data[:expires_in])
    )

    name = profile[:username] || profile[:name] || "Threads Account"
    remote_id = profile[:id].to_s

    finish_params = URI.encode_www_form(
      credential_id: credential.id,
      name: name,
      remote_id: remote_id
    )

    redirect_to "/dashboard/channels/connect/finish?#{finish_params}"
  end

  private

  def threads_callback_url
    "#{AppOrigin.url}/auth/threads/callback"
  end

  def exchange_threads_code(code)
    uri = URI(THREADS_TOKEN_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 10
    http.read_timeout = 10

    request = Net::HTTP::Post.new(uri.path)
    request.set_form_data(
      client_id: ENV["THREADS_CLIENT_ID"],
      client_secret: ENV["THREADS_CLIENT_SECRET"],
      grant_type: "authorization_code",
      redirect_uri: threads_callback_url,
      code: code
    )

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  rescue => e
    {error: e.message}
  end

  def fetch_threads_profile(access_token)
    uri = URI(THREADS_PROFILE_URL)
    uri.query = URI.encode_www_form(fields: "id,username", access_token: access_token)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 10
    http.read_timeout = 10

    response = http.get(uri.request_uri)
    JSON.parse(response.body, symbolize_names: true)
  rescue => e
    Rails.logger.error("Threads profile fetch error: #{e.message}")
    {id: SecureRandom.hex(8), username: "Threads User"}
  end

  def expires_at_string(expires_in)
    return nil unless expires_in
    expires_in.to_i.seconds.from_now.iso8601
  end
end

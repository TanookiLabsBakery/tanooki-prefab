# frozen_string_literal: true

class GraphqlController < ApplicationController
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  # protect_from_forgery with: :null_session

  before_action :raise_on_invalid_token

  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      session: session,
      current_user: current_user,
      cookies: cookies,
      login: ->(email, password, remember_me) {
        login(email, password, remember_me)
      },
      auto_login: ->(email) {
        user = User.find_by(email: email)
        auto_login(user, true) if user
        user
      },
      logout: -> { logout }
    }

    # Add form_authenticity_token to context if the method is available
    context[:form_authenticity_token] = -> { form_authenticity_token }
    result = AppSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render(json: result)
  rescue => e
    raise e unless Rails.env.development?
    handle_error_in_development(e)
  end

  private

  def raise_on_invalid_token
    if request.headers["HTTP_AUTHORIZATION"] && !current_user
      render json: {
        errors: [
          {message: "Session Not Found",
           extensions: {
             code: "FORBIDDEN"
           }}
        ],
        data: {}
      }, status: 401
    end
  end

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end

    when Hash
      variables_param
    when ActionController::Parameters
      # GraphQL-Ruby will validate name and type of incoming variables.
      variables_param.to_unsafe_hash
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(e)
    logger.error(e.message)
    logger.error(e.backtrace.join("\n"))

    render(json: {errors: [{message: e.message, backtrace: e.backtrace}], data: {}}, status: 500)
  end
end

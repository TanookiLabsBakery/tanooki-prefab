Rails.application.routes.draw do
  if Rails.env.development?
    mount(LetterOpenerWeb::Engine, at: "/letter_opener")
  end

  constraints UserConstraint.new { |user| Rails.env.development? || user&.user_role_system_admin? } do
    get "/graphiql", to: "graphiql#index", as: "graphiql"
    require "sidekiq/web"
    mount Sidekiq::Web => "/sidekiq"
  end

  if ENV["REDIRECT_TO_ORIGIN"].present?
    get(
      "/(*path)",
      to: redirect { |_, request| "#{AppOrigin.url}#{request.fullpath}" },
      constraints: ->(request) { request.base_url != AppOrigin.url },
      status: 302
    )
  end

  post("/graphql", to: "graphql#execute")

  get "/auth/threads", to: "oauth_callbacks#threads_authorize", as: :threads_oauth_authorize
  get "/auth/threads/callback", to: "oauth_callbacks#threads", as: :threads_oauth_callback
  get("up" => "rails/health#show", :as => :rails_health_check)

  # Render dynamic PWA files from app/views/pwa/*
  get("service-worker" => "rails/pwa#service_worker", :as => :pwa_service_worker)
  get("manifest" => "rails/pwa#manifest", :as => :pwa_manifest)

  # chrome dev tools seems to make requests to this route
  get "/.well-known/appspecific/com.chrome.devtools.json", to: ->(env) { [200, {"Content-Type" => "application/json"}, ["{}"]] }

  get "/approve/:token", to: "approvals#show", as: :show_approval, constraints: {token: /[^\/]+/}
  post "/approve/:token/approve", to: "approvals#approve", as: :approve_with_token, constraints: {token: /[^\/]+/}
  post "/approve/:token/reject", to: "approvals#reject", as: :reject_with_token, constraints: {token: /[^\/]+/}

  root("spa#index")
  get("login", to: "spa#index", as: :login)
  get("auth/email/:email/:token/:client_auth_code", to: "spa#index", as: :auth_email)
  get(
    "*path",
    to: "spa#index",
    constraints: lambda { |req|
      req.path.exclude?("rails/") && req.path.exclude?("images/")
    }
  )
end

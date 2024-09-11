Rails.application.routes.draw do
  if Rails.env.development?
    mount(GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql")
    mount(LetterOpenerWeb::Engine, at: "/letter_opener")
  end

  unless Rails.env.test?
    get(
      "/(*path)",
      to: redirect { |_, request| "#{ENV.fetch("ORIGIN")}#{request.fullpath}" },
      constraints: ->(request) { request.base_url != ENV.fetch("ORIGIN") },
      status: 302
    )
  end

  post("/graphql", to: "graphql#execute")
  get("up" => "rails/health#show", :as => :rails_health_check)

  # Render dynamic PWA files from app/views/pwa/*
  get("service-worker" => "rails/pwa#service_worker", :as => :pwa_service_worker)
  get("manifest" => "rails/pwa#manifest", :as => :pwa_manifest)

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

Rails.application.configure do
  config.lograge.enabled = ENV["DISABLE_LOGRAGE"].blank?
  config.lograge.formatter = Lograge::Formatters::Json.new
  config.lograge.custom_options = lambda do |event|
    if event.payload[:controller] == "GraphqlController"
      GraphqlLogHelper.log_details(event.payload[:params])
    else
      {params: event.payload[:params]}
    end.compact
  end
end

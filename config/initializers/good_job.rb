Rails.application.configure do
  # https://github.com/bensheldon/good_job#configuration-options
  config.good_job.on_thread_error = ->(exception) { Sentry.capture_exception(exception) }
  config.good_job.execution_mode = :external
  config.cleanup_preserved_jobs_before_seconds_ago = 7.days.to_i

  if Rails.env.production?
    config.good_job.enable_cron = ENV["DYNO"] == "worker.1"
  end

  # config.good_job.cron = {
  #   daily_notifications_job: {
  #     cron: "0 4 * * *", # every day at 4am
  #     class: "DailyNotificationsJob"
  #   },
  # }
end

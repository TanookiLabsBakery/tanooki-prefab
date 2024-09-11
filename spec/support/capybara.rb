require "capybara/cuprite"
require "uri"

Capybara.javascript_driver = :cuprite
Capybara.server = :thruster

RSpec.configure do |config|
  config.prepend_before(:each, type: :system) do
    driven_by Capybara.javascript_driver, options: {
      window_size: [1280, 832],
      browser_options: {}, # {"no-sandbox": nil} required for docker
      timeout: 30,
      process_timeout: 240,
      inspector: ENV.fetch("CUPRITE_INSPECTOR", false)
    }
  end

  config.filter_gems_from_backtrace("capybara", "cuprite", "ferrum")
end

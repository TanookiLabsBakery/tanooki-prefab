# config/initializers/mjml.rb
Mjml.setup do |config|
  # Use :haml as a template language
  # config.template_language = :haml

  # Ignore errors silently
  # config.raise_render_exception = false

  # Optimize the size of your emails
  # config.beautify = false
  # config.minify = true

  # Render MJML templates with errors
  # config.validation_level = "soft"

  # Use MRML instead of MJML, false by default
  # config.use_mrml = false

  # Use custom MJML binary with custom version
  # config.mjml_binary = "/path/to/custom/mjml"
  # config.mjml_binary_version_supported = "3.3.5"

  # Use default system fonts instead of google fonts
  # config.fonts = {}
end

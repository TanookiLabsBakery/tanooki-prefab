# frozen_string_literal: true

# Configure iframe embedding permissions for AllSpark builder integration
#
# When ALLSPARK_ORIGIN is set, this automatically allows the app to be embedded
# in iframes from the AllSpark builder (creator subdomain).
#
# The builder runs on a different origin (creator.*.allspark.build) while
# the target runs on (*.allspark.build), so we need to explicitly allow
# cross-origin embedding via CSP frame-ancestors.

if ENV["ALLSPARK_ORIGIN"].present?
  # Allow the creator subdomain to embed us
  # e.g., if ALLSPARK_ORIGIN is https://myapp.allspark.build
  # then allow https://creator.myapp.allspark.build
  uri = URI.parse(ENV["ALLSPARK_ORIGIN"])
  creator_origin = "#{uri.scheme}://creator.#{uri.host}"
  frame_ancestors = "'self' #{creator_origin}"

  # Must set default_headers during initialization, not in after_initialize block
  # Use CSP frame-ancestors (modern, more flexible than X-Frame-Options)
  Rails.application.config.action_dispatch.default_headers["Content-Security-Policy"] = "frame-ancestors #{frame_ancestors};"

  # Remove X-Frame-Options in favor of CSP frame-ancestors
  # X-Frame-Options is deprecated and less flexible
  Rails.application.config.action_dispatch.default_headers.delete("X-Frame-Options")
end

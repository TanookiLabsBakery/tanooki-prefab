# frozen_string_literal: true

# Configure iframe embedding permissions for AllSpark builder integration
#
# Supports two deployment patterns:
# 1. Traditional: ALLSPARK_ORIGIN set (e.g., https://myapp.allspark.build)
#    Allows embedding from https://creator.myapp.allspark.build
# 2. Sprites: Auto-detected via *.sprites.app domain
#    Allows embedding from https://creator.console.allspark.build
#
# The builder runs on a different origin than the target app, so we need to
# explicitly allow cross-origin embedding via CSP frame-ancestors.

# Detect if we're running on a sprites.app domain
running_on_sprite = ENV["HOSTNAME"]&.include?("sprites.app") ||
                    ENV["APP_HOST"]&.include?("sprites.app")

if ENV["ALLSPARK_ORIGIN"].present? || running_on_sprite
  if running_on_sprite
    # Sprite deployment: allow embedding from creator.console.allspark.build
    creator_origin = "https://creator.console.allspark.build"
    frame_ancestors = "'self' #{creator_origin}"
  else
    # Traditional deployment: derive creator origin from ALLSPARK_ORIGIN
    uri = URI.parse(ENV["ALLSPARK_ORIGIN"])
    creator_origin = "#{uri.scheme}://creator.#{uri.host}"
    frame_ancestors = "'self' #{creator_origin}"
  end

  # Must set default_headers during initialization, not in after_initialize block
  # Use CSP frame-ancestors (modern, more flexible than X-Frame-Options)
  Rails.application.config.action_dispatch.default_headers["Content-Security-Policy"] = "frame-ancestors #{frame_ancestors};"

  # Remove X-Frame-Options in favor of CSP frame-ancestors
  # X-Frame-Options is deprecated and less flexible
  Rails.application.config.action_dispatch.default_headers.delete("X-Frame-Options")

  Rails.logger.info "[IframeEmbedding] Enabled iframe embedding from: #{creator_origin}"
end

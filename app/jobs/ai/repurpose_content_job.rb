# frozen_string_literal: true

module Ai
  class RepurposeContentJob < ApplicationJob
    def perform(post_id)
      post = Post.find(post_id)
      Mcp::RepurposeContentService.new(post).call
    end
  end
end

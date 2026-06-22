# frozen_string_literal: true

module Posts
  class PublishPostJob < ApplicationJob
    def perform(post_id)
      post = Post.find(post_id)
      post.update!(status: :published)
    end
  end
end

# frozen_string_literal: true

module Mutations
  module Posts
    class PostRepurpose < BaseMutation
      description "Enqueues an AI repurpose job for a post, generating channel-optimized variants"

      field :post, Types::Objects::PostType, null: false

      argument :post_id, ID, required: true

      def resolve(post_id:)
        post = ::Post.find(post_id)
        authorize! post, to: :repurpose?

        Ai::RepurposeContentJob.perform_later(post.id)

        {post: post}
      end
    end
  end
end

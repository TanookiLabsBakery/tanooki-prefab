# frozen_string_literal: true

module Mutations
  module Posts
    class PostApprove < BaseMutation
      description "Approves a post, changing its status from needs_approval to draft"

      field :post, Types::Objects::PostType, null: false

      argument :post_id, ID, required: true

      def resolve(post_id:)
        post = ::Post.find(post_id)
        authorize! post, to: :approve?

        post.update!(status: :draft)
        {post: post}
      end
    end
  end
end

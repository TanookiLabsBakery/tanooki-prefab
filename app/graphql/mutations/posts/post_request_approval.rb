# frozen_string_literal: true

module Mutations
  module Posts
    class PostRequestApproval < BaseMutation
      description "Requests approval for a post, changing its status to needs_approval"

      field :post, Types::Objects::PostType, null: false

      argument :post_id, ID, required: true

      def resolve(post_id:)
        post = ::Post.find(post_id)
        authorize! post, to: :request_approval?

        post.update!(status: :needs_approval)
        {post: post}
      end
    end
  end
end

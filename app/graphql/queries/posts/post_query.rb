# frozen_string_literal: true

module Queries
  module Posts
    class PostQuery < BaseQuery
      type Types::Objects::PostType, null: true

      argument :id, ID, required: true

      def resolve(id:)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to view posts" unless organization

        post = ::Post
          .where(organization_id: organization.id)
          .includes(post_channel_variants: [:channel, :post_analytic])
          .find_by(id: id)

        return nil unless post

        authorize! post, to: :show?, with: PostPolicy

        post
      end
    end
  end
end

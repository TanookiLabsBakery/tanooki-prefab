# frozen_string_literal: true

module Queries
  module Posts
    class PaginatedPostsQuery < BaseQuery
      type Types::Objects::PostType.connection_type, null: false

      argument :status, Types::Enums::PostStatusType, required: false

      def resolve(status: nil)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to view posts" unless organization

        authorize! ::Post, to: :index?, with: PostPolicy

        scope = ::Post
          .where(organization_id: organization.id)
          .includes(:channels, :post_channel_variants)
          .order(created_at: :desc)

        scope = scope.where(status: status) if status
        scope
      end
    end
  end
end

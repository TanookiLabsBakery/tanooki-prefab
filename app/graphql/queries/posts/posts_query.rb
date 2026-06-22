# frozen_string_literal: true

module Queries
  module Posts
    class PostsQuery < BaseQuery
      type [Types::Objects::PostType], null: false

      argument :start_date, GraphQL::Types::ISO8601Date, required: true
      argument :end_date, GraphQL::Types::ISO8601Date, required: true

      def resolve(start_date:, end_date:)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to view posts" unless organization

        authorize! ::Post, to: :index?, with: PostPolicy

        ::Post
          .where(organization_id: organization.id)
          .where(scheduled_at: start_date.beginning_of_day..end_date.end_of_day)
          .includes(:post_channel_variants, channels: [])
          .order(:scheduled_at)
      end
    end
  end
end

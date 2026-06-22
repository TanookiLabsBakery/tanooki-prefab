# frozen_string_literal: true

module Queries
  module Dashboard
    class DashboardQuery < BaseQuery
      type Types::Objects::DashboardType, null: false

      def resolve
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization to view the dashboard" unless organization

        authorize! ::Post, to: :index?, with: PostPolicy

        {
          scheduled_posts: ::Post
            .where(organization_id: organization.id, status: "scheduled")
            .where("scheduled_at > ?", Time.current)
            .includes(post_channel_variants: :channel)
            .order(:scheduled_at)
            .limit(5),
          needs_approval_posts: ::Post
            .where(organization_id: organization.id, status: "needs_approval")
            .includes(post_channel_variants: :channel)
            .order(updated_at: :desc)
            .limit(10),
          recent_published_posts: ::Post
            .where(organization_id: organization.id, status: "published")
            .includes(post_channel_variants: [:channel, :post_analytic])
            .order(scheduled_at: :desc)
            .limit(5),
          channels: ::Channel
            .where(organization_id: organization.id)
            .order(:name)
        }
      end
    end
  end
end

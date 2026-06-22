# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    include ActionPolicy::GraphQL::Behaviour

    field :node, resolver: Queries::NodeQuery, authorize: true
    field :nodes, resolver: Queries::NodesQuery
    field :viewer, resolver: Queries::ViewerQuery
    field :post, resolver: Queries::Posts::PostQuery
    field :posts, resolver: Queries::Posts::PaginatedPostsQuery
    field :calendar_posts, resolver: Queries::Posts::PostsQuery
    field :best_time_suggestion, resolver: Queries::Posts::BestTimeSuggestionQuery
    field :hashtag_suggestion, resolver: Queries::Ai::HashtagSuggestionQuery
    field :lint_post, resolver: Queries::Ai::LintPostQuery
    field :dashboard, resolver: Queries::Dashboard::DashboardQuery
    field :channel_analytics, resolver: Queries::ChannelAnalytics::ChannelAnalyticsQuery
    field :ui_access, Types::Objects::UiAccessType, null: false

    def ui_access
      true
    end
    field :internal_admin_users, resolver: Queries::InternalAdmin::UsersQuery
  end
end

# frozen_string_literal: true

module Queries
  module Posts
    class BestTimeSuggestionQuery < BaseQuery
      type [GraphQL::Types::ISO8601DateTime], null: false

      argument :channel_id, ID, required: true

      def resolve(channel_id:)
        organization = context[:current_user]&.organization
        raise GraphQL::ExecutionError, "You must belong to an organization" unless organization

        channel = ::Channel.find_by(id: channel_id, organization_id: organization.id)
        raise GraphQL::ExecutionError, "Channel not found" unless channel

        ::Mcp::BestTimeSuggestionService.new(channel).call
      end
    end
  end
end

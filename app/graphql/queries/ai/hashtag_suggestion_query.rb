# frozen_string_literal: true

module Queries
  module Ai
    class HashtagSuggestionQuery < BaseQuery
      type [String], null: false

      argument :content, String, required: true

      def resolve(content:)
        authorize! :ai, to: :access?, with: AiPolicy

        ::Mcp::HashtagResearchService.new(content).call
      end
    end
  end
end

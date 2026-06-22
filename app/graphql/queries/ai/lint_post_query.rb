# frozen_string_literal: true

module Queries
  module Ai
    class LintPostQuery < BaseQuery
      type Types::Objects::BrandVoiceLintResultType, null: false

      argument :content, String, required: true

      def resolve(content:)
        authorize! :ai, to: :access?, with: AiPolicy

        organization = context[:current_user].organization
        guidelines = organization&.brand_voice_guidelines

        ::Mcp::BrandVoiceLinterService.new(content, guidelines).call
      end
    end
  end
end

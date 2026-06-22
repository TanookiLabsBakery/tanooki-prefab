# frozen_string_literal: true

module Mutations
  module Posts
    class PostGenerateVariants < BaseMutation
      description "Generates AI-powered post variants for each specified channel using shared text and brand voice guidelines"

      argument :shared_text, String, required: true
      argument :channel_ids, [ID], required: true

      field :variants, [Types::PostVariantType], null: false

      def resolve(shared_text:, channel_ids:)
        organization = context[:current_user].organization
        raise GraphQL::ExecutionError, "No organization found" unless organization

        post = Post.new(organization: organization)
        authorize! post, to: :create?

        channels = Channel.where(organization: organization, id: channel_ids)

        variants = Mcp::GenerateVariantsService.new(
          shared_text: shared_text,
          channels: channels,
          organization: organization
        ).call

        {variants: variants}
      end
    end
  end
end

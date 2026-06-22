# frozen_string_literal: true

module Mutations
  module Posts
    class PostRepurposeFromUrl < BaseMutation
      description "Fetches a URL, extracts its content, and generates AI-powered post variants for each specified channel"

      argument :url, String, required: true
      argument :channel_ids, [ID], required: true

      field :variants, [Types::PostVariantType], null: false

      def resolve(url:, channel_ids:)
        organization = context[:current_user].organization
        raise GraphQL::ExecutionError, "No organization found" unless organization

        post = Post.new(organization: organization)
        authorize! post, to: :create?

        channels = Channel.where(organization: organization, id: channel_ids)
        shared_text = extract_content_from_url(url)

        variants = Mcp::GenerateVariantsService.new(
          shared_text: shared_text,
          channels: channels,
          organization: organization
        ).call

        {variants: variants}
      end

      private

      def extract_content_from_url(url)
        response = HTTParty.get(url, timeout: 10)
        doc = Nokogiri::HTML(response.body)

        title = doc.at("title")&.text.to_s.strip
        body_text = doc.at("body")&.text.to_s.gsub(/\s+/, " ").strip

        [title, body_text].reject(&:blank?).join("\n\n")
      end
    end
  end
end

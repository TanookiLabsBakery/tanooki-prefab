# frozen_string_literal: true

module Mcp
  class GenerateVariantsService < BaseService
    PostVariant = Data.define(:channel_id, :body)

    def initialize(shared_text:, channels:, organization:)
      @shared_text = shared_text
      @channels = channels
      @organization = organization
    end

    def call
      @channels.map { |channel| generate_variant(channel) }
    end

    private

    attr_reader :shared_text, :organization

    def generate_variant(channel)
      response = call_api(
        messages: [{role: "user", content: build_prompt(channel)}],
        max_tokens: 1024
      )
      body = extract_text(response).to_s
      PostVariant.new(channel_id: channel.id, body: body)
    end

    def build_prompt(channel)
      guidelines = brand_voice_guidelines

      prompt_parts = [
        "You are a social media content expert. Adapt the following content for #{channel.provider.capitalize} (#{channel.name})."
      ]

      if guidelines.present?
        prompt_parts << "\nBrand Voice Guidelines:"
        prompt_parts << "- Tone: #{guidelines["tone"]}" if guidelines["tone"].present?
        if guidelines["messaging_pillars"].present?
          prompt_parts << "- Messaging pillars: #{Array(guidelines["messaging_pillars"]).join(", ")}"
        end
        if guidelines["words_to_avoid"].present?
          prompt_parts << "- Words to avoid: #{Array(guidelines["words_to_avoid"]).join(", ")}"
        end
        if guidelines["approved_hashtag_sets"].present?
          prompt_parts << "- Approved hashtags: #{Array(guidelines["approved_hashtag_sets"]).join(", ")}"
        end
      end

      prompt_parts << "\nOriginal content:\n#{shared_text}"
      prompt_parts << "\nReturn only the adapted post text, nothing else."

      prompt_parts.join("\n")
    end

    def brand_voice_guidelines
      return {} if organization.brand_voice_guidelines.blank?
      JSON.parse(organization.brand_voice_guidelines)
    rescue JSON::ParserError
      {}
    end
  end
end

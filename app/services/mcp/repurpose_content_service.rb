# frozen_string_literal: true

module Mcp
  class RepurposeContentService < BaseService
    def initialize(post)
      @post = post
    end

    def call
      variants = @post.post_channel_variants.includes(:channel)
      return if variants.empty?

      original_content = variants.first.body
      return if original_content.blank?

      variants.each do |variant|
        provider_name = variant.channel.provider.capitalize
        response = call_api(
          messages: [{role: "user", content: build_prompt(original_content, provider_name)}],
          max_tokens: 1024
        )

        generated_text = extract_text(response)
        variant.update!(body: generated_text) if generated_text.present?
      end
    end

    private

    def build_prompt(content, provider)
      <<~PROMPT
        You are a social media expert. Adapt the following post for #{provider}.

        Original post:
        #{content}

        Write an optimized version for #{provider}. Consider the platform's tone, character limits, and best practices. Return only the post text with no additional commentary.
      PROMPT
    end
  end
end

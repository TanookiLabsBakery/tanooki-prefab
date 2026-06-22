# frozen_string_literal: true

module Mcp
  class HashtagResearchService < BaseService
    def initialize(content)
      @content = content
    end

    def call
      return [] if @content.blank?

      response = call_api(
        messages: [{role: "user", content: build_prompt}],
        max_tokens: 512
      )

      parse_hashtags(extract_text(response))
    end

    private

    def build_prompt
      <<~PROMPT
        You are a social media expert. Based on the following post content, suggest 8-12 relevant and trending hashtags.

        Post content:
        #{@content}

        Return only a JSON array of hashtag strings including the # symbol, for example: ["#example", "#social"]. No other text, just the JSON array.
      PROMPT
    end

    def parse_hashtags(text)
      return [] if text.blank?

      JSON.parse(text.strip)
    rescue JSON::ParserError
      text.scan(/#\w+/).first(12)
    end
  end
end

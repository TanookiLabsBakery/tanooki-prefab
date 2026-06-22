# frozen_string_literal: true

module Mcp
  class BrandVoiceLinterService < BaseService
    def initialize(content, guidelines)
      @content = content
      @guidelines = guidelines
    end

    def call
      return empty_result if @content.blank? || @guidelines.blank?

      response = call_api(
        messages: [{role: "user", content: build_prompt}],
        max_tokens: 1024
      )

      parse_result(extract_text(response))
    end

    private

    def empty_result
      {compliant: true, issues: [], suggestions: []}
    end

    def build_prompt
      <<~PROMPT
        You are a brand voice compliance reviewer. Evaluate the following post content against the organization's brand voice guidelines and provide constructive feedback.

        Brand Voice Guidelines:
        #{@guidelines}

        Post Content:
        #{@content}

        Analyze the post for compliance with the guidelines. Return a JSON object with exactly these fields:
        - "compliant": boolean (true if the post aligns with the guidelines, false if it deviates)
        - "issues": array of strings describing specific deviations from the guidelines (empty array if compliant)
        - "suggestions": array of strings with actionable, constructive suggestions to better align with the brand voice (empty array if compliant)

        Be constructive and specific. Focus on tone, vocabulary, style, and messaging alignment.
        Return only valid JSON, no other text.
      PROMPT
    end

    def parse_result(text)
      return empty_result if text.blank?

      result = JSON.parse(text.strip)
      {
        compliant: result["compliant"] == true,
        issues: Array(result["issues"]).map(&:to_s),
        suggestions: Array(result["suggestions"]).map(&:to_s)
      }
    rescue JSON::ParserError
      empty_result
    end
  end
end
